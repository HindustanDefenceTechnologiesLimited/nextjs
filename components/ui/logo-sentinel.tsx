import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
  size?: number;
}

const SentinelLogo = (props: Props) => {
  return (
    <>
      <img src="/sentinel-light.svg" alt="Sentinel Logo" className={cn("w-auto dark:block hidden", props.size && `h-${props.size}`)} />
      <img src="/sentinel-dark.svg" alt="Sentinel Logo" className={cn("w-auto dark:hidden block", props.size && `h-${props.size}`)}  />
    </>
  )
}

export default SentinelLogo