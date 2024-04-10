'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from './Header';
import Footer from './Footer';
import {
  Spacer
} from '@nextui-org/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider>
        <div className="text-foreground bg-background" >
          <SpeedInsights />
          <Header />
          <Spacer y={4} />
          {children}
          <Spacer y={4} />
          <Footer />
          <Spacer y={4} />
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  )
}