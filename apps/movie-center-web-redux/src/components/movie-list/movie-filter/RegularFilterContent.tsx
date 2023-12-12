import { MovieFilter as MovieModelFilter } from "../../../models/movie.model";
import { ChangeEvent, KeyboardEvent, ReactNode, useEffect, useState } from "react";
import { Loader } from "../../common/loader/Loader";
import { ListFilterItem } from "../../common/list-filter/list-filter-item/ListFilterItem";
import { TextListFilterItem } from "../../common/list-filter/text-list-filter-item/TextListFilterItem";
import { connect } from "react-redux";
import { updateFilter } from "../../../actions/movie.actions";
import { loadGenres } from "../../../actions/base-data.actions";
import SelectableModel from "../../../models/SelectableModel";

const helpFilterFreetext =
    'Du kan välja att filtrera på filmens titel, genre eller annat. Tryck sedan på ' +
    'Enter eller på förstoringsglaset för att se resultat.';

interface RegularFilterContentProps {
    filter: MovieModelFilter;
    baseData: any;
    filterChanged: (filter: MovieModelFilter) => void;
    dispatch: (any: any) => void;
    testName?: string;
}

const RegularFilterContent = ({
    filter,
    baseData,
    filterChanged,
    dispatch,
    testName = 'RegularFilterContent_test'
}: RegularFilterContentProps) => {

    const [filterLoading, setFilterLoading] = useState(true);
    const [filterGenresToSelect, setFilterGenresToSelect] = useState([MovieModelFilter.FILTER_DEFAULT_ALL_GENRES]);

    useEffect(() => {
        dispatch(loadGenres());
    }, []);

    useEffect(() => {
        if (!filterGenresToSelect || (filterGenresToSelect.length < 2 && baseData && baseData.genres)) {
            const genresToSelect = Object.assign([], baseData.genres) as Array<SelectableModel>;
            genresToSelect.unshift(MovieModelFilter.FILTER_DEFAULT_ALL_GENRES);

            setFilterGenresToSelect(genresToSelect);
        }

        setFilterLoading(!filter || !baseData || !(baseData.genresLoaded));
    }, [filter, baseData]);

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | KeyboardEvent): void => {
        const control = e.target as HTMLInputElement;

        const filterCopy: MovieModelFilter = Object.assign({}, filter) as MovieModelFilter;

        switch (control.name) {
            case 'title':
                filterCopy.title = control.value || undefined;
                break;
            case 'genreCode':
                filterCopy.genreCode = control.value || undefined;
                break;
            case 'freetext':
                filterCopy.freetext = control.value || undefined;
                break;
        }

        if (filterChanged) {
            filterChanged(filterCopy);
        }
    };

    const freetextChanged = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        return dispatch(updateFilter({...filter, freetext: e.target.value} as MovieModelFilter));
    };

    const handleEnterKeyInvoke = (e: any, callback: (e: KeyboardEvent) => void) => {
        if (e.key === 'Enter') {
            callback(e);
        }
    };

    const titleChanged = (e: ChangeEvent<HTMLInputElement>) => {
        e.persist();
        return dispatch(updateFilter({...filter, title: e.target.value} as MovieModelFilter));
    };

    const filterGenreItemsToSelect: ReactNode[] = filterGenresToSelect.map((option, i) => {
        return <option key={i} value={option.code}>{option.name}</option>;
    });

    return filterLoading ? (<div><Loader/></div>) : (
        <div data-test-name={testName}>
            <TextListFilterItem label="Titel" filterBody={(<div>
                <input className="filter-text-input-field" type="text" placeholder="Sök på filmtitel..."
                       name="title" value={filter.title}
                       onKeyUp={(e) => handleEnterKeyInvoke(e, (e) => changeHandler(e))}
                       onChange={titleChanged} />
                <i className="fa fa-search filter-freetext-magnifying-glass" onClick={() => filterChanged(filter)} />
            </div>)} />

            <ListFilterItem label="Genre" filterBody={(
                <select name="genreCode" value={filter.genreCode}
                        onChange={changeHandler}>
                    {filterGenreItemsToSelect}
                </select>
            )} />

            <TextListFilterItem helpFilterText={helpFilterFreetext} filterBody={(<div>
                <input className="filter-text-input-field" type="text" placeholder="Filtrera på övriga fält..."
                       name="freetext" value={filter.freetext}
                       onKeyUp={(e) => handleEnterKeyInvoke(e, (e) => changeHandler(e))}
                       onChange={freetextChanged.bind(this)} />
                <i className="fa fa-search filter-freetext-magnifying-glass" onClick={() => filterChanged(filter)} />
            </div>)} />
        </div>
    );
};

// @ts-ignore
function stateToProps({baseData, movieList: {filter}}) {
    return {
        baseData,
        filter
    };
}

export default connect(stateToProps)(RegularFilterContent);
