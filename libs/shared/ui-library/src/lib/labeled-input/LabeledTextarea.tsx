import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { TextareaAutosize } from '@mui/material';

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
                                  required = false,
                                  testName = 'LabelledTextarea_test',
                                }: Props) => (
  <LabeledInput
    htmlFor={htmlFor}
    label={label}
    labelMode={labelMode}
    orientation={orientation}
    testName={testName}
  >
    <TextareaAutosize
      id={htmlFor}
      name={name}
      minRows={3}
      required={required}
      value={defaultValue}
    />
  </LabeledInput>
);
