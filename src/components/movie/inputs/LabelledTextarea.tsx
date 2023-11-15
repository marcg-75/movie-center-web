import React from 'react';
import PropTypes from 'prop-types';

import '../movie.details.scss';

import {environment} from "../../../env/environment";

const LabelledTextarea = ({label, id, defaultValue, callback, required = false, ...props}) => (
    <div className="labelled-input" data-test-name="LabelledTextarea_test">
        <label htmlFor={id}>{label}</label>
                <textarea className="textarea-input-field" id={id} name={id} required={required}
                          defaultValue={defaultValue} onBlur={callback} hidden={!environment.enableMovieInfoEdit} />
        <span hidden={environment.enableMovieInfoEdit}>{defaultValue}</span>
    </div>
);

LabelledTextarea.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    callback: PropTypes.func,
    required: PropTypes.bool,
    testName: PropTypes.string
};

LabelledTextarea.defaultProps = {
    testName: 'LabelledTextarea_test'
};

export default LabelledTextarea;

