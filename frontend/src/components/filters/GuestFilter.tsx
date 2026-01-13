import { Select } from "antd";

interface GuestFilterProps {
  value?: boolean;
  onChange: (isGuest: boolean | undefined) => void;
}

const options = [
  { label: "All", value: "all" },
  { label: "Guests", value: "true" },
  { label: "Members", value: "false" },
];

export function GuestFilter({ value, onChange }: GuestFilterProps) {
  const selectValue = value === undefined ? "all" : String(value);

  const handleChange = (val: string) => {
    if (val === "all") {
      onChange(undefined);
    } else {
      onChange(val === "true");
    }
  };

  return (
    <Select
      value={selectValue}
      onChange={handleChange}
      options={options}
      style={{ minWidth: 100 }}
    />
  );
}
