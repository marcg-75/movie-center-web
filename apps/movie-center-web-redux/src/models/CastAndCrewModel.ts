import PersonRoleModel from './PersonRoleModel';

export default interface CastAndCrewModel {
  id: number;
  movieTitle: string;
  personRole: PersonRoleModel;
  characterName: string;
  deleted: boolean;
}
