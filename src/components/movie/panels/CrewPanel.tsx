import React, { ReactNode, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';

import { environment } from "../../../env/environment";
import { updateMovieState } from '../../../actions/movie.actions';
import { getCrew } from '../../../actions/person.actions';
import MovieModel from '../../../models/MovieModel';
import CastAndCrewModel from "../../../models/CastAndCrewModel";
import PersonRoleModel from "../../../models/PersonRoleModel";
import SelectableModel from "../../../models/SelectableModel";
import NameEntityModel from "../../../models/NameEntityModel";
import { RoleEnum } from "../../../models/RoleEnum";
import { PersonStateModel } from '../../../actions/models/person-state.model';
import { MovieStateModel } from '../../../actions/models/movie-state.model';
import { BaseDataStateModel } from '../../../actions/models/base-data-state.model';

interface CrewPanelProps {
    movie: MovieStateModel;
    person: PersonStateModel;
    baseData: BaseDataStateModel;
    dispatch: (any: any) => void;
    testName?: string;
}

const CrewPanel = ({movie, person, baseData, dispatch, testName = 'CrewPanel_test'}: CrewPanelProps) => {

    const [isMovieLoading, setIsMovieLoading] = useState(false);
    const [selectableCrewMembersForRole, setSelectableCrewMembersForRole] = useState<PersonRoleModel[]>([]);
    const [selectablePersonsForRole, setSelectablePersonsForRole] = useState<NameEntityModel[]>([])
    const [selectedPersonId, setSelectedPersonId] = useState<string>();
    const [selectedPersonName, setSelectedPersonName] = useState<string>();

    useEffect(() => {
        setIsMovieLoading(!movie || movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting);
    }, [movie]);

    const {movieItem} = movie;
    const {
        persons,
        crew,
        crewNotLoaded,
        crewErrorMessages,
        personsNotLoaded,
        personsErrorMessages
    } = person;
    const {roles} = baseData;

    const clearSelectedPerson = () => {
        setSelectablePersonsForRole([]);
        setSelectedPersonId(null);
        setSelectedPersonName(null);
    };

    const addCrewMember = (event: any) => {
        event.preventDefault();

        const roleCode: string = event.target['addCrewRole'].value;
        const crewPersonRoleId = event.target['crewPersonRoleId'].value;

        if (!(roleCode && crewPersonRoleId)) {
            alert('Både roll och person måste väljas.');
            return;
        }

        const allCurrentPersonRolesForRole: Array<PersonRoleModel> = extractPersonRolesFromCrew(crew, RoleEnum[roleCode]);
        const currentCrewMembers = existingMovieCrewMembersForRole(movieItem, RoleEnum[roleCode]);
        const selectedCrewMember: PersonRoleModel = allCurrentPersonRolesForRole.find((a: PersonRoleModel) => a.id === parseInt(crewPersonRoleId, 10));

        const newCrewMember: CastAndCrewModel = {
            movieTitle: movieItem.title,
            personRole: selectedCrewMember
        } as CastAndCrewModel;

        currentCrewMembers.push(newCrewMember);

        const crewTypeName: string = getCrewTypeName(RoleEnum[roleCode]);

        dispatch(updateMovieState({
            ...movieItem,
            [crewTypeName]: currentCrewMembers
        } as MovieModel));

        event.target['addCrewRole'].value = '';
        event.target['crewPersonRoleId'].value = '';
    };

    const addNewCrewMember = (event: any) => {
        event.preventDefault();

        const roleCode: string = event.target['newCrewRole'].value;
        const personId = event.target['newCrewPersonId'].value;
        const personName = event.target['newCrewName'].value;

        if (!roleCode && (!personId || !personName)) {
            alert('Roll, befintlig person eller ny persons namn måste anges.');
            return;
        }

        // If a new name is given (not an existing person is selected), check if the name already exists.
        if (!personId
            && persons.findIndex((p: NameEntityModel) => p.name === personName) > -1
            && !window.confirm('En person med detta namn finns redan. Vill du skapa en ny person som har samma namn? Avbryt annars och välj befintlig person i listan intill.')) {
            event.target['newCrewName'].value = '';
            return;
        }

        updateMovieCrewState(personId, personName, RoleEnum[roleCode]);

        event.target['newCrewRole'].value = '';
        event.target['newCrewPersonId'].value = '';
        event.target['newCrewName'].value = '';

        clearSelectedPerson();

        dispatch(getCrew());
    };

    // Adds new crew member (existing or completely new PERSON)
    const updateMovieCrewState = (personId: string, personName: string, pRole: RoleEnum) => {
        if (!personId && !personName) {
            return;
        }

        const crewMembers = existingMovieCrewMembersForRole(movieItem, pRole);

        const person: NameEntityModel = {
            id: personId ? parseInt(personId, 10) : undefined,
            name: personName
        } as NameEntityModel;

        const role: SelectableModel = {
            code: RoleEnum[pRole]
        } as SelectableModel;

        const personRole: PersonRoleModel = {
            person,
            role
        } as PersonRoleModel;

        const newCrewMember: CastAndCrewModel = {
            movieTitle: movieItem.title,
            personRole
        } as CastAndCrewModel;

        crewMembers.push(newCrewMember);

        const crewTypeName: string = getCrewTypeName(pRole);

        if (crewTypeName) {
            dispatch(updateMovieState({
                ...movieItem,
                [crewTypeName]: crewMembers
            } as MovieModel));
        }
    };

    const removeCrewMember = (cacId: number, personName: string, role: RoleEnum) => {
        const rRole = roles.find((r: SelectableModel) => r.code === RoleEnum[role]);

        if (!window.confirm(`Vill du ta bort denna ${rRole.name} från filmen?`)) {
            return;
        }

        const crewMembers = existingMovieCrewMembersForRole(movieItem, role);

        crewMembers.forEach((a: CastAndCrewModel) => {
            if (((a.id && a.id === cacId) || !a.id) && a.personRole.person.name === personName) {
                a.deleted = true;
            }
        });

        const crewTypeName: string = getCrewTypeName(role);

        dispatch(updateMovieState({
            ...movieItem,
            [crewTypeName]: crewMembers
        } as MovieModel));

        clearSelectedPerson();
    };

    const mapToElements = (crew: CastAndCrewModel[], role: RoleEnum) =>
        crew.map((cac: CastAndCrewModel, i: number) => (
            <div key={i} id={'' + cac.id} hidden={cac.deleted}>
                <span className="text-value">{cac.personRole.person ? cac.personRole.person.name : 'Namn saknas'}</span>

                {environment.enableMovieInfoEdit && (
                    <button className="btn secondary"
                            onClick={() => removeCrewMember(cac.id, cac.personRole.person.name, role)}>Ta bort från
                        film</button>
                )}
            </div>
        ));

    const getSelectableCrewMembersByRole = (event: any) => {
        const selectedRoleCode: string = event.target.value;
        let selectableCrewMembersForRole: Array<any> = [];

        if (selectedRoleCode && selectedRoleCode.length) {
            const currentCrewMembersForRole: CastAndCrewModel[] =
                existingMovieCrewMembersForRole(movieItem, RoleEnum[selectedRoleCode]);

            // Filtrera bort alla personer som redan är tillagda för aktuell roll.
            const allSelectablePersonRolesForRole: Array<PersonRoleModel> =
                extractPersonRolesFromCrew(crew, RoleEnum[selectedRoleCode]).filter((personRole: PersonRoleModel) => {
                    return currentCrewMembersForRole
                        .findIndex((cac: CastAndCrewModel) => cac.personRole.id === personRole.id) === -1;
                });

            // selectableCrewMembersForRole = mapToOptionElements(allSelectablePersonRolesForRole);
            selectableCrewMembersForRole = allSelectablePersonRolesForRole;
        }

        setSelectableCrewMembersForRole(selectableCrewMembersForRole);
    };

    const getSelectablePersonsByRole = (event: any) => {
        const selectedRoleCode: string = event.target.value;
        let selectablePersonsForRole: Array<any> = [];

        if (persons && persons.length > 0 && selectedRoleCode && selectedRoleCode.length) {
            const currentCrewMembersForRole: CastAndCrewModel[] =
                existingMovieCrewMembersForRole(movieItem, RoleEnum[selectedRoleCode]);

            if (currentCrewMembersForRole?.length) {
                // Filtrera bort alla personer som redan är tillagda för aktuell roll.
                const allSelectablePersonsForRole: Array<NameEntityModel> =
                    persons.filter((person: NameEntityModel) => {
                        return currentCrewMembersForRole
                            .findIndex((cac: CastAndCrewModel) => cac.personRole.person.id === person.id) === -1;
                    });

                // selectablePersonsForRole = mapToPersonOptionElements(allSelectablePersonsForRole);
                selectablePersonsForRole = allSelectablePersonsForRole;
            }
        }

        setSelectablePersonsForRole(selectablePersonsForRole);
    };

    const updateNewCrewName = (event: any) => {
        setSelectedPersonId(event.target.value);
        setSelectedPersonName(event.target.selectedOptions[0].label);
    };

    let content: ReactNode;

    if (crewErrorMessages || personsErrorMessages) {
        //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
        //alert(movieErrorMessages);

        content = (<div>
            <ul>{crewErrorMessages.map((m: string, i: number) => <li key={i}>{m}</li>)}</ul>
        </div>);
    } else if (isMovieLoading || !movieItem || crewNotLoaded || personsNotLoaded) {
        // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
        content = (<div><Loader/></div>);
    } else {
        const currentDirectorsInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.DIRECTOR);
        const currentProducersInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.PRODUCER);
        const currentComposersInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.MUSIC);
        const currentWritersInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.WRITER);
        const currentCastersInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.CASTING);
        const currentEditorsInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.EDITOR);
        const currentCinematographyInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.CINEMATOGRAPHY);
        const currentSoundInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.SOUND);
        const currentArtInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.ART);
        const currentOtherInMovie: CastAndCrewModel[] = existingMovieCrewMembersForRole(movieItem, RoleEnum.MISC);

        const directorElements: ReactNode[] = mapToElements(currentDirectorsInMovie, RoleEnum.DIRECTOR);
        const producerElements: ReactNode[] = mapToElements(currentProducersInMovie, RoleEnum.PRODUCER);
        const composerElements: ReactNode[] = mapToElements(currentComposersInMovie, RoleEnum.MUSIC);
        const writerElements: ReactNode[] = mapToElements(currentWritersInMovie, RoleEnum.WRITER);
        const casterElements: ReactNode[] = mapToElements(currentCastersInMovie, RoleEnum.CASTING);
        const editorElements: ReactNode[] = mapToElements(currentEditorsInMovie, RoleEnum.EDITOR);
        const cinematographyElements: ReactNode[] = mapToElements(currentCinematographyInMovie, RoleEnum.CINEMATOGRAPHY);
        const soundElements: ReactNode[] = mapToElements(currentSoundInMovie, RoleEnum.SOUND);
        const artElements: ReactNode[] = mapToElements(currentArtInMovie, RoleEnum.ART);
        const otherElements: ReactNode[] = mapToElements(currentOtherInMovie, RoleEnum.MISC);

        const allCrewRoleOptions: ReactNode[] = createAllCrewRoleOptions(roles);
        const crewMembersForRoleOptions: ReactNode[] = createSelectableCrewMembersForRole(selectableCrewMembersForRole);
        const personsForRoleOptions: ReactNode[] = createSelectablePersonsForRole(selectablePersonsForRole);

        content = (
            <div>
                <h4>Regissör(er)</h4>
                {directorElements}

                <h4>Producent(er)</h4>
                {producerElements}

                <h4>Musik</h4>
                {composerElements}

                <h4>Manusförfattare</h4>
                {writerElements}

                {(casterElements && casterElements.length > 0) && (
                    <div>
                        <h4>Rollbesättare</h4>
                        {casterElements}
                    </div>
                )}

                <h4>Redigerare</h4>
                {editorElements}

                <h4>Cinematografi</h4>
                {cinematographyElements}

                <h4>Ljud</h4>
                {soundElements}

                <h4>Konst</h4>
                {artElements}

                <h4>Övriga</h4>
                {otherElements}

                {environment.enableMovieInfoEdit && (
                    <form onSubmit={(e) => addCrewMember(e)} id="addCrewForm">
                        <label>Lägg till medlem:</label>

                        <select id="addCrewRole" name="addCrewRole" onChange={(e) => getSelectableCrewMembersByRole(e)}>
                            {allCrewRoleOptions}
                        </select>

                        <select id="crewPersonRoleId" name="crewPersonRoleId"
                                disabled={!selectableCrewMembersForRole || !selectableCrewMembersForRole.length}>
                            {crewMembersForRoleOptions}
                        </select>

                        <input type="submit" value="Lägg till"/>
                    </form>
                )}

                {environment.enableMovieInfoEdit && (
                    <form onSubmit={(e) => addNewCrewMember(e)} id="addNewCrewMemberForm">
                        <label>Lägg till ny medlem:</label>

                        <select id="newCrewRole" name="newCrewRole" onChange={(e) => getSelectablePersonsByRole(e)}>
                            {allCrewRoleOptions}
                        </select>

                        {personsNotLoaded ? (<Loader/>) : (
                            <select id="newCrewPersonId" name="crewPersonId" onChange={(e) => updateNewCrewName(e)}
                                    disabled={!selectablePersonsForRole || !selectablePersonsForRole.length}>
                                {personsForRoleOptions}
                            </select>
                        )}

                        <input className="text-input-field" type="text" id="newCrewName" name="name"
                               defaultValue={selectedPersonName}
                               placeholder="Namn"
                               disabled={selectedPersonId !== undefined && selectedPersonId.length > 0}/>

                        <input type="submit" value="Lägg till"/>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div data-test-name={testName}>{content}</div>
    )
}

const createAllCrewRoleOptions = (roles: Array<SelectableModel>): Array<ReactNode> => {
    if (!roles) {
        return [];
    }

    const crewRoles: Array<SelectableModel> = roles.filter((role: SelectableModel) => role.code !== RoleEnum[RoleEnum.ACTOR]);

    const options: Array<any> = crewRoles.map((option: SelectableModel, i: number) => {
        return <option key={i + 1} value={option.code}>{option.name}</option>;
    });
    options.unshift(<option key="0" value=""/>);

    return options;
};

const createSelectableCrewMembersForRole = (personRoles: PersonRoleModel[]): ReactNode[] => {
    if (!personRoles) {
        return [];
    }

    const options: Array<any> = personRoles.map((option: PersonRoleModel, i: number) => {
        return <option key={i + 1} value={option.person.id}>{option.person.name}</option>;
    });
    options.unshift(<option key="0" value=""/>);

    return options;
};

const createSelectablePersonsForRole = (persons: NameEntityModel[]): ReactNode[] => {
    if (!persons) {
        return [];
    }

    const options: Array<any> = persons.map((option: NameEntityModel, i: number) => {
        return <option key={i + 1} value={option.id}>{option.name}</option>;
    });
    options.unshift(<option key="0" value=""/>);

    return options;
};

const extractPersonRolesFromCrew = (crew: Array<PersonRoleModel>, role: RoleEnum): Array<PersonRoleModel> => {
    if (!crew || !crew.length || !role) {
        return [];
    }

    // Extract
    const personRoles: Array<PersonRoleModel> =
        crew.filter((item: PersonRoleModel) => item.role.code === RoleEnum[role]);

    // Sort
    return personRoles.sort((a: PersonRoleModel, b: PersonRoleModel) => {
        var nameA = a.person.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.person.name.toUpperCase(); // ignore upper and lowercase

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });
};

const existingMovieCrewMembersForRole = (movieItem: MovieModel, role: RoleEnum): CastAndCrewModel[] => {
    switch (role) {
        case RoleEnum.DIRECTOR:
            return movieItem.directors ? movieItem.directors : [];
        case RoleEnum.PRODUCER:
            return movieItem.producers ? movieItem.producers : [];
        case RoleEnum.MUSIC:
            return movieItem.music ? movieItem.music : [];
        case RoleEnum.WRITER:
            return movieItem.writers ? movieItem.writers : [];
        case RoleEnum.CASTING:
            return movieItem.casters ? movieItem.casters : [];
        case RoleEnum.EDITOR:
            return movieItem.editors ? movieItem.editors : [];
        case RoleEnum.CINEMATOGRAPHY:
            return movieItem.cinematography ? movieItem.cinematography : [];
        case RoleEnum.SOUND:
            return movieItem.sound ? movieItem.sound : [];
        case RoleEnum.ART:
            return movieItem.art ? movieItem.art : [];
        case RoleEnum.MISC:
            return movieItem.otherRoles ? movieItem.otherRoles : [];
        default:
            return [];
    }
};

const mapToOptionElements = (personRoles: Array<PersonRoleModel>): Array<any> => {
    if (!personRoles) {
        return [];
    }

    const options: Array<any> = personRoles.map((option: PersonRoleModel, i: number) => {
        return <option key={i + 1} value={option.id}>{option.person.name}</option>;
    });
    options.unshift(<option key="0" value=""/>);

    return options;
};

export const mapToPersonOptionElements = (persons: Array<NameEntityModel>): Array<any> => {
    if (!persons) {
        return [];
    }

    const options: Array<any> = persons.map((option: NameEntityModel, i: number) => {
        return <option key={i + 1} value={option.id}>{option.name}</option>;
    });
    options.unshift(<option key="0" value=""/>);

    return options;
};

const getCrewTypeName = (role: RoleEnum): string => {
    switch (role) {
        case RoleEnum.DIRECTOR:
            return 'directors';
        case RoleEnum.PRODUCER:
            return 'producers';
        case RoleEnum.MUSIC:
            return 'music';
        case RoleEnum.WRITER:
            return 'writers';
        case RoleEnum.CASTING:
            return 'casters';
        case RoleEnum.EDITOR:
            return 'editors';
        case RoleEnum.CINEMATOGRAPHY:
            return 'cinematography';
        case RoleEnum.SOUND:
            return 'sound';
        case RoleEnum.ART:
            return 'art';
        case RoleEnum.MISC:
            return 'otherRoles';
        default:
            return '';
    }
};

function stateToProps({movie, person, baseData}) {
    return {
        movie,
        person,
        baseData
    };
}

export default connect(stateToProps)(CrewPanel);
