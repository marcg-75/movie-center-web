import '../movie.details.scss';
import { FocusEvent } from 'react';

interface LabelledTextareaProps {
  label: string;
  id: string;
  defaultValue?: string;
  callback: (event: FocusEvent<HTMLTextAreaElement>) => void;
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
      hidden={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'false'}
    />
    <span hidden={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true'}>{defaultValue}</span>
  </div>
);
