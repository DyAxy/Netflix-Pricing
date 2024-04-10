import { Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Switch } from "@nextui-org/react";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'

export default function Content() {
    const [isSelected, setSelected] = useState(false)
    const { theme, setTheme } = useTheme()

    const pathname = usePathname()

    const handleSystemThemeChange = (e: any) => {
        if (e.matches) {
            setSelected(false)
            setTheme('dark');
        } else {
            setSelected(true)
            setTheme('light')
        }
    };
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        handleSystemThemeChange(mediaQuery)
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [])
    return (
        <div>
            <Navbar
                shouldHideOnScroll
                isBordered
                classNames={{
                    item: [
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
                    ],
                }}
            >
                <NavbarContent>
                    <NavbarBrand>
                        <p className="font-bold">Netflix Pricing</p>
                    </NavbarBrand>
                    <NavbarItem isActive={pathname === '/'}>
                        <Link color={pathname === '/' ? 'primary' : 'foreground'} href="/">
                            Home
                        </Link>
                    </NavbarItem >
                    <NavbarItem isActive={pathname === '/changelog'}>
                        <Link color={pathname === '/changelog' ? 'primary' : 'foreground'} href="/changelog">
                            Changelog
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Switch
                            isSelected={isSelected}
                            color="success"
                            startContent={<SunIcon />}
                            endContent={<MoonIcon />}
                            onValueChange={(value) => {
                                setSelected(value)
                                setTheme(value ? 'light' : 'dark')
                            }}
                        />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
};