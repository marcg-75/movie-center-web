import { ChangeEvent, ReactNode } from 'react';
import { LabeledInputProps } from './labeled-input.model';
import { LabeledInput } from './LabeledInput';

interface Props extends LabeledInputProps {
  defaultValue?: number | string | string[];
  value?: number | string | string[] | null;
  options: ReactNode;
  callback: (event: ChangeEvent<HTMLSelectElement>) => void;
  multiple: boolean;
}

export const LabeledSelect = ({
                                label,
                                id,
                                defaultValue,
                                value = defaultValue,
                                labelMode,
                                orientation,
                                options,
                                callback,
                                required = false,
                                multiple,
                                testName = 'LabelledSelect_test',
                              }: Props) => {
  if (!value) {
    value = multiple ? [] : '';
  }

  return (
    <LabeledInput id={id} label={label} labelMode={labelMode} orientation={orientation} testName={testName}>
      <select
        id={id}
        name={id}
        required={required}
        multiple={multiple}
        disabled={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'false'}
        value={value}
        onChange={callback}
        className={process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true' ? '' : 'disabled'}
      >
        {options}
      </select>
    </LabeledInput>
  );
};
