import { Prisma } from "@prisma/client";
import { memberInclude } from "../constants";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: typeof memberInclude;
}>;
