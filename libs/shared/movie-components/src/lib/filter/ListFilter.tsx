import { ReactNode } from 'react';
import { FilterItemClear } from '@giron/shared-ui-library';
import { useShowExtendedFilter } from '../useShowExtendedFilter';
import { useShowFilter } from '../useShowFilter';
import cn from 'classnames';

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

  const cnTransitionAllEaseInOut = cn(
    'transition-all duration-200 ease-in-out'
  );

  const filterClassNames = cn('text-body-small pb-5', cnTransitionAllEaseInOut);
  const filterBodyClassNames = cn(
    'flex justify-between bg-blue-100 border border-gray-300 p-4 w-auto',
    cnTransitionAllEaseInOut
  );

  const toggleContainerClassNames = cn(
    'bg-white inline-block relative border border-gray-400 rounded-full',
    'cursor-pointer transition duration-200 w-10 h-[22px]'
  );

  const toggleButtonClassNames = cn(
    'absolute inset-0 rounded-full transition-all duration-200',
    'before:flex before:relative before:bg-white before:top-[1px] before:rounded-full before:shadow-toggle',
    'before:transition-all before:duration-200 before:ease-in-out before:w-[18px] before:h-[18px] before:content-[""]',
    'peer-checked:bg-blue-900 peer-checked:before:ml-5'
  );

  const backButtonClassNames = cn(
    'bg-blue-100 text-[#007d7a] relative font-bold border border-b-0 border-gray-300 px-4 mb-[-1px] ml-auto',
    {
      hidden: !isVisible,
    }
  );

  return (
    <div className={filterClassNames} data-test-name={testName}>
      <div className="flex filter-header">
        <div className="flex relative bg-blue-200 border border-gray-300 font-bold leading-8 uppercase cursor-pointer py-0.5 px-4 mb-[-1px] min-w-[600px] filter-header-toggle-container">
          <span
            className="inline-flex items-center"
            onClick={() => toggleFilter()}
          >
            <i className="text-pink-600 text-title-large mr-1.5 fas fa-caret-right" />{' '}
            {header}{' '}
            <i className="ml-1 far fa-question-circle" title={helpText} />
          </span>

          <div className="inline-flex justify-between absolute right-4 filter-toggles">
            {isExtendedFilterEnabled && (
              <span className="inline-flex items-center">
                <label className={toggleContainerClassNames}>
                  <input
                    type="checkbox"
                    className="peer absolute opacity-0"
                    value={'' + isExtendedVisible}
                    checked={isExtendedVisible}
                    onChange={() => toggleExtended()}
                  />
                  <div className={toggleButtonClassNames}></div>
                </label>
                <span className="pl-2.5" onClick={() => toggleExtended()}>
                  Utökad
                </span>
              </span>
            )}

            <span
              className="inline-flex items-center min-w-[58px] ml-12"
              onClick={() => toggleFilter()}
            >
              <span>{toggleText}</span>
              <i
                className={cn('text-headline-small ml-1.5 fas', {
                  'fa-angle-up': isVisible,
                  'fa-angle-down': !isVisible,
                })}
              />
            </span>
          </div>
        </div>

        <button className={backButtonClassNames} onClick={() => back()}>
          <i className="text-pink-600 mr-1.5 fas fa-caret-left" />
          Tillbaka
        </button>
      </div>

      {isVisible && (
        <div className={filterBodyClassNames}>
          <div className="inline-flex gap-4">
            {regularContent}
            {isExtendedVisible && extendedContent}
          </div>

          <div className="border-l border-gray-300 ml-4 pl-1.5">
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
