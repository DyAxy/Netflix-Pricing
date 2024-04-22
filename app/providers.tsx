'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react"
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useRouter } from 'next/navigation'

import {
  Spacer
} from '@nextui-org/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider>
        <div className="text-foreground bg-background" >
          <Analytics />
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