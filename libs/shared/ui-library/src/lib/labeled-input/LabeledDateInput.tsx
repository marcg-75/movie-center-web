import { FocusEvent } from 'react';
import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

interface Props extends LabeledInputProps {
  defaultValue?: string;
  callback: (event: FocusEvent<HTMLInputElement>) => void;
}

export const LabeledDateInput = ({
  label,
  id,
  defaultValue,
  labelMode,
  orientation,
  callback,
  testName = 'LabelledDateInput_test',
}: Props) => (
  <LabeledInput
    id={id}
    label={label}
    labelMode={labelMode}
    orientation={orientation}
    testName={testName}
  >
    <input
      className="date-input"
      type="date"
      id={id}
      name={id}
      hidden={!enableMovieInfoEdit}
      defaultValue={defaultValue}
      onBlur={callback}
    />
    <span hidden={enableMovieInfoEdit}>{defaultValue}</span>
  </LabeledInput>
);
