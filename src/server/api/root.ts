import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { listRouter } from "~/server/api/routers/lists";
import { listItemRouter } from "~/server/api/routers/listItem";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    example: exampleRouter,
    list: listRouter,
    listItem: listItemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
