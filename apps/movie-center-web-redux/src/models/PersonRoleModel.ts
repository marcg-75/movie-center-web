import NameEntityModel from './NameEntityModel';
import SelectableModel from './SelectableModel';

export default interface PersonRoleModel {
  id: number;
  person: NameEntityModel;
  role: SelectableModel;
}
