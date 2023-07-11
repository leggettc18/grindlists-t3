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
    create: privateProcedure.input(z.object({
        itemId: z.string(),
        listId: z.string(),
        quantity: z.number().min(0).default(0),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.listItem.create({
            data: {
                itemId: input.itemId,
                listId: input.listId,
                quantity: input.quantity,
            }
        });
    }),
    update: privateProcedure.input(z.object({
        listItemId: z.string(),
        quantity: z.number().min(0),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.listItem.update({
            where: {
                id: input.listItemId,
            },
            data: {
                quantity: input.quantity,
            }
        });
    }),
})
