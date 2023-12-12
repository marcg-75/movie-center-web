import { ReactNode } from 'react';

import '../movie.details.scss';
import { environment } from '../../../env/environment';

interface LabelledSelectProps {
  label: string;
  id: string;
  defaultValue?: number | string | string[];
  value?: number | string | string[] | null;
  options: ReactNode;
  callback: (event: any) => void;
  required: boolean;
  multiple: boolean;
  testName?: string;
}

export const LabelledSelect = ({
  label,
  id,
  defaultValue,
  value = defaultValue,
  options,
  callback,
  required,
  multiple,
  testName = 'LabelledSelect_test',
}: LabelledSelectProps) => {
  if (!value) {
    value = multiple ? [] : '';
  }

  return (
    <div className="labelled-input" data-test-name={testName}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        required={required}
        multiple={multiple}
        disabled={!environment.enableMovieInfoEdit}
        value={value}
        onChange={callback}
        className={environment.enableMovieInfoEdit ? '' : 'disabled'}
      >
        {options}
      </select>
    </div>
  );
};
