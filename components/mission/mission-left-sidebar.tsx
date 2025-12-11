// mission-left-sidebar.tsx

import { RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Separator } from '../ui/separator';
import MissionDetailSidebar from './mission-detail-sidebar';
import AssetDetail from './detail/asset-detail';
import TrackDetail from './detail/track/track-detail';
import TrackList from './list/track-list';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import GeofenceList from './list/geofence-list';
type Props = {}

const MissionLeftSidebar = (props: Props) => {
  const mission = useSelector((state: RootState) => state.mission.data);
  const sidebarType = useSelector((state: RootState) => state.sidebar.type);
  const sidebarData = useSelector((state: RootState) => state.sidebar.data);

  if (sidebarType == null) {
    return (
      <Layout>
        <MissionDetailSidebar />
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
        <TrackDetail key={sidebarData?.id} />
      </Layout>
    )
  }
}

export default MissionLeftSidebar

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='min-w-80 max-w-80 h-screen p-2'>
      <div className='bg-card h-full rounded-md'>
        {children}
      </div>
    </div>
  )
}

const EntityList = () => {
  const mission = useSelector((state: RootState) => state.mission.data);
  const [renderEntities, setRenderEntities] = React.useState<string[]>([
    'tracks', 'assets', 'geofences'
  ]);
  return (
    <div className='overflow-y-auto'>
      <Command className="h-full">
          <CommandInput placeholder="Type a entity name" className='flex flex-1'/>
          <div className='flex gap-1 p-2 w-2xl'>
            {renderEntityList.map((item) => (
              <div
                className="relative items-center p-1 flex cursor-pointer gap-1 rounded-md border border-input shadow-xs outline-none has-data-[state=checked]:border-primary/50"
                key={item.value}
              >
                <Checkbox
                  id={item.value}
                  value={item.value}
                  className='cursor-pointer w-3 h-3'
                  checked={renderEntities.includes(item.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setRenderEntities([...renderEntities, item.value]);
                    } else {
                      setRenderEntities(renderEntities.filter((entity) => entity !== item.value));
                    }
                  }}
                />
                <Label className='cursor-pointer text-xs font-normal' htmlFor={item.value}>{item.label}</Label>
              </div>
            ))}
          </div>
        <CommandList className='h-[77vh]'>
          <CommandEmpty>No results found.</CommandEmpty>
          {
            renderEntities.includes('geofences') &&
            <CommandGroup heading={"Geofences (" + mission.geofences?.length + ")"}>
              <GeofenceList geofences={mission.geofences ? mission.geofences : []} />
            </CommandGroup>
          }
          <CommandSeparator />
          {
            renderEntities.includes('tracks') &&
            <CommandGroup heading={"Tracks (" + mission.tracks?.length + ")"}>
              <TrackList tracks={mission.tracks ? mission.tracks : []} />
            </CommandGroup>
          }
          <CommandSeparator />
          
          {
            renderEntities.includes('assets') &&
            <CommandGroup heading={"Assets (" + mission.assets?.length + ")"}>
            </CommandGroup>
          }
        </CommandList>
      </Command>
    </div>
  )
}

const renderEntityList = [
  {
    label: 'Tracks',
    value: 'tracks'
  },
  {
    label: 'Assets',
    value: 'assets'
  },
  {
    label: 'Geofences',
    value: 'geofences'
  }
]