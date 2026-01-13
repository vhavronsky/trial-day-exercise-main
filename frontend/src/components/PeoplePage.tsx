import { Typography, Space, Spin } from "antd";
import { MembersTable } from "./MembersTable";
import { FilterBar } from "./filters/FilterBar";
import { useMembersFilters } from "../hooks/useMembersFilters";
import { useTotalMembersCount } from "../hooks/useMembers";

const { Title, Text } = Typography;

export function PeoplePage() {
  const { filters, setFilters, clearFilters, hasActiveFilters } =
    useMembersFilters();
  const { data: countData, isLoading: isCountLoading } = useTotalMembersCount();

  return (
    <div className="people-page">
      <div className="people-page__header">
        <Space orientation="vertical" size={0}>
          <Title level={4} style={{ margin: 0 }}>
            People
          </Title>
          <Text type="secondary">
            {isCountLoading ? (
              <Spin size="small" />
            ) : (
              `${countData?.total ?? 0} people in the organization`
            )}
          </Text>
        </Space>
      </div>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <MembersTable filters={filters} onFiltersChange={setFilters} />
    </div>
  );
}
