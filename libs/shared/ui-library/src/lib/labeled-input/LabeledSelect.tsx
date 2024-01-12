import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { Box, Chip, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SelectableModel } from '@giron/shared-models';
import { ReactNode } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props extends LabeledInputProps {
  defaultValue?: string | string[];
  value?: string | string[];
  options?: SelectableModel[];
  callback: (value: string | string[]) => void;
  multiple: boolean;
}

export const LabeledSelect = ({
  label,
  htmlFor,
  name,
  defaultValue,
  value = defaultValue,
  labelMode,
  orientation,
  options,
  callback,
  multiple,
  required = false,
  testName = 'LabelledSelect_test',
}: Props) => {
  const mapMultipleSelectionToChips = (
    selected: string | string[]
  ): string | ReactNode[] => {
    if (typeof selected === 'string') {
      const option = options?.find((op) => op.code === selected);
      return option?.name || selected;
    }
    return selected.map((value, idx) => {
      const option = options?.find((op) => op.code === value);
      return <Chip key={idx} label={option?.name} />;
    });
  };

  return (
    <LabeledInput
      htmlFor={htmlFor}
      label={label}
      labelMode={labelMode}
      orientation={orientation}
      testName={testName}
    >
      <Select
        id={htmlFor}
        name={name}
        required={required}
        multiple={multiple}
        value={value}
        onChange={(e) => callback(e.target.value)}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {mapMultipleSelectionToChips(selected)}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options?.map((option, index) => (
          <MenuItem key={index} value={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </LabeledInput>
  );
};
