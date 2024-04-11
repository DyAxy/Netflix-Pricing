"use client";

import { TableColumn, TableHeader, Tooltip, User } from "@nextui-org/react";
import clm from 'country-locale-map';
import React from "react";
import CurrencyDataTable from "./components/CurrencyDataTable";

export default function Home() {
  const renderCell = (item: any, columnKey: any, rate: any, toCurrency: string) => {
    const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): string => {
      if (!amount) return ''
      const conversionRate = rate?.data[toCurrency] / rate?.data[fromCurrency];
      return isNaN(conversionRate) ? 'N/A' : (amount * conversionRate).toFixed(2);
    };
    switch (columnKey) {
      case "code":
        const country = clm.getCountryByAlpha2(item.code)
        return (
          <Tooltip content={country?.name} placement="right">
            <User
              name={country?.alpha3 || 'UNK'}
              avatarProps={{
                size: "sm",
                isBordered: true,
                src: `https://cdn.jsdelivr.net/npm/round-flags@1.0.2/flags/${country?.alpha2}.svg`
              }}
            />
          </Tooltip>
        );
      case "Basic":
      case "Mobile":
      case "Premium":
      case "Standard":
      case "Standard with ads":
        const cellValue = item[columnKey] || '';
        const convertedValue = convertCurrency(cellValue, item.Currency, toCurrency);
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue ? `${item.Currency} ${cellValue}` : ''}</p>
            <p className="text-bold text-sm capitalize text-default-400">{convertedValue ? `${toCurrency} ${convertedValue}` : ''}</p>
          </div>
        );
      default:
        return item[columnKey];
    }
  }
  return (
    <CurrencyDataTable path='netflix' usePage={false} tableHeader={
      <TableHeader>
        <TableColumn key="code">Country</TableColumn>
        <TableColumn key="Mobile">Mobile</TableColumn>
        <TableColumn key="Basic">Basic</TableColumn>
        <TableColumn key="Standard">Standard</TableColumn>
        <TableColumn key="Standard with ads">Standard with ads</TableColumn>
        <TableColumn key="Premium">Premium</TableColumn>
      </TableHeader>} renderCell={renderCell} />
  );
}
