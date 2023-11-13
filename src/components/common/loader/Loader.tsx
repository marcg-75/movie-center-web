import React from 'react';
import './loader.component.scss';

interface LoaderProps {
    testName?: string;
}

export const Loader = ({ testName = 'Loader_test' }: LoaderProps) => (
    <div className="lds-spinner" data-test-name={testName}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
);
