import type { NextApiHandler } from 'next'

import { createNextApiHandler } from '@trpc/server/adapters/next'

import { createTRPCContext } from '@/server/trpc'
import { appRouter } from '@/server/api/root'

const handler: NextApiHandler = async (req, res) => {
  const result = await createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
  })(req, res)

  return result
}

export default handler
