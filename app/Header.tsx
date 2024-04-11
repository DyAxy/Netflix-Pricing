"use client";

import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Switch } from "@nextui-org/react";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";
import { useTheme } from "next-themes";
import { usePathname } from 'next/navigation'
import { useMemo } from "react";

const navbarItemStyles = [
    "flex",
    "relative",
    "h-full",
    "items-center",
    "data-[active=true]:after:content-['']",
    "data-[active=true]:after:absolute",
    "data-[active=true]:after:bottom-0",
    "data-[active=true]:after:left-0",
    "data-[active=true]:after:right-0",
    "data-[active=true]:after:h-[2px]",
    "data-[active=true]:after:rounded-[2px]",
    "data-[active=true]:after:bg-primary",
];
interface Props {
    children: React.ReactNode;
    href: string;
}
function CustomNavbarItem({ children, href }: Props) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <NavbarItem isActive={isActive}>
            <Link color={isActive ? 'primary' : 'foreground'} href={href}>
                {children}
            </Link>
        </NavbarItem>
    );
}

export default function Content() {
    const { theme, systemTheme, setTheme } = useTheme()
    const isSelected = useMemo(() => {
        if (theme != 'system' && systemTheme == theme) setTheme('system')
        if ((theme == 'system' && systemTheme == 'light') || theme == 'light') return true
        return false
    }, [theme, systemTheme])

    const onValueChange = (value: boolean) => setTheme(value ? 'light' : 'dark')

    return (
        <Navbar
            shouldHideOnScroll
            isBordered
            classNames={{ item: navbarItemStyles }}
        >
            <NavbarBrand>
                <p className="font-bold">Netflix Pricing</p>
            </NavbarBrand>
            <NavbarContent justify="start">
                <CustomNavbarItem href="/">Home</CustomNavbarItem>
                <CustomNavbarItem href="/changelog">Changelog</CustomNavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Switch
                        isSelected={isSelected}
                        color="success"
                        startContent={<SunIcon />}
                        endContent={<MoonIcon />}
                        onValueChange={onValueChange}
                    />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};