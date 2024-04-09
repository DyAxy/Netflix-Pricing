import { Link } from "@nextui-org/react";

export default function Footer() {
    return (
        <div>
            <p className="text-bold text-sm text-center">
                Made with ❤ by <Link isExternal
                    href="https://github.com/DyAxy">DyAxy</Link>.
            </p>
        </div>
    );
};