import { Autocomplete, AutocompleteItem, Card, CardBody, CardHeader, Image, Pagination, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import { columns } from "./data";
import clm from 'country-locale-map';
import React from "react";

interface DataItem {
    key: string;
    name: string; // 国家代码
    currency: string; // 货币代码
    plan: string; // 计划类型
    old: number; // 旧价格
    new: number; // 新价格
    date: string; // 日期
}
interface Rate {
    [currencyCode: string]: number;
}
interface ContentProps {
    data: DataItem[];
    rate: Rate;
}

export default function Content({ data, rate }: ContentProps) {
    const [page, setPage] = React.useState(1);
    const [currency, setCurrency] = React.useState<string>('USD');

    const onSelectionChange = (key: React.Key) => {
        key && key.toString() !== currency && setCurrency(key.toString());
    };

    const convertCurrency = (amount: number, fromCurrency: string): string => {
        const conversionRate = rate[currency] / rate[fromCurrency];
        return isNaN(conversionRate) ? 'N/A' : (amount * conversionRate).toFixed(2);
    };

    const rowsPerPage = 6;
    const pages = Math.ceil(data.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end).map(item => ({
            ...item
        }));
    }, [page, data, currency]); // 添加currency作为依赖

    const renderCell = (item: any, columnKey: any) => {
        switch (columnKey) {
            case "name":
                const country = clm.getCountryByAlpha2(item.name)
                return (
                    <User
                        name={country?.alpha3 || 'UNK'}
                        description={item.plan}
                        avatarProps={{
                            size:"sm",
                            isBordered: true,
                            src: `https://cdn.jsdelivr.net/npm/round-flags@1.0.2/flags/${country?.alpha2}.svg`
                        }}
                    />
                );
            case "old":
            case "new":
                const cellValue = item[columnKey];
                const convertedValue = convertCurrency(cellValue, item.currency);
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{`${item.currency} ${cellValue}`}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{`${currency} ${convertedValue}`}</p>
                    </div>
                );
            default:
                return item[columnKey];
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card>
                <CardHeader className="justify-end">
                    <Autocomplete
                        size='sm'
                        variant='bordered'
                        label={`Convert to: `}
                        className="max-w-xs"
                        defaultSelectedKey={currency}
                        labelPlacement="outside-left"
                        onSelectionChange={onSelectionChange}
                    >
                        {Object.keys(rate).map(key => (
                            <AutocompleteItem className='text-foreground' key={key} value={key}>
                                {key}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </CardHeader>
                <CardBody>
                    <Table
                        isStriped
                        aria-label='test'
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>} >
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody
                            items={items}
                        >
                            {(item: any) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div >
    );
};