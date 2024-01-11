import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { TextareaAutosize } from '@mui/material';
import { Controller } from 'react-hook-form';

interface Props extends LabeledInputProps {
  defaultValue?: string;
}

export const LabeledTextarea = ({
  label,
  htmlFor,
  name,
  defaultValue,
  labelMode,
  orientation = 'column',
  control,
  required = false,
  requiredText,
  rules = {},
  testName = 'LabelledTextarea_test',
}: Props) => (
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
        <TextareaAutosize
          {...field}
          id={htmlFor}
          name={name}
          minRows={3}
          required={required}
          value={defaultValue}
        />
      )}
      rules={{
        ...rules,
        required: requiredText,
      }}
    />
  </LabeledInput>
);
