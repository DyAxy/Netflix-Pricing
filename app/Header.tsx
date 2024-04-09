import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Switch } from "@nextui-org/react";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Content() {
    const [isSelected, setSelected] = useState(false)
    const { theme, setTheme } = useTheme()

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
            <Navbar shouldHideOnScroll isBordered>
                <NavbarContent>
                    <NavbarBrand>
                        <p className="font-bold">Netflix Pricing Changelog</p>
                    </NavbarBrand>
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