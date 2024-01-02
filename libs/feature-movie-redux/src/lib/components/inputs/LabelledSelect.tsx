import { ChangeEvent, ReactNode } from 'react';

import '../movie.details.scss';

interface LabelledSelectProps {
  label: string;
  id: string;
  defaultValue?: number | string | string[];
  value?: number | string | string[] | null;
  options: ReactNode;
  callback: (event: ChangeEvent<HTMLSelectElement>) => void;
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
        disabled={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'false'}
        value={value}
        onChange={callback}
        className={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true' ? '' : 'disabled'}
      >
        {options}
      </select>
    </div>
  );
};
