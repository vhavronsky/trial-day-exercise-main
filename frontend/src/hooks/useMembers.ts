import { useQuery } from "@tanstack/react-query";
import { getMembers, getTotalMembersCount } from "../api/members";
import type { MembersQuery } from "../types/api";

export function useMembers(query: MembersQuery = {}) {
  return useQuery({
    queryKey: ["members", query],
    queryFn: () => getMembers(query),
  });
}

export function useTotalMembersCount() {
  return useQuery({
    queryKey: ["members", "totalCount"],
    queryFn: () => getTotalMembersCount(),
    staleTime: 5 * 60 * 1000,
  });
}
