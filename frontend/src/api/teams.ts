import { fetchApi } from "./client";
import type { Team } from "../types/api";

export async function getTeams(): Promise<Team[]> {
  return fetchApi<Team[]>("/teams");
}
