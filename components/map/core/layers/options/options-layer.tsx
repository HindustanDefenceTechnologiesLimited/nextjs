'use client'

import React, { useCallback, useEffect, useState, memo } from 'react'
import { ChevronUpIcon } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { UnlocatedObjectives } from './unlocated-allocation-list'

type Props = {}

const STORAGE_KEY = 'options-layer-open'

const OptionsLayer = (props: Props) => {
  const [open, setOpen] = useState(false)

  /* ---------------------------------
     Restore state from localStorage
  ---------------------------------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setOpen(stored === 'true')
    }
  }, [])

  /* ---------------------------------
     Toggle + persist state
  ---------------------------------- */
  const toggleOpen = useCallback(() => {
    setOpen(prev => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  return (
    <div className="absolute bottom-0 right-2 z-9">
      {open && (
        <div className="flex flex-col gap-2 absolute bottom-8 right-0">
          <OptionsAccordion title="Unlocated objectives needs attention">
            <UnlocatedObjectives />
          </OptionsAccordion>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Logo />

        <button
          type="button"
          onClick={toggleOpen}
          className="flex bg-card border-t border-x px-2 rounded-t-md gap-1 p-1 group"
        >
          <span className="flex gap-2 items-center text-sm cursor-pointer">
            Options
            <ChevronUpIcon
              data-open={open}
              className="w-4 h-4 transition-transform data-[open=true]:rotate-180"
            />
          </span>
        </button>
      </div>
    </div>
  )
}

export default OptionsLayer

/* -----------------------------
   Sub Components
------------------------------ */

const Logo = memo(() => (
  <img
    src="/hdtl-light.svg"
    alt="HDTL Logo"
    className="h-3 opacity-50"
  />
))

const OptionsAccordion = memo(
  ({
    children,
    title,
  }: {
    children?: React.ReactNode
    title?: React.ReactNode
  }) => {
    return (
      <Accordion
        type="single"
        collapsible
        className="border rounded-lg bg-card"
      >
        <AccordionItem value="item-1" className="min-w-xs px-2">
          <AccordionTrigger className="py-2">
            {title}
          </AccordionTrigger>

          <AccordionContent className="max-h-80 overflow-y-auto">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
)
