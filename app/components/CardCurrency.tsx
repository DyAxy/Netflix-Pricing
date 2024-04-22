import { 
    Autocomplete, 
    AutocompleteItem 
} from "@nextui-org/react"
import { Key } from "react";

export default function CardCurrency({ rate, currency, onSelectionChange }: {
    rate: any,
    currency: string,
    onSelectionChange?: (currency: Key) => void
}) {
    return (<Autocomplete
        size='sm'
        variant='bordered'
        label={`Convert to: `}
        className="w-full sm:max-w-[30%]"
        defaultSelectedKey={currency}
        isDisabled={!rate}
        onSelectionChange={(value) => {
            if (value && value != currency && onSelectionChange) {
                onSelectionChange(value);
            }
        }}
    >
        {Object.keys(rate || {}).map(key => (
            <AutocompleteItem className='text-foreground' key={key} value={key}>
                {key}
            </AutocompleteItem>
        ))}
    </Autocomplete>)
}