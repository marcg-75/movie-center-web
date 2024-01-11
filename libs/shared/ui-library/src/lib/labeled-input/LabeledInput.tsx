import './labeled-input.scss';
import { ReactNode } from 'react';
import { LabeledInputProps } from './labeled-input.model';
import cn from 'classnames';

interface Props extends LabeledInputProps {
  children: ReactNode;
}

export const LabeledInput = ({
  htmlFor,
  label,
  labelAddition,
  labelMode = 'light',
  orientation = 'row',
  children,
  testName = `${htmlFor}_input_test`,
}: Props) => {
  const rootClassName = cn('container', {
    column: orientation === 'column',
  });

  const labelClassName = cn('label', {
    'label-bold': labelMode === 'bold',
    'fixed-width': orientation === 'row',
  });

  return (
    <div className={rootClassName} data-test-name={testName}>
      <label className={labelClassName} htmlFor={htmlFor}>
        {label} {labelAddition}
      </label>
      {children}
    </div>
  );
};
