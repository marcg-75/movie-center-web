import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import debounce from 'lodash/debounce';

import {environment} from '../../../env/environment';

import {loadGenres, loadFormats} from '../../../actions/base-data.actions';
import {updateFilter, clearMovieActionState} from '../../../actions/movie.actions';

import ListFilter from '../../common/list-filter/ListFilterComponent';
import ListFilterItem from '../../common/list-filter/list-filter-item/ListFilterItem';
import TextListFilterItem from '../../common/list-filter/text-list-filter-item/TextListFilterItem';
import Loader from '../../common/loader/Loader';
import {MovieFilter} from '../../../models/MovieModel';
import SelectableModel from '../../../models/SelectableModel';
import {FilterType} from '../../../models/FilterSettingsModel';

const helpFilter =
    'Du kan filtrera fram de filmer som du är intresserad i genom att välja kriteria ' +
    'eller skriva valfri text. Du kan återställa filtret genom att trycka på länken ' +
    '"Rensa filtrering", varefter alla filmer kommer att visas.';

const helpFilterFreetext =
    'Du kan välja att filtrera på filmens titel, genre eller annat. Tryck sedan på ' +
    'Enter eller på förstoringsglaset för att se resultat.';

interface IMovieFilterProps {
    filter: MovieFilter,
    componentName: string;
    clearFilter: () => void,
    filterChanged: (filter: MovieFilter) => void,
    loadFilter: (filter: MovieFilterComponent) => void,
    baseData: any,
    dispatch: (any) => void,
    testName: string
}

interface IMovieFilterState {
    filterGenresToSelect: Array<SelectableModel>;
    filterFormatsToSelect: Array<SelectableModel>;
    filterGradesToSelect: Array<{code: number, name: string}>;
}

class MovieFilterComponent extends Component<IMovieFilterProps, IMovieFilterState> {

    static defaultProps = { testName: 'MovieFilter_test'};

    constructor(props: any) {
        super(props);

        this.state = {
            filterGenresToSelect: [MovieFilter.FILTER_DEFAULT_ALL_GENRES],
            filterFormatsToSelect: [MovieFilter.FILTER_DEFAULT_ALL_FORMATS],
            filterGradesToSelect: MovieFilter.FILTER_SELECTABLE_GRADES
        };

        this.changeHandler = this.changeHandler.bind(this);
        //this.titleChanged = this.titleChanged.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(loadGenres());
        this.props.dispatch(loadFormats());

        this.props.dispatch(clearMovieActionState());
    }

    componentDidUpdate() {
        const {baseData} = this.props;
        const {filterGenresToSelect, filterFormatsToSelect} = this.state;

        if (!filterGenresToSelect || (filterGenresToSelect.length < 2 && baseData && baseData.genres)) {
            const genresToSelect = Object.assign([], baseData.genres) as Array<SelectableModel>;
            genresToSelect.unshift(MovieFilter.FILTER_DEFAULT_ALL_GENRES);

            this.setState({
                ...this.state,
                filterGenresToSelect: genresToSelect
            });
        }

        if (!filterFormatsToSelect || (filterFormatsToSelect.length < 2 && baseData && baseData.formats)) {
            const formatsToSelect = Object.assign([], baseData.formats) as Array<SelectableModel>;
            formatsToSelect.unshift(MovieFilter.FILTER_DEFAULT_ALL_GENRES);

            this.setState({
                ...this.state,
                filterFormatsToSelect: formatsToSelect
            });
        }
    }

    get isFilterLoading(): boolean {
        const {baseData, filter} = this.props;

        return !filter || !baseData || !(baseData.genresLoaded && baseData.formatsLoaded);
    }

    changeHandler(e) {
        const {filter, filterChanged} = this.props;
        const control = e.target;

        const filterCopy: MovieFilter = Object.assign({}, filter) as MovieFilter;

        switch (control.name) {
            case 'title':
                filterCopy.title = control.value;
                break;
            case 'mainGenreCode':
                filterCopy.mainGenreCode = control.value;
                break;
            case 'formatCode':
                filterCopy.formatCode = control.value;
                break;
            case 'grade':
                filterCopy.grade = parseInt(control.value, 10);
                break;
            case 'freetext':
                filterCopy.freetext = control.value;
                break;

        }

        if (filterChanged) {
            filterChanged(filterCopy);
        }
    }

