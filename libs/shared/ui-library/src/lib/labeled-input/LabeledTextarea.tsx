import { FocusEvent } from 'react';
import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

interface Props extends LabeledInputProps {
  defaultValue?: string;
  callback: (event: FocusEvent<HTMLTextAreaElement>) => void;
}

export const LabeledTextarea = ({
  label,
  id,
  defaultValue,
  labelMode,
  orientation = 'column',
  callback,
  required = false,
  testName = 'LabelledTextarea_test',
}: Props) => (
  <LabeledInput
    id={id}
    label={label}
    labelMode={labelMode}
    orientation={orientation}
    testName={testName}
  >
    <textarea
      className="textarea-input-field"
      id={id}
      name={id}
      required={required}
      defaultValue={defaultValue}
      onBlur={callback}
      hidden={!enableMovieInfoEdit}
    />
    <span hidden={enableMovieInfoEdit}>{defaultValue}</span>
  </LabeledInput>
);
