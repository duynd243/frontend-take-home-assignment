import type { CreateNextContextOptions } from '@trpc/server/adapters/next'

import { createInnerTRPCContext } from './base'

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req,
}: CreateNextContextOptions) => {
  return createInnerTRPCContext({
    session: undefined,
  })
}
