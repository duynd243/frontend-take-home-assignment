import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { procedure } from '@/server/trpc/procedures'
import { IdSchema } from '@/utils/server/base-schemas'
import { router } from '@/server/trpc/router'

import { latestTodoStatusId } from '../db-views/latest-todo-status-id'
import { TodoStatusSchema } from '../schemas/todo-schemas'

export const todoStatusRouter = router({
  update: procedure
    .input(
      z.object({
        todoId: IdSchema,
        status: TodoStatusSchema,
      }).parse
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction().execute(async (t) => {
        /**
         * Check if
         *  - the todo exists, and
         *  - new status is different from its current status
         */
        await t
          .selectFrom('todoStatuses as previousStatus')
          .innerJoin(
            latestTodoStatusId(t).as('latestTodoStatusId'),
            'latestTodoStatusId',
            'previousStatus.id'
          )
          .where('previousStatus.todoId', '=', input.todoId)
          .where('previousStatus.status', '!=', input.status)
          .select('previousStatus.id')
          .limit(1)
          .executeTakeFirstOrThrow(() => new TRPCError({ code: 'BAD_REQUEST' }))

        await t
          .insertInto('todoStatuses')
          .values({
            todoId: input.todoId,
            status: input.status,
          })
          .execute()
      })
    }),
})
