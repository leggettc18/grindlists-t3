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
})
