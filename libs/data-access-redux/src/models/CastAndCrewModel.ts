import {PersonRoleModel} from './PersonRoleModel';

export interface CastAndCrewModel {
  id: number;
  movieTitle: string;
  personRole: PersonRoleModel;
  characterName: string;
  deleted: boolean;
}
