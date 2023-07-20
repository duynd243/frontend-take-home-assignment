import { z } from 'zod'

import { procedure } from '@/server/trpc/procedures'
import { router } from '@/server/trpc/router'

import { TodoSchema, TodoStatusSchema } from '../schemas/todo-schemas'
import { latestTodoStatusId } from '../db-views/latest-todo-status-id'

export const todoRouter = router({
  getAll: procedure
    .input(
      z.object({
        statuses: z.array(TodoStatusSchema).min(1),
      }).parse
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.connection().execute(async (conn) =>
        conn
          .selectFrom('todos')
          .innerJoin(
            latestTodoStatusId(conn).as('latestTodoStatusId'),
            'latestTodoStatusId.todoId',
            'todos.id'
          )
          .innerJoin('todoStatuses', 'todoStatuses.id', 'latestTodoStatusId')
          .where('todoStatuses.status', 'in', input.statuses)
          .select([
            'todos.id', //
            'todos.body',
            'todoStatuses.status',
          ])
          .orderBy('latestTodoStatusId', 'desc')
          .execute()
          .then(z.array(TodoSchema).parse)
      )
    }),

  create: procedure
    .input(TodoSchema.pick({ body: true }).parse)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction().execute(async (t) => {
        const { id: newTodoId } = await t
          .insertInto('todos')
          .values({ body: input.body })
          .returning('todos.id')
          .executeTakeFirstOrThrow()

        await t
          .insertInto('todoStatuses')
          .values({
            todoId: newTodoId,
            status: TodoStatusSchema.Values['pending'],
          })
          .execute()

        return newTodoId
      })
    }),

  delete: procedure
    .input(TodoSchema.pick({ id: true }).parse)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .transaction()
        .execute((t) =>
          t.deleteFrom('todos').where('todos.id', '=', input.id).execute()
        )
    }),
})
