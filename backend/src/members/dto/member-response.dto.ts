export interface MemberResponse {
  id: string;
  email: string;
  name: string | null;
  lastLoginAt: Date | null;
  role: string;
  isGuest: boolean;
  teams: string[];
}

export interface PaginatedMembersResponse {
  data: MemberResponse[];
  total: number;
  page: number;
  limit: number;
}
