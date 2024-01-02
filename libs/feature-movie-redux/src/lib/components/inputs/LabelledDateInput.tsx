import '../movie.details.scss';
import { FocusEvent } from 'react';

interface LabelledDateInputProps {
  label: string;
  id: string;
  defaultValue?: string;
  callback: (event: FocusEvent<HTMLInputElement>) => void;
  testName?: string;
}

export const LabelledDateInput = ({
  label,
  id,
  defaultValue,
  callback,
  testName = 'LabelledDateInput_test',
}: LabelledDateInputProps) => (
  <div className="labelled-input" data-test-name={testName}>
    <label htmlFor={id}>{label}</label>
    <input
      className="date-input"
      type="date"
      id={id}
      name={id}
      hidden={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'false'}
      defaultValue={defaultValue}
      onBlur={callback}
    />
    <span hidden={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true'}>{defaultValue}</span>
  </div>
);
