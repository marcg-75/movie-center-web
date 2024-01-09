import './labeled-input.scss';
import { FocusEvent } from 'react';
import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

interface Props extends LabeledInputProps {
  defaultValue?: string | number;
  placeholder?: string;
  callback: (event: FocusEvent<HTMLInputElement>) => void;
}

export const LabeledTextInput = ({
  label,
  id,
  defaultValue,
  placeholder,
  labelMode,
  orientation,
  callback,
  testName = 'LabelledTextInput_test',
}: Props) => (
  <LabeledInput
    id={id}
    label={label}
    labelMode={labelMode}
    orientation={orientation}
    testName={testName}
  >
    <input
      className="text-input"
      type="text"
      id={id}
      placeholder={placeholder}
      name={id}
      defaultValue={defaultValue}
      onBlur={callback}
      hidden={!enableMovieInfoEdit}
    />
    <span hidden={enableMovieInfoEdit}>{defaultValue}</span>
  </LabeledInput>
);
