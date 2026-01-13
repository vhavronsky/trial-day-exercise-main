import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

interface SearchInputProps {
  value?: string;
  onChange: (search: string | undefined) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value ?? "");

  // Sync external value changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value ?? "");
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = localValue.trim();
      if (trimmed !== (value ?? "")) {
        onChange(trimmed || undefined);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  return (
    <Input
      placeholder="Filter by name or email"
      prefix={<SearchOutlined />}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      allowClear
      style={{ width: 220 }}
    />
  );
}
