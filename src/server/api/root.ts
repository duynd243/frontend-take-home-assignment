import { router } from '../trpc/router'

import { todoStatusRouter } from './routers/todo-status-router'
import { todoRouter } from './routers/todo-router'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  todo: todoRouter,
  todoStatus: todoStatusRouter,
})

export type AppRouter = typeof appRouter
