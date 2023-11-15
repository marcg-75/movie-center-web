import PersonRoleModel from '../../models/PersonRoleModel';
import NameEntityModel from '../../models/NameEntityModel';

export interface PersonStateModel {
    actors: Array<PersonRoleModel>;
    actorsNotLoaded: boolean;
    actorsErrorMessages: Array<string>;
    crew: Array<PersonRoleModel>;
    crewNotLoaded: boolean;
    crewErrorMessages: Array<string>;
    persons: Array<NameEntityModel>;
    personsNotLoaded: boolean;
    personsErrorMessages: Array<string>;
}