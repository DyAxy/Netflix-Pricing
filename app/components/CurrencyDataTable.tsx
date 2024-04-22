import { 
    Card, 
    CardBody, 
    CardFooter, 
    CardHeader, 
    Input, 
    Spacer, 
    Spinner, 
    Table, 
    TableBody, 
    TableCell, 
    TableRow
} from "@nextui-org/react";
import { 
    useCallback, 
    useEffect, 
    useMemo, 
    useState
} from "react";
import useSWR from "swr";
import CardPage from "@/app/components/CardPage";
import CardCurrency from "@/app/components/CardCurrency";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json().then(j => j.data));
const url: string = 'https://api.dy.ax/v1/finance'
interface Prop {
    path: string
    usePage: boolean
    tableHeader: any
    renderCell: Function
}

export default function CurrencyDataTable({ path, usePage, tableHeader, renderCell }: Prop) {
    const [currency, setCurrency] = useState<string>('USD');
    const [page, setPage] = useState(1);
    const [row, setRow] = useState(10);
    const [pages, setPages] = useState(0);

    const { data: rate, isLoading: isRateLoading } = useSWR(`${url}/rateall?apiKey=1`, fetcher);
    const { data, isLoading } = useSWR(`${url}/${usePage ? path + page : path}`, fetcher);

    useEffect(() => {
        setPages(Math.ceil((data?.count || data?.length) / row))
    }, [data])

    const items = useMemo(() => {
        const start = (page - 1) * row;
        const end = start + row;
        const d = data?.result || data?.slice(start, end) || []
        return d.map((item: any, index: number) => {
            const newItem: { [key: string]: any } = {
                ...item,
                key: index.toString(),
            };
            Object.keys(item).forEach(key => {
                if (typeof item[key] === 'number') {
                    const fromCurrency = item['Currency'] || item['currency']
                    if (rate && rate.hasOwnProperty(currency) && rate.hasOwnProperty(fromCurrency)) {
                        const convertRate = rate[currency] / rate[fromCurrency];
                        newItem[`${key}_converted`] = (item[key] * convertRate).toFixed(2);
                    }
                }
            });
            return newItem;
        })
    }, [data, rate, currency, page]);

    const loadingState = isRateLoading || isLoading ? 'loading' : 'idle';

    const [filterValue, setFilterValue] = useState("");
    const hasSearchFilter = Boolean(filterValue);
    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])
    const searchChecker = useMemo(() => {
        return usePage ? null : (
            <Input
                isDisabled={!data}
                label="ISO 3166-2 Code"
                isClearable
                size='sm'
                className="w-full sm:max-w-[30%]"
                placeholder="Search by country code..."
                variant="bordered"
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
            />)
    }, [data, filterValue])
    const filteredItems = useMemo(() => {
        if (usePage) return []
        if (!data) return []
        let filteredUsers = [...data];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((item) =>
                item.code.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        setPages(Math.ceil(filteredUsers.length / row))
        const start = (page - 1) * row;
        const end = start + row;
        return filteredUsers.slice(start, end).map((item: any, index: number) => {
            const newItem: { [key: string]: any } = {
                ...item,
                key: index.toString(),
            };
            Object.keys(item).forEach(key => {
                if (typeof item[key] === 'number') {
                    const fromCurrency = item['Currency'] || item['currency']
                    if (rate && rate.hasOwnProperty(currency) && rate.hasOwnProperty(fromCurrency)) {
                        const convertRate = rate[currency] / rate[fromCurrency];
                        newItem[`${key}_converted`] = (item[key] * convertRate).toFixed(2);
                    }
                }
            });
            return newItem;
        })
    }, [data, rate, page, currency, filterValue]);

    return (
        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
            <CardHeader className="justify-between">
                {searchChecker}
                <CardCurrency
                    rate={rate}
                    currency={currency}
                    onSelectionChange={(value) => {
                        setCurrency(value.toString())
                    }}
                />
            </CardHeader>
            <CardBody>
                <Table
                    isStriped
                    aria-label="Example table with client async pagination"
                >
                    {tableHeader}
                    <TableBody
                        items={hasSearchFilter ? filteredItems : items}
                        loadingContent={<Spinner />}
                        loadingState={loadingState}
                        emptyContent={(loadingState != 'loading' && items.length == 0) ? 'No Data to display.' : ''}
                    >
                        {(item: any) => (
                            <TableRow key={item?.key}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey, rate, currency)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
            <CardFooter className="justify-center">
                <CardPage
                    pages={pages}
                    page={page}
                    onPageChange={(value) => { setPage(value) }}
                />
            </CardFooter>
            <Spacer y={4} />
        </Card>
    )
}