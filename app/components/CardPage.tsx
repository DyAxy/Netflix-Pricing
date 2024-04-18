import { Pagination } from "@nextui-org/react";
export default function CardPage({ pages, page, onPageChange }: {
    pages: number,
    page: number,
    onPageChange?: (page: number) => void
}) {
    return (
        pages > 0 ? (
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(value) => {
                    if (value && value != page && onPageChange) {
                        onPageChange(value);
                    }
                }}
            />
        ) : null
    );
}