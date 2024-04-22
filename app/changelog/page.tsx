"use client";

import { 
    TableColumn,
    TableHeader 
} from "@nextui-org/react";
import React from "react";
import CurrencyDataTable from "@/app/components/CurrencyDataTable";
import TooltipCountry from "@/app/components/TooltipCountry";

export default function Content() {
    const renderCell = (item: any, columnKey: any, rate: any, toCurrency: string) => {
        switch (columnKey) {
            case "code":
                return <TooltipCountry iso2={item.code} desc={item.plan}/>
            case "old":
            case "new":
                const cellValue = item[columnKey];
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{`${item.currency} ${cellValue}`}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{cellValue ? `${toCurrency} ${item[columnKey + '_converted']}` : ''}</p>
                    </div>
                );
            default:
                return item[columnKey];
        }
    }

    return (
        <CurrencyDataTable path='netflixchange?apiKey=1&per_page=10&page=' usePage={true} tableHeader={
            <TableHeader>
                <TableColumn key="code">Country</TableColumn>
                <TableColumn key="old">Old Price</TableColumn>
                <TableColumn key="new">New Price</TableColumn>
                <TableColumn key="updateTime">Date</TableColumn>
            </TableHeader>} renderCell={renderCell} />
    );
}