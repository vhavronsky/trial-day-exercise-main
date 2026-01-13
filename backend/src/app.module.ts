import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { MembersModule } from "./members/members.module";
import { TeamsModule } from "./teams/teams.module";

@Module({
  imports: [PrismaModule, MembersModule, TeamsModule],
  controllers: [AppController],
})
export class AppModule {}
