import { cn } from '@/lib/utils';
import React from 'react'

type Props = {
  size?: number;
}

const HDTLLogo = (props: Props) => {
  return (
    <>
      <img src="/hdtl-light.svg" alt="HDTL Logo" className={cn("w-auto dark:block hidden", props.size && `h-${props.size}`)} />
      <img src="/hdtl-dark.svg" alt="HDTL Logo" className={cn("w-auto dark:hidden block", props.size && `h-${props.size}`)}  />
    </>
  )
}

export default HDTLLogo