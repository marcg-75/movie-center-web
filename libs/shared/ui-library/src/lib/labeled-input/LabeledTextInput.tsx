import './labeled-input.scss';
import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { TextField } from '@mui/material';
import { FocusEvent } from 'react';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

interface Props extends LabeledInputProps {
  defaultValue?: string | number;
  placeholder?: string;
  callback: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const LabeledTextInput = ({
                                   label,
                                   htmlFor,
                                   name,
                                   defaultValue,
                                   placeholder,
                                   labelMode,
                                   orientation,
                                   required = false,
                                   callback,
                                   testName = 'LabelledTextInput_test',
                                 }: Props) => {
  return (
    <LabeledInput
      htmlFor={htmlFor}
      label={label}
      labelMode={labelMode}
      orientation={orientation}
      testName={testName}
    >
      <TextField
        type="text"
        id={htmlFor}
        placeholder={placeholder}
        required={required}
        value={defaultValue}
        onBlur={callback}
        hidden={!enableMovieInfoEdit}
      />
    </LabeledInput>
  );
};
