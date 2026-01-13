import { fetchApi } from "./client";
import type { MembersQuery, PaginatedMembers } from "../types/api";

function buildQueryString(query: MembersQuery): string {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query.isGuest !== undefined) params.set("isGuest", String(query.isGuest));
  if (query.hasNoTeam !== undefined)
    params.set("hasNoTeam", String(query.hasNoTeam));

  if (query.roles?.length) params.set("roles", query.roles.join(","));
  if (query.teamIds?.length) params.set("teamIds", query.teamIds.join(","));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getMembers(
  query: MembersQuery = {}
): Promise<PaginatedMembers> {
  const queryString = buildQueryString(query);
  return fetchApi<PaginatedMembers>(`/members${queryString}`);
}

export async function getRoles(): Promise<string[]> {
  return fetchApi<string[]>("/members/roles");
}

export async function getTotalMembersCount(): Promise<{ total: number }> {
  return fetchApi<{ total: number }>("/members/count");
}
