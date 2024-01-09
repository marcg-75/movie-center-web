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

export const LabeledTimeInput = ({
  label,
  id,
  defaultValue,
  labelMode,
  orientation,
  callback,
  testName = 'LabelledTimeInput_test',
}: Props) => {
  const strRuntime = defaultValue
    ? defaultValue.substring(
        defaultValue.lastIndexOf('T') + 1,
        defaultValue.length
      )
    : '';

  return (
    <LabeledInput
      id={id}
      label={label}
      labelMode={labelMode}
      orientation={orientation}
      testName={testName}
    >
      <input
        className="date-input"
        type="datetime-local"
        id={id}
        name={id}
        defaultValue={defaultValue}
        onBlur={callback}
        hidden={!enableMovieInfoEdit}
      />
      <span hidden={enableMovieInfoEdit}>{strRuntime}</span>
    </LabeledInput>
  );
};
