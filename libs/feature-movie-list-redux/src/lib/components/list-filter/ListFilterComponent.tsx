import { ReactNode, useState } from 'react';

import '../../../../../shared/ui-library/src/lib/filter/filter.component.scss';
import { FilterType } from '../../models/FilterSettingsModel';
import { FilterItemClear } from '@giron/shared-ui-library';
import { Filter, MovieFilter } from '@giron/shared-models';

interface ListFilterProps {
  componentName: string;
  header: string;
  helpText: string;
  isExtendedFilterEnabled?: boolean;
  clearFilter: () => void;
  filter: Filter<MovieFilter>;
  filterType: FilterType;
  loadFilter: (filter: MovieFilter) => void;
  enableSaveFilter: boolean;
  compactModeActions: boolean;
  regularContent: ReactNode;
  extendedContent: ReactNode;
  testName?: string;
}

const ListFilterComponent = ({
  componentName,
  header,
  helpText,
  isExtendedFilterEnabled = true,
  clearFilter,
  filter,
  filterType,
  loadFilter,
  enableSaveFilter,
  compactModeActions,
  regularContent,
  extendedContent,
  testName = 'ListFilter_test',
}: ListFilterProps) => {
  const [isVisible, setIsVisible] = useState(
    filterToggleDefault(componentName)
  );
  const [isExtendedVisible, setIsExtendedVisible] = useState(
    extendedFilterToggleDefault(componentName)
  );

  const toggleText = isVisible ? 'Dölj' : 'Visa';

  const toggleFilter = () => {
    localStorage.setItem(
      `${componentName}_filter_toggle_state`,
      `${!isVisible}`
    ); // TODO: Needed?
    setIsVisible(!isVisible);
  };

  const toggleExtended = () => {
    localStorage.setItem(
      `${componentName}_extended_filter_toggle_state`,
      `${!isExtendedVisible}`
    );
    setIsExtendedVisible(!isExtendedVisible);
  };

  const back = () => {
    window.history.back();
  };

  return (
    <div className="filter" data-test-name={testName}>
      <div className={'filter-header' + (isVisible ? ' expanded' : '')}>
        <div className="filter-header-toggle-container">
          <span onClick={() => toggleFilter()}>
            <i className="filter-header-title-icon fas fa-caret-right" />{' '}
            {header} <i className="far fa-question-circle" title={helpText} />
          </span>

          <div className="filter-toggles">
            {isExtendedFilterEnabled && (
              <span className="filter-header-toggle-extended">
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    className="real-checkbox"
                    value={'' + isExtendedVisible}
                    checked={isExtendedVisible}
                    onChange={() => toggleExtended()}
                  />
                  <div className="toggle-button"></div>
                </label>
                <span
                  className="filter-extended-label"
                  onClick={() => toggleExtended()}
                >
                  Utökad
                </span>
              </span>
            )}

            <span
              className="filter-header-toggle"
              onClick={() => toggleFilter()}
            >
              <span>{toggleText}</span>
              <i
                className={
                  'filter-header-toggle-icon fas ' +
                  (isVisible ? 'fa-angle-up' : 'fa-angle-down')
                }
              />
            </span>
          </div>
        </div>

        <button className="filter-header-back-btn" onClick={() => back()}>
          <i className="fas fa-caret-left orange" />
          Tillbaka
        </button>
      </div>

      {isVisible && (
        <div className="filter-body">
          <div className="filter-parameters-container">
            {regularContent}

            <div
              className={
                'extended-section' +
                (isExtendedVisible ? ' extended-section-visible' : '')
              }
            >
              {isExtendedVisible && extendedContent}
            </div>
          </div>

          <div className="filter-actions-container">
            <FilterItemClear
              clearFilter={clearFilter}
              compactMode={compactModeActions && enableSaveFilter}
            />

            {/*enableSaveFilter && (
                                <store-filter-settings filter={filter} filterType={filterType} compactMode={compactModeActions}></store-filter-settings>
                                <list-filter-settings filterType={filterType} loadFilter={this.props.loadFilter.bind(this)} compactMode={compactModeActions}></list-filter-settings>
                            )*/}
          </div>
        </div>
      )}
    </div>
  );
};

const filterToggleDefault = (componentName: string): boolean => {
  const filterToggleState = localStorage.getItem(
    `${componentName}_filter_toggle_state`
  );

  if (filterToggleState !== null) {
    return JSON.parse(filterToggleState);
  } else {
    return true;
  }
};

const extendedFilterToggleDefault = (componentName: string): boolean => {
  const filterToggleState = localStorage.getItem(
    `${componentName}_extended_filter_toggle_state`
  );

  if (filterToggleState !== null) {
    return JSON.parse(filterToggleState);
  } else {
    return false; // By default the extended filter criteria is hidden.
  }
};

export default ListFilterComponent;
