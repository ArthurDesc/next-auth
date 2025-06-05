"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface ResponsiveDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface ResponsiveDialogContentProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
}

function ResponsiveDialog({ children, open, onOpenChange }: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  )
}

function ResponsiveDialogTrigger({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return <DialogTrigger asChild>{children}</DialogTrigger>
  }

  return <DrawerTrigger asChild>{children}</DrawerTrigger>
}

function ResponsiveDialogContent({ 
  children, 
  className, 
  title, 
  description 
}: ResponsiveDialogContentProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <DialogContent className={className}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    )
  }

  return (
    <DrawerContent className={className}>
      {(title || description) && (
        <DrawerHeader className="text-left">
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
      )}
      <div className="px-4 pb-4">
        {children}
      </div>
    </DrawerContent>
  )
}

function ResponsiveDialogClose({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return <>{children}</>
  }

  return <DrawerClose asChild>{children}</DrawerClose>
}

export {
  ResponsiveDialog,
  ResponsiveDialogTrigger,
  ResponsiveDialogContent,
  ResponsiveDialogClose,
} 