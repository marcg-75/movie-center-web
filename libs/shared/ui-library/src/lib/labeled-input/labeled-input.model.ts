// Mutual properties for all labeled input components. Extend to add more.
import { ReactNode } from 'react';

export interface LabeledInputProps {
  id: string;
  label: string;
  labelAddition?: ReactNode;
  labelMode?: 'light' | 'bold';
  orientation?: 'row' | 'column';
  required?: boolean;
  testName?: string;
}
