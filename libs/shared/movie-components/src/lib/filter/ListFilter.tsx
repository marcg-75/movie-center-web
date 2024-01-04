import { ReactNode } from 'react';

import './filter.component.scss';
import { FilterItemClear } from '@giron/shared-ui-library';
import { useShowExtendedFilter } from '../useShowExtendedFilter';
import { useShowFilter } from '../useShowFilter';

type Props = {
  header: string;
  helpText: string;
  isExtendedFilterEnabled?: boolean;
  clearFilter: () => void;
  enableSaveFilter: boolean;
  compactModeActions: boolean;
  regularContent: ReactNode;
  extendedContent: ReactNode;
  testName?: string;
};

export const ListFilter = ({
  header,
  helpText,
  isExtendedFilterEnabled = true,
  clearFilter,
  enableSaveFilter,
  compactModeActions,
  regularContent,
  extendedContent,
  testName = 'ListFilter_test',
}: Props) => {
  const [isVisible, setIsVisible] = useShowFilter();
  const [isExtendedVisible, setIsExtendedVisible] = useShowExtendedFilter();

  const toggleText = isVisible ? 'Dölj' : 'Visa';

  const toggleFilter = () => {
    setIsVisible(!isVisible);
  };

  const toggleExtended = () => {
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
            <i className="fas fa-caret-right filter-header-title-icon" />{' '}
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
            {isExtendedVisible && extendedContent}
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
