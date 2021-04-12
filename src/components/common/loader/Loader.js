import React from 'react';
import PropTypes from 'prop-types';
import './loader.component.scss';

const Loader = ({ ...props }) => (
    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
);

Loader.propTypes = {
    testName: PropTypes.string
};

Loader.defaultProps = {
    testName: 'Loader_test'
};

export default Loader;
