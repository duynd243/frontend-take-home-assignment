import { describe, test } from 'vitest'
import { faker } from '@faker-js/faker/locale/vi'

import { createUser } from './utils'

describe.concurrent('Create todo', async () => {
  test('User can create todo', async ({ expect }) => {
    const user = await createUser()

    const todo1Body = faker.string.sample()
    const todo2Body = faker.string.sample()

    await expect(
      user.createTodo({
        body: todo1Body,
      })
    ).resolves.not.toThrow()

    const allTodos = await user.getAllTodos({
      statuses: ['pending', 'completed'],
    })

    expect(allTodos).toContainEqual(
      expect.objectContaining({
        body: todo1Body,
        status: 'pending',
      })
    )

    await expect(
      user.createTodo({
        body: todo2Body,
      })
    ).resolves.not.toThrow()

    const allTodos2 = await user.getAllTodos({
      statuses: ['pending', 'completed'],
    })

    expect(allTodos2).toContainEqual(
      expect.objectContaining({
        body: todo1Body,
        status: 'pending',
      })
    )
    expect(allTodos2).toContainEqual(
      expect.objectContaining({
        body: todo2Body,
        status: 'pending',
      })
    )
  })
})
