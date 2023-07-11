import { createTRPCRouter } from "~/server/api/trpc";
import { listRouter } from "~/server/api/routers/lists";
import { listItemRouter } from "~/server/api/routers/listItem";
import { itemRouter } from "~/server/api/routers/items";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    list: listRouter,
    listItem: listItemRouter,
    item: itemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
