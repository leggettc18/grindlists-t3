import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";


export const listItemRouter = createTRPCRouter({
    byListId: privateProcedure.input(z.object({
        listId: z.string(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.listItem.findMany({
            where: {
                list: {
                    id: input.listId,
                }
            },
            include: {
                item: true
            }
        });
    }),
})
