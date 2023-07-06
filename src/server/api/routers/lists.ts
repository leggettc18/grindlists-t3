import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
    byCurrentUser: privateProcedure.query(({ ctx }) => {
        return ctx.prisma.list.findMany({
            where: {
                authorId: ctx.userId,
            }
        });
    }),
})
