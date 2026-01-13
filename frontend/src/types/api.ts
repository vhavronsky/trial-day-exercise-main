// ==================== Member Types ====================

export interface Member {
  id: string;
  email: string;
  name: string | null;
  lastLoginAt: string | null;
  role: string;
  isGuest: boolean;
  teams: string[];
}

export interface PaginatedMembers {
  data: Member[];
  total: number;
  page: number;
  limit: number;
}

// ==================== Team Types ====================

export interface Team {
  id: string;
  name: string;
}

// ==================== Query/Filter Types ====================

export type SortField = "name" | "email" | "role" | "lastLoginAt" | "teams";
export type SortOrder = "asc" | "desc";

export interface MembersQuery {
  page?: number;
  limit?: number;
  roles?: string[];
  isGuest?: boolean;
  teamIds?: string[];
  hasNoTeam?: boolean;
  search?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}
