import './loader.component.scss';

type Props = {
  testName?: string;
};

export const Loader = ({ testName = 'Loader_test' }: Props) => (
  <div className="lds-spinner" data-test-name={testName}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
