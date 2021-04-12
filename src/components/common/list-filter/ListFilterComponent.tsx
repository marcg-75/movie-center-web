import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

import './list-filter.component.scss';
import ClearListFilterItem from './clear-list-filter-item/ClearListFilterItem';
import {Filter} from '../../../models/Filter';
import {FilterType} from '../../../models/FilterSettingsModel';
import {MovieFilter} from '../../../models/MovieModel';

interface IListFilterProps {
    componentName: string,
    header: string,
    helpText: string,
    isExtendedFilterEnabled: boolean,
    clearFilter: () => void,
    filter: Filter<any>,
    filterType: FilterType,
    loadFilter: (filter: Filter<MovieFilter>) => void,
    enableSaveFilter: boolean,
    compactModeActions: boolean,
    regularContent: any,
    extendedContent: any
}

interface IListFilterState {
    isVisible: boolean,
    isExtendedVisible: boolean
}

class ListFilterComponent extends Component<IListFilterProps, IListFilterState> {

    constructor(props: any) {
        super(props);

        if (!props.componentName) {
            console.error('componentName attribute missing for list filter.');
        } else {
            this.state = {
                isVisible: filterToggleDefault(props.componentName),
                isExtendedVisible: extendedFilterToggleDefault(props.componentName)
            };
        }

        this.toggleFilter = this.toggleFilter.bind(this);
        this.toggleExtended = this.toggleExtended.bind(this);
        this.back = this.back.bind(this);
    }

    static defaultProps = {
        isExtendedFilterEnabled: true,
        testName: 'ListFilter_test'
    };

    render() {
        const {header, helpText, isExtendedFilterEnabled, enableSaveFilter, compactModeActions,
            regularContent, extendedContent} = this.props;
        const {isVisible, isExtendedVisible} = this.state;

        return (
            <div className="filter">
                <div className={'filter-header' + (isVisible ? ' expanded' : '')}>
                    <div className="filter-header-toggle-container">
                        <span onClick={this.toggleFilter}>
                            <i className="filter-header-title-icon fas fa-caret-right" /> {header} <i className="far fa-question-circle" title={helpText} />
                        </span>

                        <div className="filter-toggles">
                            {isExtendedFilterEnabled && (
                                <span className="filter-header-toggle-extended">
                                    <label className="toggle-container">
                                        <input type="checkbox" className="real-checkbox" value={'' + isExtendedVisible} checked={isExtendedVisible} onChange={this.toggleExtended} />
                                        <div className="toggle-button"></div>
                                    </label>
                                    <span className="filter-extended-label" onClick={this.toggleExtended}>Utökad</span>
                                </span>
                            )}

                            <span className="filter-header-toggle" onClick={this.toggleFilter}>
                                <span>{this.toggleText}</span>
                                <i className={'filter-header-toggle-icon fas ' + (isVisible ? 'fa-angle-up' : 'fa-angle-down')} />
                            </span>
                        </div>
                    </div>

                    <button className="filter-header-back-btn" onClick={this.back}>
                        <i className="fas fa-caret-left orange" />Tillbaka
                    </button>
                </div>

                { isVisible && (
                    <div className="filter-body">
                        <div className="filter-parameters-container">
                            {regularContent}

                            <div className={'extended-section' + (isExtendedVisible ? ' extended-section-visible' : '')}>
                                {isExtendedVisible && extendedContent}
                            </div>
                        </div>

                        <div className="filter-actions-container">
                            <ClearListFilterItem clearFilter={this.props.clearFilter.bind(this)} compactMode={compactModeActions && enableSaveFilter} />

                            { /*enableSaveFilter && (
                                <store-filter-settings filter={filter} filterType={filterType} compactMode={compactModeActions}></store-filter-settings>
                                <list-filter-settings filterType={filterType} loadFilter={this.props.loadFilter.bind(this)} compactMode={compactModeActions}></list-filter-settings>
                            )*/}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    get toggleText() {
        return this.state.isVisible ? 'Dölj' : 'Visa';
    }

    toggleFilter() {
        const shouldFilterBeVisible = !this.state.isVisible;

        this.setState({
            ...this.state,
            isVisible: shouldFilterBeVisible
        });
        localStorage.setItem(`${this.props.componentName}_filter_toggle_state`, `${shouldFilterBeVisible}`);
    }

    toggleExtended() {
        const shouldExtendedBeVisible = !this.state.isExtendedVisible;

        this.setState({
            ...this.state,
            isExtendedVisible: shouldExtendedBeVisible
        });
        localStorage.setItem(`${this.props.componentName}_extended_filter_toggle_state`, `${shouldExtendedBeVisible}`);
    }

    back() {
        window.history.back();
    }
}

const filterToggleDefault = (componentName: string): boolean => {
    const filterToggleState = localStorage.getItem(`${componentName}_filter_toggle_state`);

    if (filterToggleState !== null) {
        return JSON.parse(filterToggleState);
    } else {
        return true;
    }
};

const extendedFilterToggleDefault = (componentName: string): boolean => {
    const filterToggleState = localStorage.getItem(`${componentName}_extended_filter_toggle_state`);

    if (filterToggleState !== null) {
        return JSON.parse(filterToggleState);
    } else {
        return false;  // By default the extended filter criteria is hidden.
    }
};

function stateToProps({}) {
    return {

    };
}

export default withRouter(connect(stateToProps)(ListFilterComponent));