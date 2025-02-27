import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';
import { DatePicker, PickerValidDate } from '@mui/x-date-pickers';

interface Props extends LabeledInputProps {
  defaultValue?: string;
}

export const LabeledDateInput = ({
  label,
  htmlFor,
  name,
  defaultValue,
  labelMode,
  orientation,
  testName = 'LabelledDateInput_test',
}: Props) => {
  const date: PickerValidDate | undefined = defaultValue
    ? (new Date(defaultValue) as PickerValidDate)
    : undefined;

  return (
    <LabeledInput
      htmlFor={htmlFor}
      label={label}
      labelMode={labelMode}
      orientation={orientation}
      testName={testName}
    >
      <DatePicker name={name} format="yyyy-MM-dd" value={date} />
    </LabeledInput>
  );
};
