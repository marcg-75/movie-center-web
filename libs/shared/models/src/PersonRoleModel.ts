import { NameEntityModel, SelectableModel } from './index';

export interface PersonRoleModel {
  id: number;
  person: NameEntityModel;
  role: SelectableModel;
}
