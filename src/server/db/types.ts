import type { ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Todo = {
  id: Generated<number>
  body: string
  createdAt: Generated<string>
  updatedAt: Generated<string>
}
export type TodoStatus = {
  id: Generated<number>
  status: string
  todoId: number
  createdAt: Generated<string>
  updatedAt: Generated<string>
}
export type DB = {
  todoStatuses: TodoStatus
  todos: Todo
}
