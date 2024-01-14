import { ReactNode } from 'react';
import { LabeledInput } from '../labeled-input';

type Props = {
  id?: string;
  label: string;
  labelAddition?: ReactNode;
  children: ReactNode;
};

export const FilterItem = ({
  id = '',
  label,
  labelAddition,
  children,
}: Props) => {
  return (
    <div className="inline">
      <LabeledInput
        htmlFor={id}
        label={label}
        labelAddition={labelAddition}
        labelMode="bold"
        orientation="column"
      >
        <div className="pt-1 px-0 pb-2.5">{children}</div>
      </LabeledInput>
    </div>
  );
};
