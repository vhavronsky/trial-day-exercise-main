import { Controller, Get } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamResponse } from "./dto/team-response.dto";

@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  async findAll(): Promise<TeamResponse[]> {
    return this.teamsService.findAll();
  }
}
