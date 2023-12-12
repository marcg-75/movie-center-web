import '../movie.details.scss';

import { environment } from '../../../env/environment';
import { FocusEvent } from 'react';

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
