import '../movie.details.scss';

import { environment } from '../../../env/environment';
import { FocusEvent } from 'react';

interface LabelledTextInputProps {
  label: string;
  id: string;
  defaultValue?: string | number;
  callback: (event: FocusEvent<HTMLInputElement>) => void;
  testName?: string;
}

export const LabelledTextInput = ({
  label,
  id,
  defaultValue,
  callback,
  testName = 'LabelledTextInput_test',
}: LabelledTextInputProps) => (
  <div className="labelled-input" data-test-name={testName}>
    <label htmlFor={id}>{label}</label>
    <input
      className="text-input-field"
      type="text"
      id={id}
      name={id}
      defaultValue={defaultValue}
      onBlur={callback}
      hidden={!environment.enableMovieInfoEdit}
    />
    <span hidden={environment.enableMovieInfoEdit}>{defaultValue}</span>
  </div>
);
