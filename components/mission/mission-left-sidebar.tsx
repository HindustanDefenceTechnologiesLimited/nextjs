// mission-left-sidebar.tsx

import { RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import MissionDetailSidebar from './mission-detail-sidebar';
import AssetDetail from './detail/asset-detail';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import TrackDetail from './detail/track-detail';
import TrackList from './list/track-list';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
type Props = {}

const MissionLeftSidebar = (props: Props) => {
  const mission = useSelector((state: RootState) => state.mission.data);
  const sidebarType = useSelector((state: RootState) => state.sidebar.type);
  const sidebarData = useSelector((state: RootState) => state.sidebar.data);

  if (sidebarType == null) {
    return (
      <Layout>
        <MissionDetailSidebar mission={mission} />
        <Separator />
        <EntityList />
      </Layout>
    )
  }
  if (sidebarType == "asset") {
    return (
      <Layout>
        <AssetDetail assetId={''} />
      </Layout>
    )
  }
  if (sidebarType == 'track') {
    return (
      <Layout>
        <TrackDetail />
      </Layout>
    )
  }
}

export default MissionLeftSidebar

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-80 h-screen p-2'>
      <div className='bg-card h-full rounded-md'>
        {children}
      </div>
    </div>
  )
}

const EntityList = () => {
  const mission = useSelector((state: RootState) => state.mission.data);
  return (
    <div className='overflow-y-auto'>
      <Command className="h-full">
        <CommandInput placeholder="Type a entity name" />
        <CommandList className='h-[83vh]'>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading={"Tracks (" + mission.tracks?.length + ")"}>
            <TrackList tracks={mission.tracks ? mission.tracks : []} />
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={"Assets (" + mission.assets?.length + ")"}>

          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}