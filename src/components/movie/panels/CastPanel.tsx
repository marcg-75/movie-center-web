import { ReactNode, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';

import { environment } from "../../../env/environment";
import { updateMovieState } from '../../../actions/movie.actions';
import { getActors } from '../../../actions/person.actions';
import MovieModel from '../../../models/MovieModel';
import CastAndCrewModel from "../../../models/CastAndCrewModel";
import PersonRoleModel from "../../../models/PersonRoleModel";
import SelectableModel from "../../../models/SelectableModel";
import NameEntityModel from "../../../models/NameEntityModel";
import { mapToPersonOptionElements } from "./CrewPanel";
import { MovieStateModel } from '../../../actions/models/movie-state.model';
import { PersonStateModel } from '../../../actions/models/person-state.model';

interface CastPanelProps {
    movie: MovieStateModel;
    person: PersonStateModel;
    dispatch: (any: any) => void;
    testName?: string;
}

const CastPanel = ({movie, person, dispatch, testName = 'CastPanel_test'}: CastPanelProps) => {

    const {movieItem} = movie;
    const {
        persons,
        actors,
        actorsNotLoaded,
        actorsErrorMessages,
        personsNotLoaded,
        personsErrorMessages
    } = person;

    const [isMovieLoading, setIsMovieLoading] = useState(false);
    const [selectablePersons, setSelectablePersons] = useState<NameEntityModel[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<string>();
    const [selectedPersonName, setSelectedPersonName] = useState<string>();

    useEffect(() => {
        setIsMovieLoading(!movie || movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting);
        setSelectablePersons(getSelectablePersonOptions());
    }, [movie, person]);

    const clearSelectedPerson = () => {
        setSelectablePersons([]);
        setSelectedPersonId(null);
        setSelectedPersonName(null);
    };

    const addActor = (event: any) => {
        event.preventDefault();

        const actorPersonRoleId = event.target['actorPersonRoleId'].value;
        const characterName = event.target['characterName'].value;

        if (!(actorPersonRoleId && characterName)) {
            alert('Både skådespelare och rollfigurens namn måste anges.');
            return;
        }

        const allCurrentActors: Array<PersonRoleModel> = person.actors ? person.actors : [];
        const actorsForMovie = movieItem.actors ? movieItem.actors : [];
        const selectedActor: PersonRoleModel = allCurrentActors.find((a: PersonRoleModel) => a.id === parseInt(actorPersonRoleId, 10));

        const newActor: CastAndCrewModel = {
            movieTitle: movieItem.title,
            personRole: selectedActor,
            characterName
        } as CastAndCrewModel;

        actorsForMovie.push(newActor);

        dispatch(updateMovieState({
            ...movieItem,
            actors: actorsForMovie
        } as MovieModel));

        event.target['actorPersonRoleId'].value = '';
        event.target['characterName'].value = '';
    };

    const addNewActor = (event: any)  => {
        event.preventDefault();

        const personId = event.target['newActorPersonId'].value;
        const personName = event.target['newActorName'].value;
        const characterName = event.target['newActorCharacterName'].value;

        if ((!personId && !personName) || !characterName) {
            alert('Både skådespelarens och rollfigurens namn måste anges.');
            return;
        }

        // If a new name is given (not an existing person is selected), check if the name already exists.
        if (!personId
            && persons.findIndex((p: NameEntityModel) => p.name === personName) > -1
            && !window.confirm('En person med detta namn finns redan. Vill du skapa en ny person som har samma namn? Avbryt annars och välj befintlig person i listan intill.')) {
            event.target['newActorName'].value = '';
            return;
        }

        updateMovieActorState(personId, personName, characterName);

        event.target['newActorPersonId'].value = '';
        event.target['newActorName'].value = '';
        event.target['newActorCharacterName'].value = '';

        clearSelectedPerson();

        dispatch(getActors());
    };

    // Adds new actor (existing or completely new PERSON)
    const updateMovieActorState = (personId: string, personName: string, characterName: string) => {
        if ((!personId && !personName) || !characterName) {
            return;
        }

        let actors = movieItem.actors ? movieItem.actors : [];

        const person: NameEntityModel = {
            id: personId ? parseInt(personId, 10) : undefined,
            name: personName
        } as NameEntityModel;

        const role: SelectableModel = {
            code: 'ACTOR'
        } as SelectableModel;

        const personRole: PersonRoleModel = {
            person,
            role
        } as PersonRoleModel;

        const newActor: CastAndCrewModel = {
            movieTitle: movieItem.title,
            personRole,
            characterName
        } as CastAndCrewModel;

        actors.push(newActor);

        dispatch(updateMovieState({
            ...movieItem,
            actors
        } as MovieModel));
    };

    const removeActor = (actorId: number, personName: string) => {
        if (!window.confirm('Vill du ta bort denna skådespelare från filmen?')) {
            return;
        }

        let actorsForMovie = movieItem.actors ? movieItem.actors : [];

        //actorsForMovie = actorsForMovie.filter((a: CastAndCrewModel) => a.id !== actorId);

        actorsForMovie.forEach((a: CastAndCrewModel) => {
            if ((a.id && a.id === actorId) || !a.id && a.personRole.person.name === personName) {
                a.deleted = true;
            }
        });

        dispatch(updateMovieState({
            ...movieItem,
            actors: actorsForMovie
        } as MovieModel));

        clearSelectedPerson();
    };

    const getSelectablePersonOptions = (): Array<any> => {
        let selectablePersons: Array<any> = [];

        if (persons && persons.length > 0) {
            const currentActorsInMovie: Array<CastAndCrewModel> = movieItem.actors ? movieItem.actors : [];

            // Filtrera bort alla personer som redan är tillagda för aktuell roll.
            const allSelectablePersons: Array<NameEntityModel> =
                persons.filter((person: NameEntityModel) => {
                    return currentActorsInMovie
                        .findIndex((cac: CastAndCrewModel) => cac.personRole.person.id === person.id) === -1;
                });

            selectablePersons = mapToPersonOptionElements(allSelectablePersons);
        }

        return selectablePersons;
    };

    const updateNewActorName = (event: any) => {
        setSelectedPersonId(event.target.value);
        setSelectedPersonName(event.target.selectedOptions[0].label);
    };

        let content;

        if (actorsErrorMessages || personsErrorMessages) {
            //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieErrorMessages);

            content = (<div><ul>{actorsErrorMessages.map((m: string, i: number) => <li key={i}>{m}</li>)}</ul></div>);
        } else if (isMovieLoading || !movieItem || actorsNotLoaded) {
            // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
            content = (<div><Loader /></div>);
        } else {

            const allCurrentActors:Array<PersonRoleModel> = actors ? actors : [];
            const currentActorsInMovie:Array<CastAndCrewModel> = movieItem.actors ? movieItem.actors : [];

            const castElements = currentActorsInMovie.map((actor:CastAndCrewModel, i:number) => (
                <div key={i} id={'' + actor.id} hidden={actor.deleted}>
                    <span
                        className="text-value">{actor.personRole.person ? actor.personRole.person.name : 'Namn saknas'}</span>
                    <span className="text-value">{actor.characterName}</span>

                    {environment.enableMovieInfoEdit && (
                    <button className="btn secondary"
                            onClick={() => removeActor(actor.id, actor.personRole.person.name)}>Ta bort från film</button>
                        )}
                </div>
            ));

            const currentActorOptions: ReactNode[] = allCurrentActors.map((option:PersonRoleModel, i:number) => {
                return <option key={i+1} value={option.id}>{option.person.name}</option>;
            });
            currentActorOptions.unshift(<option key="0" value=""></option>);

            const selectablePersonOptions: ReactNode[] = selectablePersons.map((option: NameEntityModel) => {
                return <option key={option.id} value={option.id}>{option.name}</option>;
            });
            selectablePersonOptions.unshift(<option key="0" value=""></option>);

            content = (
                <div>
                    {castElements}

                    {environment.enableMovieInfoEdit && (
                    <form onSubmit={(e) => addActor(e)} id="addActorForm">
                        <label>Lägg till skådespelare:</label>
                        <select id="addActor" name="actorPersonRoleId">
                            {currentActorOptions}
                        </select>
                        <input className="text-input-field" type="text" id="actorCharacterName" name="characterName"
                               placeholder="Rollnamn"/>
                        <input type="submit" value="Lägg till"/>
                    </form>
                        )}

                    {environment.enableMovieInfoEdit && (
                    <form onSubmit={(e) => addNewActor(e)} id="addNewActorForm">
                        <label>Lägg till ny skådespelare:</label>

                        {personsNotLoaded ? (<Loader />) : (
                        <select id="newActorPersonId" name="newActorPersonId" onChange={(e) => updateNewActorName(e)}
                                disabled={!selectablePersons || !selectablePersons.length}>
                            {selectablePersonOptions}
                        </select>
                            )}

                        <input className="text-input-field" type="text" id="newActorName" name="name" defaultValue={selectedPersonName}
                               placeholder="Name" disabled={selectedPersonId !== undefined && selectedPersonId.length > 0} />

                        <input className="text-input-field" type="text" id="newActorCharacterName" name="characterName"
                               placeholder="Rollnamn"/>

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

function stateToProps({movie, person}) {
    return {
        movie,
        person
    };
}

export default connect(stateToProps)(CastPanel);
