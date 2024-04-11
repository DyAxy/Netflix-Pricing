"use client";

import { TableColumn, TableHeader, Tooltip, User } from "@nextui-org/react";
import clm from 'country-locale-map';
import React from "react";
import CurrencyDataTable from "../components/CurrencyDataTable";

export default function Content() {
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
                            description={item.plan}
                            avatarProps={{
                                size: "sm",
                                isBordered: true,
                                src: `https://cdn.jsdelivr.net/npm/round-flags@1.0.2/flags/${country?.alpha2}.svg`
                            }}
                        />
                    </Tooltip>
                );
            case "old":
            case "new":
                const cellValue = item[columnKey];
                const convertedValue = convertCurrency(cellValue, item.currency, toCurrency);
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{`${item.currency} ${cellValue}`}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{`${toCurrency} ${convertedValue}`}</p>
                    </div>
                );
            default:
                return item[columnKey];
        }
    }

    return (
        <CurrencyDataTable path='netflixchange?per_page=10&page=' usePage={true} tableHeader={
            <TableHeader>
                <TableColumn key="code">Country</TableColumn>
                <TableColumn key="old">Old Price</TableColumn>
                <TableColumn key="new">New Price</TableColumn>
                <TableColumn key="updateTime">Date</TableColumn>
            </TableHeader>} renderCell={renderCell} />
    );
}