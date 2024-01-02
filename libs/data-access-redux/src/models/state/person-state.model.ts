import { PersonRoleModel } from '../PersonRoleModel';
import { NameEntityModel } from '@giron/shared-models';
import { LoadingState } from './loading.model';

export interface PersonStateModel {
  actors?: Array<PersonRoleModel>;
  actorsLoading: LoadingState;

  crew?: Array<PersonRoleModel>;
  crewLoading: LoadingState;

  /** @deprecated */
  crewNotLoaded: boolean;

  persons?: Array<NameEntityModel>;
  personsLoading: LoadingState;

  /** @deprecated */
  personsNotLoaded: boolean;
}
