import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UserWithRelations } from "./types";
import { memberInclude } from "./constants";
import { GetMembersDto, SortField, SortOrder } from "./dto/get-members.dto";
import {
  MemberResponse,
  PaginatedMembersResponse,
} from "./dto/member-response.dto";

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async getMembers(query: GetMembersDto): Promise<PaginatedMembersResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(query);
    const orderBy = this.buildOrderByClause(query);

    const [total, rawUsers] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: memberInclude,
      }),
    ]);

    const data = this.transformMembers(rawUsers);

    // NOTE: Sorting by role and teams is done in-memory (within current page only).
    // TODO: For proper global sorting with pagination, implement raw SQL query.
    // This is a known limitation - these sorts work within the current page but
    // don't provide globally correct ordering across all pages.
    const sortOrder = query.sortOrder ?? SortOrder.ASC;
    if (query.sortBy === SortField.TEAMS) {
      this.sortByTeams(data, sortOrder);
    } else if (query.sortBy === SortField.ROLE) {
      this.sortByRole(data, sortOrder);
    }


    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getAllRoles(): Promise<string[]> {
    const roles = await this.prisma.membership.findMany({
      select: { role: true },
      distinct: ["role"],
      orderBy: { role: "asc" },
    });

    return roles.map((r) => r.role);
  }

  async getTotalCount(): Promise<number> {
    return this.prisma.user.count({
      where: {
        memberships: {
          some: {},
        },
      },
    });
  }

  private buildWhereClause(query: GetMembersDto): Prisma.UserWhereInput {
    const conditions: Prisma.UserWhereInput[] = [];

    // Base condition: user must have a membership (be part of the organization)
    conditions.push({
      memberships: {
        some: {},
      },
    });

    // Filter by role(s) - user's membership role must be in the list
    if (query.roles && query.roles.length > 0) {
      conditions.push({
        memberships: {
          some: {
            role: {
              in: query.roles,
            },
          },
        },
      });
    }

    // Filter by guest status
    if (query.isGuest !== undefined) {
      conditions.push({
        memberships: {
          some: {
            isGuest: query.isGuest,
          },
        },
      });
    }

    // Filter by team(s) - user must be in ANY of the selected teams
    if (query.teamIds && query.teamIds.length > 0) {
      conditions.push({
        teamLinks: {
          some: {
            teamId: {
              in: query.teamIds,
            },
          },
        },
      });
    }

    // Filter users with no team assigned
    if (query.hasNoTeam === true) {
      conditions.push({
        teamLinks: {
          none: {},
        },
      });
    }

    // Text search on name or email (case-insensitive with LIKE)
    if (query.search && query.search.trim()) {
      const searchTerm = query.search.trim();
      conditions.push({
        OR: [
          {
            name: {
              contains: searchTerm,
            },
          },
          {
            email: {
              contains: searchTerm,
            },
          },
        ],
      });
    }

    // Combine all conditions with AND
    return {
      AND: conditions,
    };
  }

  private buildOrderByClause(
    query: GetMembersDto
  ):
    | Prisma.UserOrderByWithRelationInput
    | Prisma.UserOrderByWithRelationInput[] {
    const sortOrder = query.sortOrder ?? SortOrder.ASC;

    // Default sort by name if not specified
    if (!query.sortBy) {
      return { name: sortOrder };
    }

    switch (query.sortBy) {
      case SortField.NAME:
        return { name: sortOrder };

      case SortField.EMAIL:
        return { email: sortOrder };

      case SortField.LAST_LOGIN_AT:
        // Sort nulls last for ascending, nulls first for descending
        // Prisma doesn't have native nulls handling, so we use a workaround:
        // For lastLoginAt, null means "never logged in"
        return { lastLoginAt: sortOrder };

      case SortField.ROLE:
        // Role sorting is handled in-memory after fetching
        // Return default sort for now, actual sorting happens in getMembers()
        return { name: sortOrder };

      case SortField.TEAMS:
        // Teams sorting is complex - we'll handle it in-memory after fetching
        // Return default sort for now, actual sorting happens in getMembers()
        return { name: sortOrder };

      default:
        return { name: sortOrder };
    }
  }

  private transformMembers(rawUsers: UserWithRelations[]): MemberResponse[] {
    return rawUsers.map((user) => {
      const membership = user.memberships[0]!;

      const teams = user.teamLinks
        .map((link) => link.team.name)
        .sort((a, b) => a.localeCompare(b));

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        lastLoginAt: user.lastLoginAt,
        role: membership.role,
        isGuest: membership.isGuest,
        teams,
      };
    });
  }

  private sortByTeams(members: MemberResponse[], order: SortOrder): void {
    members.sort((a, b) => {
      // Handle empty teams arrays
      const aTeam = a.teams[0] ?? "";
      const bTeam = b.teams[0] ?? "";

      // Users with no teams go last for ascending, first for descending
      if (a.teams.length === 0 && b.teams.length > 0) {
        return order === SortOrder.ASC ? 1 : -1;
      }
      if (b.teams.length === 0 && a.teams.length > 0) {
        return order === SortOrder.ASC ? -1 : 1;
      }

      // Compare first team names
      const comparison = aTeam.localeCompare(bTeam);
      return order === SortOrder.ASC ? comparison : -comparison;
    });
  }

  private sortByRole(members: MemberResponse[], order: SortOrder): void {
    members.sort((a, b) => {
      const comparison = a.role.localeCompare(b.role);
      return order === SortOrder.ASC ? comparison : -comparison;
    });
  }
}
