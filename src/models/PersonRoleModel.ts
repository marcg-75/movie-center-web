import NameEntityModel from "./NameEntityModel";
import SelectableModel from "./SelectableModel";

export default class PersonRoleModel {
    public id: number;
    public person: NameEntityModel;
    public role: SelectableModel;
}
