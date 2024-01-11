import './labeled-input.scss';
import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import { FocusEvent } from 'react';

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
  htmlFor,
  name,
  defaultValue,
  placeholder,
  labelMode,
  orientation,
  control,
  required = false,
  requiredText,
  rules = {},
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
      <Controller
        control={control}
        name={name}
        render={({ field: { ref, ...field } }) => (
          <TextField
            {...field}
            type="text"
            id={htmlFor}
            placeholder={placeholder}
            required={required}
            value={defaultValue}
            onBlur={callback}
            hidden={!enableMovieInfoEdit}
          />
        )}
        rules={{
          ...rules,
          required: requiredText,
        }}
      />
    </LabeledInput>
  );
};
