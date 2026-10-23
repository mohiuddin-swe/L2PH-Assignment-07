"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/api";

export interface Column<T> {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Backend field to sort by. Leave out for columns that cannot be sorted. */
  sortKey?: string;
  align?: "left" | "right";
  /** Hide this column on small screens. */
  hideOnMobile?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: readonly Column<T>[];
  rows: readonly T[] | undefined;
  getRowId: (row: T) => string;
  isLoading?: boolean;
  /** True while a new page or filter is loading (the old rows stay visible, slightly faded). */
  isFetching?: boolean;
  sortBy?: string;
  order?: "asc" | "desc";
  onSort?: (key: string) => void;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  empty?: ReactNode;
  skeletonRows?: number;
}

const hideClass = (hide?: boolean) => (hide ? "hidden md:table-cell" : undefined);

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  isFetching,
  sortBy,
  order,
  onSort,
  meta,
  onPageChange,
  onLimitChange,
  empty,
  skeletonRows = 6,
}: DataTableProps<T>) {
  const showEmpty = !isLoading && (rows?.length ?? 0) === 0;

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => {
              const sorted = column.sortKey !== undefined && column.sortKey === sortBy;
              const Icon = !sorted ? ArrowUpDown : order === "asc" ? ArrowUp : ArrowDown;
              return (
                <TableHead
                  key={column.id}
                  scope="col"
                  aria-sort={sorted ? (order === "asc" ? "ascending" : "descending") : undefined}
                  className={cn(column.align === "right" && "text-right", hideClass(column.hideOnMobile), column.className)}
                >
                  {column.sortKey && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.sortKey!)}
                      className={cn(
                        "-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-medium transition-colors hover:bg-muted",
                        column.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {column.header}
                      <Icon className={cn("size-3.5", sorted ? "text-foreground" : "text-muted-foreground")} aria-hidden />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody className={cn("transition-opacity", isFetching && !isLoading && "opacity-60")}>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, row) => (
                <TableRow key={row} className="hover:bg-transparent">
                  {columns.map((column) => (
                    <TableCell key={column.id} className={hideClass(column.hideOnMobile)}>
                      <Skeleton className={cn("h-4", row % 2 ? "w-3/4" : "w-full")} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows?.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((column) => (
                    <TableCell key={column.id} className={cn(column.align === "right" && "text-right", hideClass(column.hideOnMobile), column.className)}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>

      {showEmpty ? (empty ?? <EmptyState title="Nothing here yet" description="There is nothing to show." />) : null}
      {meta && onPageChange && !isLoading ? <Pagination meta={meta} onPageChange={onPageChange} onLimitChange={onLimitChange} /> : null}
    </div>
  );
}