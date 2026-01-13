import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async getMemberCount(): Promise<number> {
    const count = await this.prisma.user.count({
      where: {
        memberships: {
          some: {}, // User must have at least one membership
        },
      },
    });
    return count;
  }
}
