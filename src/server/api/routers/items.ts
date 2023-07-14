import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";


export const itemRouter = createTRPCRouter({
    create: privateProcedure.input(z.object({
        name: z.string(),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.item.create({
            data: {
                name: input.name,
                authorId: ctx.userId,
            }
        });
    }),
    search: privateProcedure.input(z.object({
        name: z.string(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.item.findMany({
            where: {
                name: {
                    contains: input.name,
                }
            }
        });
    }),
    byId: privateProcedure.input(z.object({
        id: z.string(),
    })).query(({ ctx, input }) => {
        return ctx.prisma.item.findUnique({
            where: {
                id: input.id
            },
        });
    }),
});
