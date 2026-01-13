import { Table, Tag, Typography, Space } from "antd";
import type { TableProps } from "antd";
import type { Member, MembersQuery, SortField, SortOrder } from "../types/api";
import { useMembers } from "../hooks/useMembers";

const { Text } = Typography;

interface MembersTableProps {
  filters: MembersQuery;
  onFiltersChange: (newFilters: Partial<MembersQuery>) => void;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getColumns(
  _onSort: (field: SortField, order: SortOrder | undefined) => void,
  currentSortBy?: SortField,
  currentSortOrder?: SortOrder
): TableProps<Member>["columns"] {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
      sortOrder:
        currentSortBy === "name"
          ? currentSortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: (name: string | null) => (
        <Text strong>{name || "—"}</Text>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrder:
        currentSortBy === "email"
          ? currentSortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: (email: string) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {email}
        </Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      sorter: true,
      sortOrder:
        currentSortBy === "role"
          ? currentSortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: (role: string) => <Tag>{role}</Tag>,
    },
    {
      title: "Last Login",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 140,
      sorter: true,
      sortOrder:
        currentSortBy === "lastLoginAt"
          ? currentSortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: (date: string | null) => (
        <Text type={date ? undefined : "secondary"}>{formatDate(date)}</Text>
      ),
    },
    {
      title: "Teams",
      dataIndex: "teams",
      key: "teams",
      sorter: true,
      sortOrder:
        currentSortBy === "teams"
          ? currentSortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: (teams: string[]) =>
        teams.length > 0 ? (
          <Space size={4} wrap>
            {teams.map((team) => (
              <Tag key={team} color="blue">
                {team}
              </Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];
}

export function MembersTable({ filters, onFiltersChange }: MembersTableProps) {
  const { data, isLoading, error } = useMembers(filters);

  const handleTableChange: TableProps<Member>["onChange"] = (
    pagination,
    _tableFilters,
    sorter
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;

    const newFilters: Partial<MembersQuery> = {};

    // Handle pagination
    if (pagination.current) {
      newFilters.page = pagination.current;
    }
    if (pagination.pageSize) {
      newFilters.limit = pagination.pageSize;
    }

    // Handle sorting
    if (singleSorter?.columnKey) {
      if (singleSorter.order) {
        newFilters.sortBy = singleSorter.columnKey as SortField;
        newFilters.sortOrder = singleSorter.order === "ascend" ? "asc" : "desc";
      } else {
        // Sorting cleared
        newFilters.sortBy = undefined;
        newFilters.sortOrder = undefined;
      }
    }

    onFiltersChange(newFilters);
  };

  const handleSort = (field: SortField, order: SortOrder | undefined) => {
    onFiltersChange({
      sortBy: order ? field : undefined,
      sortOrder: order,
    });
  };

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Text type="danger">Error loading members: {error.message}</Text>
      </div>
    );
  }

  return (
    <Table<Member>
      dataSource={data?.data}
      columns={getColumns(handleSort, filters.sortBy, filters.sortOrder)}
      rowKey="id"
      loading={isLoading}
      onChange={handleTableChange}
      pagination={{
        current: filters.page ?? 1,
        pageSize: filters.limit ?? 10,
        total: data?.total ?? 0,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        pageSizeOptions: ["10", "20", "50"],
      }}
    />
  );
}
