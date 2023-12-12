import SelectableModel from '../../models/SelectableModel';
import NameEntityModel from '../../models/NameEntityModel';
import LanguageModel from '../../models/LanguageModel';
import { LoadingState } from './loading.model';

export interface BaseDataStateModel {
  genresLoading: LoadingState;
  rolesLoading: LoadingState;
  formatsLoading: LoadingState;
  studiosLoading: LoadingState;
  languagesLoading: LoadingState;

  /** @deprecated */
  genresLoaded: boolean;

  /** @deprecated */
  rolesLoaded: boolean;

  /** @deprecated */
  formatsLoaded: boolean;

  /** @deprecated */
  studiosLoaded: boolean;

  /** @deprecated */
  languagesLoaded: boolean;

  genres?: Array<SelectableModel>;
  roles?: Array<SelectableModel>;
  formats?: Array<SelectableModel>;
  studios?: Array<NameEntityModel>;
  languages?: Array<LanguageModel>;

  /** @deprecated */
  formatsErrorMessage?: string;

  /** @deprecated */
  languagesErrorMessage?: string;
}