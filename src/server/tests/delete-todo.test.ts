import { describe, test } from 'vitest'
import { faker } from '@faker-js/faker/locale/vi'

import { createUser } from './utils'

describe.concurrent('Delete todo', async () => {
  test('User can delete todo', async ({ expect }) => {
    const user = await createUser()

    const todoBody = faker.string.sample()

    const newTodoId = await user.createTodo({
      body: todoBody,
    })

    await expect(
      user.getAllTodos({
        statuses: ['pending', 'completed'],
      })
    ).resolves.toContainEqual(
      expect.objectContaining({
        id: newTodoId,
      })
    )

    await expect(
      user.deleteTodo({
        id: newTodoId,
      })
    ).resolves.not.toThrow()

    await expect(
      user.getAllTodos({
        statuses: ['pending', 'completed'],
      })
    ).resolves.not.toContainEqual(
      expect.objectContaining({
        id: newTodoId,
      })
    )
  })
})
