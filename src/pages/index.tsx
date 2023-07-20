import { forwardRef, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'

import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'

/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */

const Tab = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
  ({ children, ...props }, forwardedRef) => (
    <button
      {...props}
      ref={forwardedRef}
      className="flex items-center justify-center gap-2 rounded-[624.9375rem] border border-gray-200 px-6 py-3 text-center text-[0.875rem] font-[700] leading-[1.25rem] text-gray-700 data-[state=active]:border-0 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
    >
      {children}
    </button>
  )
)

Tab.displayName = 'Tab'

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<
    'completed' | 'pending' | 'all'
  >('all')
  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>

        <Tabs.Root
          className="pt-10"
          value={selectedTab}
          onValueChange={(value) =>
            setSelectedTab(value as 'completed' | 'pending' | 'all')
          }
        >
          <Tabs.List className="flex items-center gap-2">
            <Tabs.TabsTrigger asChild value="all">
              <Tab>All</Tab>
            </Tabs.TabsTrigger>
            <Tabs.TabsTrigger asChild value="pending">
              <Tab>Pending</Tab>
            </Tabs.TabsTrigger>
            <Tabs.TabsTrigger asChild value="completed">
              <Tab>Completed</Tab>
            </Tabs.TabsTrigger>
          </Tabs.List>

          <div className="pt-10">
            <TodoList status={selectedTab} />
          </div>
        </Tabs.Root>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

export default Index
