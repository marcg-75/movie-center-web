import React from 'react';
import PropTypes from 'prop-types';

import '../movie.details.scss';

import {environment} from "../../../env/environment";

const LabelledTextInput = ({label, id, defaultValue, callback, ...props}) => (
    <div className="labelled-input" data-test-name="LabelledTextInput_test">
        <label htmlFor={id}>{label}</label>
        <input className="text-input-field" type="text" id={id} name={id}
               defaultValue={defaultValue} onBlur={callback} hidden={!environment.enableMovieInfoEdit} />
        <span hidden={environment.enableMovieInfoEdit}>{defaultValue}</span>
    </div>
);

LabelledTextInput.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    callback: PropTypes.func,
    testName: PropTypes.string
};

LabelledTextInput.defaultProps = {
    testName: 'LabelledTextInput_test'
};

export default LabelledTextInput;

