import { NameEntityModel } from './NameEntityModel';
import { SelectableModel } from './SelectableModel';

export interface PersonRoleModel {
  id: number;
  person: NameEntityModel;
  role: SelectableModel;
}
