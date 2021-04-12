import PersonRoleModel from "./PersonRoleModel";

export default class CastAndCrewModel {
    public id: number;
    public movieTitle: string;
    public personRole: PersonRoleModel;
    public characterName: string;
    public deleted: boolean;
}
