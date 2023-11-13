import {ListFilterItem} from "../../common/list-filter/list-filter-item/ListFilterItem";
import React, {ReactNode, useEffect, useState} from "react";
import {MovieFilter as MovieModelFilter} from "../../../models/MovieModel";
import SelectableModel from "../../../models/SelectableModel";
import {Loader} from "../../common/loader/Loader";
import {loadFormats} from "../../../actions/base-data.actions";
import {connect} from "react-redux";

interface ExtendedFilterContentProps {
    filter: MovieModelFilter;
    baseData: any;
    filterChanged: (filter: MovieModelFilter) => void;
    dispatch: (any: any) => void;
    testName?: string;
}

const ExtendedFilterContent = ({
    filter,
    baseData,
    filterChanged,
    dispatch,
    testName = 'ExtendedFilterContent_test'
}: ExtendedFilterContentProps) => {

    const [filterLoading, setFilterLoading] = useState(true);
    const [filterFormatsToSelect, setFilterFormatsToSelect] = useState([MovieModelFilter.FILTER_DEFAULT_ALL_FORMATS]);
    const [filterGradesToSelect, setFilterGradesToSelect] = useState(MovieModelFilter.FILTER_SELECTABLE_GRADES);

    useEffect(() => {
        dispatch(loadFormats());
    }, []);

    useEffect(() => {
        if (!filterFormatsToSelect || (filterFormatsToSelect.length < 2 && baseData?.formats)) {
            const formatsToSelect = Object.assign([], baseData.formats) as Array<SelectableModel>;
            formatsToSelect.unshift(MovieModelFilter.FILTER_DEFAULT_ALL_GENRES);

            setFilterFormatsToSelect(formatsToSelect);
        }

        setFilterLoading(!filter || !baseData?.formatsLoaded);
    }, [filter, baseData]);

    const changeHandler = (e): void => {
        const control = e.target;

        const filterCopy: MovieModelFilter = Object.assign({}, filter) as MovieModelFilter;

        switch (control.name) {
            case 'formatCode':
                filterCopy.formatCode = control.value;
                break;
            case 'grade':
                filterCopy.grade = parseInt(control.value, 10);
                break;
        }

        if (filterChanged) {
            filterChanged(filterCopy);
        }
    };

    const filterFormatItemsToSelect: ReactNode[] = filterFormatsToSelect.map((option, i) => {
        return <option key={i} value={option.code}>{option.name}</option>;
    });

    const filterGradeItemsToSelect: ReactNode[] = filterGradesToSelect.map((option, i) => {
        return <option key={i} value={option.code}>{option.name}</option>;
    });

    return filterLoading ? (<div><Loader/></div>) : (
        <div data-test-name={testName}>
            <ListFilterItem label="Format" filterBody={(
                <select name="formatCode" value={filter.formatCode}
                        onChange={changeHandler}>
                    {filterFormatItemsToSelect}
                </select>
            )} />

            <ListFilterItem label="Betyg" filterBody={(
                <select name="grade" value={filter.grade} onChange={changeHandler}>
                    {filterGradeItemsToSelect}
                </select>
            )} />
        </div>
    );
};

function stateToProps({baseData, movie: {filter}}) {
    return {
        baseData,
        filter
    };
}

export default connect(stateToProps)(ExtendedFilterContent);
