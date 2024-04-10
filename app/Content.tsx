import { Autocomplete, AutocompleteItem, Card, CardBody, CardHeader, Image, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User, getKeyValue } from "@nextui-org/react";
import clm from 'country-locale-map';
import React from "react";
import useSWR from "swr";

interface DataItem {
    key: string;
    code: string; // 国家代码
    currency: string; // 货币代码
    plan: string; // 计划类型
    old: number; // 旧价格
    new: number; // 新价格
    updateTime: string; // 日期
}
interface Rate {
    [currencyCode: string]: number;
}

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());
const url: string = 'https://api.dy.ax/v1/finance'
function useRate() {
    const { data, isLoading } = useSWR(`${url}/rateall`, fetcher);
    return {
        rate: data,
        isRateLoading: isLoading
    }
}
function usePage(p: number) {
    const { data, isLoading } = useSWR(
        `${url}/netflixchange?page=${p}&per_page=10`, fetcher, {
        keepPreviousData: true,
    });
    return {
        data: data,
        isDataLoading: isLoading
    }
}

export default function Content() {
    const [currency, setCurrency] = React.useState<string>('USD');
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;
    const { rate, isRateLoading } = useRate()
    const { data, isDataLoading } = usePage(page)


    const items = React.useMemo(() => {
        return data?.data?.result.map((item: any, i: number) => ({
            ...item,
            key: i.toString()
        })) || []
    }, [data?.data?.result, rate?.data, currency]);

    const pages = React.useMemo(() => {
        return data?.data?.count ? Math.ceil(data.data.count / rowsPerPage) : 0;
    }, [data?.data?.count, rowsPerPage]);

    const loadingState = isRateLoading || isDataLoading ? "loading" : "idle";
    const noData = typeof data?.data === 'string' ? true : false

    const onSelectionChange = (key: React.Key) => {
        key && key.toString() !== currency && setCurrency(key.toString());
    };
    const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): string => {
        const conversionRate = rate?.data[toCurrency] / rate?.data[fromCurrency];
        return isNaN(conversionRate) ? 'N/A' : (amount * conversionRate).toFixed(2);
    };

    const renderCell = (item: any, columnKey: any) => {
        switch (columnKey) {
            case "code":
                const country = clm.getCountryByAlpha2(item.code)
                return (
                    <User
                        name={country?.alpha3 || 'UNK'}
                        description={item.plan}
                        avatarProps={{
                            size: "sm",
                            isBordered: true,
                            src: `https://cdn.jsdelivr.net/npm/round-flags@1.0.2/flags/${country?.alpha2}.svg`
                        }}
                    />
                );
            case "old":
            case "new":
                const cellValue = item[columnKey];
                const convertedValue = convertCurrency(cellValue, item.currency, currency);
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
        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
            <CardHeader className="justify-end">
                <Autocomplete
                    size='sm'
                    variant='bordered'
                    label={`Convert to: `}
                    className="max-w-xs"
                    defaultSelectedKey={currency}
                    labelPlacement="outside-left"
                    onSelectionChange={onSelectionChange}
                    isDisabled={loadingState == 'loading' || noData}
                >
                    {Object.keys(rate?.data || {}).map(key => (
                        <AutocompleteItem className='text-foreground' key={key} value={key}>
                            {key}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>
            </CardHeader>
            <CardBody>
                <Table
                    isStriped
                    aria-label="Example table with client async pagination"
                    bottomContent={
                        pages > 0 ? (
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        ) : null
                    }

                >
                    <TableHeader>
                        <TableColumn key="code">Country</TableColumn>
                        <TableColumn key="old">Old Price</TableColumn>
                        <TableColumn key="new">New Price</TableColumn>
                        <TableColumn key="updateTime">Date</TableColumn>
                    </TableHeader>
                    <TableBody
                        items={items}
                        loadingContent={<Spinner />}
                        loadingState={loadingState}
                        emptyContent={noData ? 'No Data to display.' : ''}
                    >
                        {(item: any) => (
                            <TableRow key={item?.key}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>

    );
}