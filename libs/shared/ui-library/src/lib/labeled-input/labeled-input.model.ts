// Mutual properties for all labeled input components. Extend to add more.
import { ReactNode } from 'react';
import { Control, RegisterOptions } from 'react-hook-form';
import { IMovie } from '@giron/shared-models';

export interface LabeledInputProps {
  name?: string;
  htmlFor: string;
  label: string;
  labelAddition?: ReactNode;
  labelMode?: 'light' | 'bold';
  orientation?: 'row' | 'column';
  required?: boolean;
  requiredText?: string;
  control?: Control<IMovie>;
  rules?: RegisterOptions;
  testName?: string;
}
