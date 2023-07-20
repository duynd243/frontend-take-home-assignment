import { describe, test } from 'vitest'
import { faker } from '@faker-js/faker/locale/vi'

import { TodoStatusSchema } from '../api/schemas/todo-schemas'

import { createUser } from './utils'

describe.concurrent('Update todo status', async () => {
  test('User cannot update a todo that does not exists', async ({ expect }) => {
    const user = await createUser()

    await expect(
      user.updateTodoStatus({
        todoId: 9999999,
        status: 'completed',
      })
    ).rejects.toThrowError('BAD_REQUEST')
  })

  test('User cannot update a todo status if new status is the same as old status', async ({
    expect,
  }) => {
    const user = await createUser()

    const newTodoId = await user.createTodo({
      body: faker.string.sample(),
    })

    await expect(
      user.updateTodoStatus({
        todoId: newTodoId,
        status: 'pending',
      })
    ).rejects.toThrowError('BAD_REQUEST')

    await user.updateTodoStatus({
      todoId: newTodoId,
      status: 'completed',
    })

    await expect(
      user.updateTodoStatus({
        todoId: newTodoId,
        status: 'completed',
      })
    ).rejects.toThrowError('BAD_REQUEST')
  })

  test('User can update todo status', async ({ expect }) => {
    const user = await createUser()

    const newTodoId = await user.createTodo({
      body: faker.string.sample(),
    })

    await expect(
      user.getAllTodos({
        statuses: ['pending'],
      })
    ).resolves.toContainEqual(
      expect.objectContaining({
        id: newTodoId,
        status: TodoStatusSchema.Values['pending'],
      })
    )

    await expect(
      user.getAllTodos({
        statuses: ['completed'],
      })
    ).resolves.not.toContainEqual(
      expect.objectContaining({
        id: newTodoId,
      })
    )

    await expect(
      user.updateTodoStatus({
        todoId: newTodoId,
        status: 'completed',
      })
    ).resolves.not.toThrow()

    await expect(
      user.getAllTodos({
        statuses: ['pending'],
      })
    ).resolves.not.toContainEqual(
      expect.objectContaining({
        id: newTodoId,
      })
    )
    await expect(
      user.getAllTodos({
        statuses: ['completed'],
      })
    ).resolves.toContainEqual(
      expect.objectContaining({
        id: newTodoId,
        status: TodoStatusSchema.Values['completed'],
      })
    )
  })
})
