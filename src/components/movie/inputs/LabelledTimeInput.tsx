import React from 'react';
import PropTypes from 'prop-types';

import '../movie.details.scss';

import {environment} from "../../../env/environment";

const LabelledTimeInput = ({label, id, defaultValue, callback, ...props}) => {
    const strRuntime = defaultValue
        ? defaultValue.substring(defaultValue.lastIndexOf('T') + 1, defaultValue.length)
        : '';

    return (
        <div className="labelled-input" data-test-name="LabelledTimeInput_test">
            <label htmlFor={id}>{label}</label>
            <input className="date-input" type="datetime-local" id={id} name={id}
                   defaultValue={defaultValue} onBlur={callback} hidden={!environment.enableMovieInfoEdit} />
            <span hidden={environment.enableMovieInfoEdit}>{strRuntime}</span>
        </div>
    );
};

LabelledTimeInput.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    callback: PropTypes.func,
    testName: PropTypes.string
};

LabelledTimeInput.defaultProps = {
    testName: 'LabelledTimeInput_test'
};

export default LabelledTimeInput;

