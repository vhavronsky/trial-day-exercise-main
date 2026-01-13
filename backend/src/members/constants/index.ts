import { Prisma } from "@prisma/client";

export const memberInclude = {
  teamLinks: {
    select: {
      team: {
        select: {
          name: true,
        },
      },
    },
  },
  memberships: {
    select: {
      role: true,
      isGuest: true,
    },
  },
} satisfies Prisma.UserInclude;
