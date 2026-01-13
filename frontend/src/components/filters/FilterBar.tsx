import { Space, Button, Badge } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { RoleFilter } from "./RoleFilter";
import { GuestFilter } from "./GuestFilter";
import { TeamFilter } from "./TeamFilter";
import { SearchInput } from "./SearchInput";
import type { MembersQuery } from "../../types/api";

interface FilterBarProps {
  filters: MembersQuery;
  onFiltersChange: (newFilters: Partial<MembersQuery>) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  filters,
  onFiltersChange,
  onClearAll,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <Space wrap size="middle">
        <RoleFilter
          value={filters.roles}
          onChange={(roles) => onFiltersChange({ roles })}
        />

        <GuestFilter
          value={filters.isGuest}
          onChange={(isGuest) => onFiltersChange({ isGuest })}
        />

        <TeamFilter
          teamIds={filters.teamIds}
          hasNoTeam={filters.hasNoTeam}
          onChange={(teamIds, hasNoTeam) =>
            onFiltersChange({ teamIds, hasNoTeam })
          }
        />

        <SearchInput
          value={filters.search}
          onChange={(search) => onFiltersChange({ search })}
        />

        {hasActiveFilters && (
          <Button
            type="text"
            icon={<ClearOutlined />}
            onClick={onClearAll}
          >
            Clear all
          </Button>
        )}
      </Space>

      {hasActiveFilters && (
        <Badge
          count="Filters active"
          style={{
            backgroundColor: "#1890ff",
            marginLeft: 8,
          }}
        />
      )}
    </div>
  );
}