    handleEnterKeyInvoke = (e: any, callback) => {
        if (e.key === 'Enter') {
            callback(e);
        }
    };

    freetextChanged = (e) => {
        e.persist();
        const {filter, dispatch} = this.props;
        return dispatch(updateFilter({...filter, freetext: e.target.value} as MovieFilter));
    };

    titleChanged = (e) => {
        e.persist();
        const {filter, dispatch} = this.props;
        return dispatch(updateFilter({...filter, title: e.target.value} as MovieFilter));
    };

    render() {
        const {filter, dispatch} = this.props;
        const {filterGenresToSelect, filterFormatsToSelect, filterGradesToSelect} = this.state;

        let content;

        if (this.isFilterLoading) {
            //<loading-content [isLoading]="isFilterLoading" [showOverlay]="isFilterLoading" loaderClass="fixed-filter-loader">
            content = (<div><Loader /></div>);
        } else {
            const filterGenreItemsToSelect = filterGenresToSelect.map((option, i) => {
                return <option key={i} value={option.code}>{option.name}</option>;
            });

            const filterFormatItemsToSelect = filterFormatsToSelect.map((option, i) => {
                return <option key={i} value={option.code}>{option.name}</option>;
            });

            const filterGradeItemsToSelect = filterGradesToSelect.map((option, i) => {
                return <option key={i} value={option.code}>{option.name}</option>;
            });

            const regularContent = (
                <div>
                    <TextListFilterItem label="Titel" filterBody={(<div>
                        <input className="filter-text-input-field" type="text" placeholder="Sök på filmtitel..."
                               name="title" value={filter.title}
                               onKeyUp={(e) => this.handleEnterKeyInvoke(e, (e) => this.changeHandler(e))}
                               onChange={this.titleChanged.bind(this)} />
                        <i className="fa fa-search filter-freetext-magnifying-glass" onClick={() => this.props.filterChanged(filter)} />
                    </div>)} />

                    <ListFilterItem label="Genre" filterBody={(
                        <select name="mainGenreCode" value={filter.mainGenreCode}
                                onChange={this.changeHandler}>
                            {filterGenreItemsToSelect}
                        </select>
                    )} />

                    <TextListFilterItem helpFilterText={helpFilterFreetext} filterBody={(<div>
                            <input className="filter-text-input-field" type="text" placeholder="Filtrera på övriga fält..."
                                   name="freetext" value={filter.freetext}
                                   onKeyUp={(e) => this.handleEnterKeyInvoke(e, (e) => this.changeHandler(e))}
                                   onChange={this.freetextChanged.bind(this)} />
                            <i className="fa fa-search filter-freetext-magnifying-glass" onClick={() => this.props.filterChanged(filter)} />
                        </div>)} />
                </div>
            );

            const extendedContent = (
                <div>
                    <ListFilterItem label="Format" filterBody={(
                        <select name="formatCode" value={filter.formatCode}
                                onChange={this.changeHandler}>
                            {filterFormatItemsToSelect}
                        </select>
                    )} />

                    <ListFilterItem label="Betyg" filterBody={(
                            <select name="grade" value={filter.grade} onChange={this.changeHandler}>
                                {filterGradeItemsToSelect}
                            </select>
                        )} />
                </div>
            );

            content = (
                <ListFilter componentName={this.props.componentName}
                            header="Filtrering av filmer"
                            helpText={helpFilter}
                            clearFilter={this.props.clearFilter.bind(this)}
                            filter={filter}
                            filterType={FilterType.MOVIE}
                            loadFilter={this.props.loadFilter.bind(this)}
                            enableSaveFilter={environment.enableSaveMovieFilter}
                            compactModeActions={true}
                            regularContent={regularContent}
                            extendedContent={extendedContent} />
            );
        }

        return (
            <div>{content}</div>
        )
    }
}

function stateToProps({baseData, movie: {filter}}) {
    return {
        baseData,
        filter
    };
}

export default withRouter(connect(stateToProps)(MovieFilterComponent));
