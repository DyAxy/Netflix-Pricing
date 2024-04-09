"use client";

import './globals.css';
import axios from 'axios';
import React from "react";
import { setupCache, buildMemoryStorage } from 'axios-cache-interceptor';
import {
  Spacer
} from '@nextui-org/react';
import Loading from "./Loading";
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const fetchData = async () => {
  const request = axios.create({
    baseURL: 'https://nf.dy.ax'
  })
  const cached = setupCache(request, {
    storage: buildMemoryStorage(true, 23 * 60 * 60 * 1000)
  });

  const [rateResponse, priceResponse] = await Promise.all([
    cached.get('/getRate'),
    cached.get('/getPrice')
  ]);

  let rate = null, data = [];
  if (rateResponse.status === 200) {
    rate = rateResponse.data.content.rates;
  }

  if (priceResponse.status === 200) {
    // for (let i=0;i<50;i++){
    //   data.push({
    //     key: i,
    //     name: i.toString(),
    //     plan: "Premium",
    //     currency: "HKD",
    //     old: i.toString(),
    //     new: (i*10).toString(),
    //     date: `2024-${i}-${i}`
    //   })
    // }
    data = priceResponse.data.content.reduceRight((acc: any, data: any, i: any) => {
      const msg = data.message;
      if (msg.includes('Currency')) {
        const currency = msg.substring(msg.length - 3);
        const regexOld = /Old\s*([^:]+):\s*([^,]+)/;
        const regexNew = /New\s*([^:]+):\s*([^,]+)/;

        const oldMatch = regexOld.exec(msg);
        const newMatch = regexNew.exec(msg);

        acc.push({
          key: i.toString(),
          name: data.code,
          currency,
          plan: oldMatch ? oldMatch[1].trim() : '',
          old: oldMatch ? oldMatch[2].trim() : '',
          new: newMatch ? newMatch[2].trim() : '',
          date: data.updateTime,
        });
      }
      return acc;
    }, []);
  }

  return { rate, data };
};

export default function Home() {
  const [state, setState] = React.useState({
    data: [],
    rate: null,
    isLoading: true,
  });

  React.useEffect(() => {
    fetchData().then(({ rate, data }) => {
      setState({ rate, data, isLoading: false });
    }).catch(error => {
      console.error("An error occurred:", error);
      setState(s => ({ ...s, isLoading: false }));
    });
  }, []);

  const { isLoading, data, rate } = state;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Header />
      <Spacer y={4} />
      <Content data={data} rate={rate ? rate : { 'USD': 1 }} />
      <Spacer y={4} />
      <Footer />
      <Spacer y={4} />
    </div>
  );
}
