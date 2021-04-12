import React from 'react';
import PropTypes from 'prop-types';

import '../list-filter.component.scss';
import ListFilterItem from '../list-filter-item/ListFilterItem';

const TextListFilterItem = ({label, helpFilterText, filterBody}) => {
    const headerAdditions = helpFilterText ? (<i className="far fa-question-circle" title={helpFilterText}></i>) : undefined;

    const filterItemBody = (
        <div className="filter-freetext-input-wrapper">
            {filterBody}
        </div>
    );

    return (
        <ListFilterItem label={label} className="filter-body-block-freetext" headerAdditions={headerAdditions} filterBody={filterItemBody} />
    );
};

TextListFilterItem.propTypes = {
    label: PropTypes.string,
    helpFilterText: PropTypes.string,
    filterBody: PropTypes.node
};

TextListFilterItem.defaultProps = {
    label: 'Fritext'
};

export default TextListFilterItem;
