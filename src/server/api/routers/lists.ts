import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
    byCurrentUser: privateProcedure.query(({ ctx }) => {
        return ctx.prisma.list.findMany({
            where: {
                authorId: ctx.userId,
            }
        });
    }),
    byId: privateProcedure.input(z.object({
        listId: z.string(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.list.findUnique({
            where: {
                id: input.listId,
            },
            include: {
                listItems: true
            }
        });
    }),
    create: privateProcedure.input(z.object({
        name: z.string(),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.list.create({
            data: {
                name: input.name,
                authorId: ctx.userId
            }
        })
    })
})
