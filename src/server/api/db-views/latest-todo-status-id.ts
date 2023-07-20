import type { Database } from '@/server/db'

export const latestTodoStatusId = (db: Database) => {
  return db
    .selectFrom('todoStatuses')
    .select((eb) => [
      'todoStatuses.todoId',
      eb.fn.max('todoStatuses.id').as('latestTodoStatusId'),
    ])
    .groupBy('todoStatuses.todoId')
}
