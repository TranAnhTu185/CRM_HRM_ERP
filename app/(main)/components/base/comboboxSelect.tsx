"use client";

import { Combobox, InputBase, Input, useCombobox } from "@mantine/core";

export interface ComboOption {
  label: string;
  value: string;
  [key: string]: any;
}

interface ComboSelectProps {
  data: ComboOption[];
  value?: string | null;
  onChange?: (option: ComboOption | null) => void;
  label?: string;
  placeholder?: string;
}

export function ComboSelect({
  data,
  value,
  onChange,
  label,
  placeholder = "Select...",
}: ComboSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const getLabel = () => {
    const option = data.find(x => x.value === value);
    return option ? option.label : null
  }

  return (
    <Input.Wrapper label={label}>
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          const selected = data.find((d) => d.value === val) || null;
          onChange?.(selected); // ⬅ FULL object trả về component cha
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            onClick={() => combobox.toggleDropdown()}
            style={{ textAlign: "left", width: "100%" }}
          >
            {getLabel() || placeholder}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {data.map((item) => (
              <Combobox.Option key={item.value} value={item.value}>
                {item.label}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Input.Wrapper>
  );
}
