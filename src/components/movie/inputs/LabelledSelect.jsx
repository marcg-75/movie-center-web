import React from 'react';
import PropTypes from 'prop-types';

import '../movie.details.scss';

import {environment} from "../../../env/environment";

const LabelledSelect = ({label, id, defaultValue, value, options, callback, required, multiple, ...props}) => (
    <div className="labelled-input">
        <label htmlFor={id}>{label}</label>
        <select id={id} name={id} required={required} multiple={multiple} disabled={!environment.enableMovieInfoEdit}
                defaultValue={defaultValue} value={value} onChange={callback} className={environment.enableMovieInfoEdit ? '' : 'disabled'}>
            {options}
        </select>
    </div>
);

LabelledSelect.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    options: PropTypes.any,
    callback: PropTypes.func,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    testName: PropTypes.string
};

LabelledSelect.defaultProps = {
    testName: 'LabelledSelect_test'
};

export default LabelledSelect;

