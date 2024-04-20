"use client";

import { TableColumn, TableHeader } from "@nextui-org/react";
import React from "react";
import CurrencyDataTable from "@/app/components/CurrencyDataTable";
import TooltipCountry from "@/app/components/TooltipCountry";

export default function Home() {
  const renderCell = (item: any, columnKey: any, rate: any, toCurrency: string) => {
    switch (columnKey) {
      case "code":
        return <TooltipCountry iso2={item.code} />
      case "Basic":
      case "Mobile":
      case "Premium":
      case "Standard":
      case "Standard with ads":
        const cellValue = item[columnKey] || '';
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue ? `${item.Currency} ${cellValue}` : ''}</p>
            <p className="text-bold text-sm capitalize text-default-400">{cellValue ? `${toCurrency} ${item[columnKey+'_converted']}` : ''}</p>
          </div>
        );
      default:
        return item[columnKey];
    }
  }
  return (
    <CurrencyDataTable path='netflix?apiKey=1' usePage={false} tableHeader={
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
