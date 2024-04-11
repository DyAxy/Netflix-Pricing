import { Autocomplete, AutocompleteItem, Card, CardBody, CardFooter, CardHeader, Pagination, Spacer, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableHeaderProps, TableRow, getKeyValue } from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());
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

    const { data: rate, isLoading: isRateLoading } = useSWR(`${url}/rateall`, fetcher); 
    const { data, isLoading } = useSWR(`${url}/${usePage ? path + page : path}`, fetcher);

    const pages = useMemo(() => {
        return Math.ceil((data?.data?.count || data?.data?.length) / row);
    }, [data?.data, row]);

    const items = useMemo(() => {
        const start = (page - 1) * row;
        const end = start + row;
        const d = data?.data?.result || data?.data.slice(start, end) || []
        return d.map((item: any, i: number) => ({
            ...item,
            key: i.toString()
        }))
    }, [data?.data, rate?.data, currency, page]);

    const onSelectionChange = (key: React.Key) => {
        key && key.toString() !== currency && setCurrency(key.toString());
    };

    const loadingState = isRateLoading || isLoading ? 'loading' : 'idle';

    const cardHeader = useMemo(() => {
        return (
            <Autocomplete
                size='sm'
                variant='bordered'
                label={`Convert to: `}
                className="max-w-xs"
                defaultSelectedKey={currency}
                labelPlacement="outside-left"
                onSelectionChange={onSelectionChange}
                isDisabled={loadingState == 'loading'}
            >
                {Object.keys(rate?.data || {}).map(key => (
                    <AutocompleteItem className='text-foreground' key={key} value={key}>
                        {key}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        )
    }, [rate?.data, loadingState])
    const cardFooter = useMemo(() => {
        return (
            pages > 0 ? (
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                />
            ) : null
        )
    }, [pages])

    return (
        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
            <CardHeader className="justify-end">{cardHeader}</CardHeader>
            <CardBody>
                <Table
                    isStriped
                    aria-label="Example table with client async pagination"
                >
                    {tableHeader}
                    <TableBody
                        items={items}
                        loadingContent={<Spinner />}
                        loadingState={loadingState}
                    >
                        {(item: any) => (
                            <TableRow key={item?.key}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey, rate, currency)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
            <CardFooter className="justify-center">{cardFooter}</CardFooter>
            <Spacer y={4} />
        </Card>
    )
}