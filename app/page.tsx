"use client";

import { Autocomplete, AutocompleteItem, Card, CardBody, CardFooter, CardHeader, Input, Pagination, Spacer, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react";
import clm from 'country-locale-map';
import React from "react";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());
const url: string = 'https://api.dy.ax/v1/finance'
function useRate() {
  const { data, isLoading } = useSWR(`${url}/rateall`, fetcher);
  return {
    rate: data,
    isRateLoading: isLoading
  }
}

export default function Home() {
  const [currency, setCurrency] = React.useState<string>('USD');
  const [page, setPage] = React.useState(1);
  const [row, setRow] = React.useState(10);

  const { rate, isRateLoading } = useRate()
  const { data, isLoading } = useSWR(
    `${url}/netflix`, fetcher, {
    keepPreviousData: true,
  });
  const pages = React.useMemo(() => {
    return Math.ceil(data?.data?.length / row)
  }, [data?.data, row]);

  const items = React.useMemo(() => {
    const start = (page - 1) * row;
    const end = start + row;

    return data?.data.slice(start, end).map((item: any, i: number) => ({
      ...item,
      key: i.toString()
    })) || []
  }, [page, row, data?.data, rate?.data, currency]);

  const loadingState = (isRateLoading || isLoading) ? "loading" : "idle";
  const noData = typeof data?.data === 'string' ? true : false

  const onSelectionChange = (key: React.Key) => {
    key && key.toString() !== currency && setCurrency(key.toString());
  };
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): string => {
    if (!amount) return ''
    const conversionRate = rate?.data[toCurrency] / rate?.data[fromCurrency];
    return isNaN(conversionRate) ? 'N/A' : (amount * conversionRate).toFixed(2);
  };
  const cardHeader = React.useMemo(() => {
    return (
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
    )
  }, [rate?.data, loadingState, noData])
  const cardFooter = React.useMemo(() => {
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

  const renderCell = (item: any, columnKey: any) => {
    switch (columnKey) {
      case "code":
        const country = clm.getCountryByAlpha2(item.code)
        return (
          <Tooltip content={country?.name}>
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
        const convertedValue = convertCurrency(cellValue, item.Currency, currency);
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue ? `${item.Currency} ${cellValue}` : ''}</p>
            <p className="text-bold text-sm capitalize text-default-400">{convertedValue ? `${currency} ${convertedValue}` : ''}</p>
          </div>
        );
      default:
        return item[columnKey];
    }
  }
  return (
    <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
      <CardHeader className="justify-end">{cardHeader}</CardHeader>
      <CardBody>
        <Table
          isStriped
          aria-label="Example table with client async pagination"
        >
          <TableHeader>
            <TableColumn key="code">Country</TableColumn>
            <TableColumn key="Mobile">Mobile</TableColumn>
            <TableColumn key="Basic">Basic</TableColumn>
            <TableColumn key="Standard">Standard</TableColumn>
            <TableColumn key="Standard with ads">Standard with ads</TableColumn>
            <TableColumn key="Premium">Premium</TableColumn>
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
      <CardFooter className="justify-center">{cardFooter}</CardFooter>
      <Spacer y={4} />
    </Card>
  );
}
