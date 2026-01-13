import { Select, Divider, Checkbox } from "antd";
import { useTeams } from "../../hooks/useTeams";

interface TeamFilterProps {
  teamIds?: string[];
  hasNoTeam?: boolean;
  onChange: (
    teamIds: string[] | undefined,
    hasNoTeam: boolean | undefined
  ) => void;
}

export function TeamFilter({ teamIds, hasNoTeam, onChange }: TeamFilterProps) {
  const { data: teams, isLoading } = useTeams();

  const handleTeamChange = (selectedTeamIds: string[]) => {
    onChange(
      selectedTeamIds.length > 0 ? selectedTeamIds : undefined,
      hasNoTeam
    );
  };

  const handleNoTeamChange = (checked: boolean) => {
    onChange(teamIds, checked ? true : undefined);
  };

  return (
    <Select
      mode="multiple"
      placeholder="Teams"
      value={teamIds ?? []}
      onChange={handleTeamChange}
      loading={isLoading}
      style={{ minWidth: 140 }}
      allowClear
      maxTagCount={1}
      showSearch={{
        filterOption: (input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
      }}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <div style={{ padding: "4px 12px" }}>
            <Checkbox
              checked={hasNoTeam ?? false}
              onChange={(e) => handleNoTeamChange(e.target.checked)}
            >
              No Team
            </Checkbox>
          </div>
        </>
      )}
      options={teams?.map((team) => ({ label: team.name, value: team.id }))}
    />
  );
}
