import { ReactNode } from 'react';
import { Chip } from '@mui/material';
import { SelectableModel } from '@giron/shared-models';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const SelectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      maxWidth: 250,
    },
  },
};

export const mapMultipleSelectionToChips = (
  selected: string | string[],
  options?: SelectableModel[]
): string | ReactNode[] => {
  if (typeof selected === 'string') {
    const option = options?.find((op) => op.code === selected);
    return option?.name || selected;
  }
  return selected.map((value, idx) => {
    const option = options?.find((op) => op.code === value);
    return <Chip key={idx} label={option?.name || value} />;
  });
};

export const mapMultipleSelectionToText = (
  selected: string | string[],
  options?: SelectableModel[]
): string | ReactNode[] => {
  if (typeof selected === 'string') {
    const option = options?.find((op) => op.code === selected);
    return option?.name || selected;
  }
  return selected.map((value, idx) => {
    const option = options?.find((op) => op.code === value);
    return option?.name || value;
  });
};
