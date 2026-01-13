import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/teams";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    staleTime: 5 * 60 * 1000,
  });
}
