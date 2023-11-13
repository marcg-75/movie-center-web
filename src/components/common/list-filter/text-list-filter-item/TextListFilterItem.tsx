import React, { ReactNode } from 'react';

import '../list-filter.component.scss';
import {ListFilterItem} from "../list-filter-item/ListFilterItem";

interface TextListFilterItemProps {
    label?: string;
    helpFilterText?: string;
    filterBody: ReactNode;
}

export const TextListFilterItem = ({label = 'Fritext', helpFilterText, filterBody}: TextListFilterItemProps) => {
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
