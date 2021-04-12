import React from 'react';
import PropTypes from 'prop-types';

import '../movie.details.scss';

import {environment} from "../../../env/environment";

const LabelledDateInput = ({label, id, defaultValue, callback, ...props}) => (
    <div className="labelled-input" data-test-name="LabelledDateInput_test">
        <label htmlFor={id}>{label}</label>
        <input className="date-input" type="date" id={id} name={id} hidden={!environment.enableMovieInfoEdit}
               defaultValue={defaultValue} onBlur={callback} />
        <span hidden={environment.enableMovieInfoEdit}>{defaultValue}</span>
    </div>
);

LabelledDateInput.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    callback: PropTypes.func,
    testName: PropTypes.string
};

LabelledDateInput.defaultProps = {
    testName: 'LabelledDateInput_test'
};

export default LabelledDateInput;

