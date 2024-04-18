
import { Tooltip, User } from "@nextui-org/react";
import clm from 'country-locale-map';
export default function TooltipCountry({ iso2 }: { iso2: string }) {
    const country = clm.getCountryByAlpha2(iso2)
    return (
        <Tooltip content={country?.name} placement="right">
            <User
                name={country?.alpha3 || 'UNK'}
                avatarProps={{
                    size: "sm",
                    isBordered: true,
                    src: `https://hatscripts.github.io/circle-flags/flags/${country?.alpha2.toLowerCase()}.svg`
                }}
            />
        </Tooltip>
    );
}