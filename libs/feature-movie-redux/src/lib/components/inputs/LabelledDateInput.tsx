import '../movie.details.scss';
import { FocusEvent } from 'react';
import { environment } from '../../../../../../apps/movie-center-web-redux/src/env/environment';

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
      hidden={!environment.enableMovieInfoEdit}
      defaultValue={defaultValue}
      onBlur={callback}
    />
    <span hidden={environment.enableMovieInfoEdit}>{defaultValue}</span>
  </div>
);
