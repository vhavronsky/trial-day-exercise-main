import { Controller, Get } from '@nestjs/common';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('count')
  async getMemberCount(): Promise<{ count: number }> {
    const count = await this.membersService.getMemberCount();
    return { count };
  }
}
