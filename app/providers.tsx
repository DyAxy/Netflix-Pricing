'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider>
        <div className="text-foreground bg-background" >
          {children}
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  )
}