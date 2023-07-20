import { createInnerTRPCContext } from '../trpc/base'
import { appRouter } from '../api/root'

export const createUser = async () => {
  const context = createInnerTRPCContext({})

  const caller = appRouter.createCaller(context)

  return {
    createTodo: caller.todo.create,
    deleteTodo: caller.todo.delete,
    updateTodoStatus: caller.todoStatus.update,
    getAllTodos: caller.todo.getAll,
  }
}
