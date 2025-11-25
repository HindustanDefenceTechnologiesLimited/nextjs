import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
  size?: number;
}

const SILogo = (props: Props) => {
  return (
    <>
      <img src="/si-light.svg" alt="SI Logo" className={cn("w-auto dark:block hidden", props.size && `h-${props.size}`)} />
      <img src="/si-dark.svg" alt="SI Logo" className={cn("w-auto dark:hidden block", props.size && `h-${props.size}`)}  />
    </>
  )
}

export default SILogo