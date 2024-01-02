import { NameEntityModel, SelectableModel } from '@giron/shared-models';

export interface PersonRoleModel {
  id: number;
  person: NameEntityModel;
  role: SelectableModel;
}
