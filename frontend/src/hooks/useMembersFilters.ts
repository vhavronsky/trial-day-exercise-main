import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { MembersQuery, SortField, SortOrder } from "../types/api";

const VALID_SORT_FIELDS: SortField[] = [
  "name",
  "email",
  "role",
  "lastLoginAt",
  "teams",
];
const VALID_SORT_ORDERS: SortOrder[] = ["asc", "desc"];

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseArray(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const arr = value.split(",").filter(Boolean);
  return arr.length > 0 ? arr : undefined;
}

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
}

export function useMembersFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current filters from URL
  const filters: MembersQuery = useMemo(() => {
    const sortBy = searchParams.get("sortBy") as SortField | null;
    const sortOrder = searchParams.get("sortOrder") as SortOrder | null;

    return {
      page: parseNumber(searchParams.get("page")) ?? 1,
      limit: parseNumber(searchParams.get("limit")) ?? 10,
      search: searchParams.get("search") || undefined,
      roles: parseArray(searchParams.get("roles")),
      isGuest: parseBoolean(searchParams.get("isGuest")),
      teamIds: parseArray(searchParams.get("teamIds")),
      hasNoTeam: parseBoolean(searchParams.get("hasNoTeam")),
      sortBy: sortBy && VALID_SORT_FIELDS.includes(sortBy) ? sortBy : undefined,
      sortOrder:
        sortOrder && VALID_SORT_ORDERS.includes(sortOrder)
          ? sortOrder
          : undefined,
    };
  }, [searchParams]);

  // Update filters (merges with existing, removes undefined values)
  const setFilters = useCallback(
    (newFilters: Partial<MembersQuery>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          // Reset page to 1 when filters change (except when explicitly setting page)
          if (!("page" in newFilters)) {
            next.delete("page");
          }

          Object.entries(newFilters).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
              next.delete(key);
            } else if (Array.isArray(value)) {
              if (value.length > 0) {
                next.set(key, value.join(","));
              } else {
                next.delete(key);
              }
            } else if (typeof value === "boolean") {
              next.set(key, String(value));
            } else {
              next.set(key, String(value));
            }
          });

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      filters.roles?.length ||
      filters.isGuest !== undefined ||
      filters.teamIds?.length ||
      filters.hasNoTeam
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.roles?.length) count++;
    if (filters.isGuest !== undefined) count++;
    if (filters.teamIds?.length) count++;
    if (filters.hasNoTeam) count++;
    return count;
  }, [filters]);

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}
