'use client'
import ObjectiveKanban from '@/components/objective/objective-kanban'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppSelector } from '@/store/hook'
import { RootState } from '@/store/store'
import { Kanban, KanbanIcon, ListIcon, ListTodoIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  const mission = useAppSelector((state: RootState) => state.mission.data);
  return (
    <div>
      <Tabs defaultValue='kanban'>
        <div className='flex justify-between items-center px-2'>
          <span className='flex gap-2 items-center'><ListTodoIcon className='w-5 h-5' /> Objectives</span>
          <TabsList>
            <TabsTrigger value='kanban'>
              <KanbanIcon className='w-4 h-4' />
            </TabsTrigger>
            <TabsTrigger value='list'>
              <ListIcon className='w-4 h-4' />
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='kanban'>
          <ObjectiveKanban objectives={mission.objectives || []} />
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default page