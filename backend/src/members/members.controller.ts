import { Controller, Get, Query } from "@nestjs/common";
import { MembersService } from "./members.service";
import { GetMembersDto } from "./dto/get-members.dto";
import { PaginatedMembersResponse } from "./dto/member-response.dto";

@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async getMembers(
    @Query() query: GetMembersDto
  ): Promise<PaginatedMembersResponse> {
    return this.membersService.getMembers(query);
  }

  @Get("roles")
  async getRoles(): Promise<string[]> {
    return this.membersService.getAllRoles();
  }
}
