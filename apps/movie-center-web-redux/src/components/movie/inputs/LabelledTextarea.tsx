import '../movie.details.scss';

import { environment } from '../../../env/environment';

interface LabelledTextareaProps {
  label: string;
  id: string;
  defaultValue?: string;
  callback: (event: any) => void;
  required: boolean;
  testName?: string;
}

export const LabelledTextarea = ({
  label,
  id,
  defaultValue,
  callback,
  required = false,
  testName = 'LabelledTextarea_test',
}: LabelledTextareaProps) => (
  <div className="labelled-input" data-test-name={testName}>
    <label htmlFor={id}>{label}</label>
    <textarea
      className="textarea-input-field"
      id={id}
      name={id}
      required={required}
      defaultValue={defaultValue}
      onBlur={callback}
      hidden={!environment.enableMovieInfoEdit}
    />
    <span hidden={environment.enableMovieInfoEdit}>{defaultValue}</span>
  </div>
);
