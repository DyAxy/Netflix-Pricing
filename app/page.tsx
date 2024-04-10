"use client";

import './globals.css';
import React from "react";
import {
  Spacer
} from '@nextui-org/react';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Home() {
  return (
    <div>
      <SpeedInsights />
      <Header />
      <Spacer y={4} />
      <Content />
      <Spacer y={4} />
      <Footer />
      <Spacer y={4} />
    </div>
  );
}
