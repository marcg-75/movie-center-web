import { ReactNode } from 'react';

import './filter.component.scss';
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
    <div className="filter-item">
      <LabeledInput
        id={id}
        label={label}
        labelAddition={labelAddition}
        labelMode="bold"
        orientation="column"
      >
        <div className="filter-body-block-field">{children}</div>
      </LabeledInput>
    </div>
  );
};
