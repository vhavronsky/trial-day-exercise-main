import { Select } from "antd";
import { useRoles } from "../../hooks/useRoles";

interface RoleFilterProps {
  value?: string[];
  onChange: (roles: string[] | undefined) => void;
}

export function RoleFilter({ value, onChange }: RoleFilterProps) {
  const { data: roles, isLoading } = useRoles();

  return (
    <Select
      mode="multiple"
      placeholder="Role"
      value={value ?? []}
      onChange={(val) => onChange(val.length > 0 ? val : undefined)}
      loading={isLoading}
      options={roles?.map((role) => ({ label: role, value: role }))}
      style={{ minWidth: 120 }}
      allowClear
      maxTagCount={1}
    />
  );
}
