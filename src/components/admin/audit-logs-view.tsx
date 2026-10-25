"use client";

import { ScrollText } from "lucide-react";
import { DataTable, type Column } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { SearchInput } from "@/components/common/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useListParams } from "@/hooks/use-list-params";
import { useListQuery } from "@/hooks/use-list-query";
import { formatDateTime } from "@/lib/format";
import type { AuditLog } from "@/types/api";

const columns: Column<AuditLog>[] = [
  { id: "time", header: "When", className: "whitespace-nowrap", cell: (log) => formatDateTime(log.createdAt) },
  {
    id: "actor",
    header: "Who",
    cell: (log) => (
      <div className="min-w-0">
        <p className="font-medium">{log.actor?.name ?? "System"}</p>
        {log.actor ? <p className="text-xs text-muted-foreground">{log.actor.email}</p> : null}
      </div>
    ),
  },
  {
    id: "action",
    header: "Action",
    cell: (log) => (
      <Badge variant="secondary" className="font-mono text-xs">
        {log.action}
      </Badge>
    ),
  },
  { id: "entity", header: "Entity", hideOnMobile: true, cell: (log) => log.entity },
  { id: "ip", header: "IP", hideOnMobile: true, className: "tabular-nums", cell: (log) => log.ip ?? "-" },
];

export function AuditLogsView() {
  // The backend filters audit logs by exact action or entity name, so one search box maps to "entity".
  const params = useListParams({ filterKeys: ["entity"], defaultLimit: 20 });
  const list = useListQuery<AuditLog>("audit-logs", "admin/audit-logs", params.query);

  return (
    <>
      <PageHeader title="Audit logs" description="A record of important actions taken in the system." />
      <div className="mb-4">
        <SearchInput value={params.filters.entity ?? ""} onChange={(value) => params.setFilter("entity", value)} placeholder="Filter by entity, e.g. Invoice" />
      </div>
      <DataTable
        columns={columns}
        rows={list.data?.data}
        getRowId={(log) => log.id}
        isLoading={list.isLoading}
        isFetching={list.isFetching}
        meta={list.data?.meta}
        onPageChange={params.setPage}
        onLimitChange={params.setLimit}
        empty={
          <EmptyState
            icon={ScrollText}
            title="No audit entries"
            description={params.hasActiveFilters ? "Nothing matches this entity name." : "Actions will appear here as they happen."}
            action={params.hasActiveFilters ? <Button variant="outline" onClick={params.reset}>Clear filter</Button> : undefined}
          />
        }
      />
    </>
  );
}
