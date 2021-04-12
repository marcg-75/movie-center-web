import React from 'react';
import PropTypes from 'prop-types';

import '../list-filter.component.scss';

const ListFilterItem = ({label, className, headerAdditions, filterBody}) => {
    return (
        <div className={'filter-body-block ' + className}>
            {label && (
                <div className="filter-body-block-title">
                    {label} {headerAdditions && headerAdditions}
                </div>)}

            <div className="filter-body-block-field">
                {filterBody}
            </div>
        </div>
    );
};

ListFilterItem.propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    headerAdditions: PropTypes.node,
    filterBody: PropTypes.node
};

export default ListFilterItem;
