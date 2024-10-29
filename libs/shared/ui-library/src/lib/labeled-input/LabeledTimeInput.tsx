import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { PickerValidDate, TimeField } from '@mui/x-date-pickers';

interface Props extends LabeledInputProps {
  defaultValue?: string;
}

export const LabeledTimeInput = ({
  label,
  name,
  htmlFor,
  defaultValue,
  labelMode,
  orientation,
  required = false,
  testName = 'LabelledTimeInput_test',
}: Props) => {
  const runtime: PickerValidDate | undefined = defaultValue ? new Date(defaultValue) as PickerValidDate : undefined;

  return (
    <LabeledInput
      htmlFor={htmlFor}
      label={label}
      labelMode={labelMode}
      orientation={orientation}
      testName={testName}
    >
      <TimeField
        className="date-input"
        value={runtime}
        format="HH:mm"
        required={required}
      />
    </LabeledInput>
  );
};
