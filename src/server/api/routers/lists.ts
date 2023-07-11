import { TRPCError } from "@trpc/server";
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
    })).query(async ({ ctx, input }) => {
        const list = await ctx.prisma.list.findUnique({
            where: {
                id: input.listId,
            },
            include: {
                listItems: {
                    include: {
                        item: true,
                    }
                }
            }
        });
        if (!list) throw new TRPCError({ code: "NOT_FOUND" })
        if (list.authorId !== ctx.userId) throw new TRPCError({ code: "FORBIDDEN" });
        return list;
    }),
    create: privateProcedure.input(z.object({
        name: z.string().min(1).max(150),
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.list.create({
            data: {
                name: input.name,
                authorId: ctx.userId
            }
        });
    })
})
