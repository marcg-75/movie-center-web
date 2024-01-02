import '../movie.details.scss';
import { FocusEvent } from 'react';
import { environment } from '../../../../../../apps/movie-center-web-redux/src/env/environment';

interface LabelledTimeInputProps {
  label: string;
  id: string;
  defaultValue?: string;
  callback: (event: FocusEvent<HTMLInputElement>) => void;
  testName?: string;
}

export const LabelledTimeInput = ({
  label,
  id,
  defaultValue,
  callback,
  testName = 'LabelledTimeInput_test',
}: LabelledTimeInputProps) => {
  const strRuntime = defaultValue
    ? defaultValue.substring(
        defaultValue.lastIndexOf('T') + 1,
        defaultValue.length
      )
    : '';

  return (
    <div className="labelled-input" data-test-name={testName}>
      <label htmlFor={id}>{label}</label>
      <input
        className="date-input"
        type="datetime-local"
        id={id}
        name={id}
        defaultValue={defaultValue}
        onBlur={callback}
        hidden={!environment.enableMovieInfoEdit}
      />
      <span hidden={environment.enableMovieInfoEdit}>{strRuntime}</span>
    </div>
  );
};
