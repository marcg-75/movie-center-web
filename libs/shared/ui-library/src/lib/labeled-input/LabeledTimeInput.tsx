import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { TimeField } from '@mui/x-date-pickers';
import { toDate } from 'date-fns';

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
  const strRuntime = defaultValue
    ? defaultValue.substring(
        defaultValue.lastIndexOf('T') + 1,
        defaultValue.length
      )
    : '';

  const runtime = defaultValue ? toDate(new Date(defaultValue)) : undefined;

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
