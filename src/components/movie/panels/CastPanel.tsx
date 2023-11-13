import React from 'react';
import {connect} from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';

import {environment} from "../../../env/environment";
import FormComponent from '../../common/FormComponent';
import { updateMovieState } from '../../../actions/movie.actions';
import {getActors} from '../../../actions/person.actions';
import MovieModel from '../../../models/MovieModel';
import CastAndCrewModel from "../../../models/CastAndCrewModel";
import PersonRoleModel from "../../../models/PersonRoleModel";
import {IMovieProps} from "../IMovieProps";
import SelectableModel from "../../../models/SelectableModel";
import NameEntityModel from "../../../models/NameEntityModel";
import {IAbstractFormState} from "../../common/FormComponent";
import {mapToPersonOptionElements} from "./CrewPanel";

interface ICastState extends IAbstractFormState {
    selectablePersons: Array<NameEntityModel>,
    selectedPersonId: string,
    selectedPersonName: string
}

class CastPanel extends FormComponent<IMovieProps, ICastState> {  // TODO: Byta FormComponent mot Component?

    static defaultProps = {
        testName: 'CastPanel_test'
    };

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {
        const {movieItem} = this.props.movie;
        const {actors, actorsNotLoaded, actorsErrorMessages,
            personsNotLoaded, personsErrorMessages} = this.props.person;
        const {selectedPersonId, selectedPersonName} = this.state as ICastState;

        const selectablePersons = this.getSelectablePersonOptions();

        let content;

        if (actorsErrorMessages || personsErrorMessages) {
            //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieErrorMessages);

            content = (<div><ul>{actorsErrorMessages.map((m: string, i: number) => <li key={i}>{m}</li>)}</ul></div>);
        } else if (this.isMovieLoading || !movieItem || actorsNotLoaded) {
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
                            onClick={() => this.removeActor(actor.id, actor.personRole.person.name)}>Ta bort från film</button>
                        )}
                </div>
            ));

            const currentActorOptions = allCurrentActors.map((option:PersonRoleModel, i:number) => {
                return <option key={i+1} value={option.id}>{option.person.name}</option>;
            });
            currentActorOptions.unshift(<option key="0" value=""></option>);

            content = (
                <div>
                    {castElements}

                    {environment.enableMovieInfoEdit && (
                    <form onSubmit={(e) => this.addActor(e)} id="addActorForm">
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
                    <form onSubmit={(e) => this.addNewActor(e)} id="addNewActorForm">
                        <label>Lägg till ny skådespelare:</label>

                        {personsNotLoaded ? (<Loader />) : (
                        <select id="newActorPersonId" name="newActorPersonId" onChange={(e) => this.updateNewActorName(e)}
                                disabled={!selectablePersons || !selectablePersons.length}>
                            {selectablePersons}
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
            <div data-test-name={this.props.testName}>{content}</div>
        )
    }

    get isMovieLoading(): boolean {
        const {movie} = this.props;

        return movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting;
    }

    addActor(event: any) {
        event.preventDefault();

        const actorPersonRoleId = event.target['actorPersonRoleId'].value;
        const characterName = event.target['characterName'].value;

        if (!(actorPersonRoleId && characterName)) {
            alert('Både skådespelare och rollfigurens namn måste anges.');
            return;
        }

        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const allCurrentActors: Array<PersonRoleModel> = this.props.person.actors ? this.props.person.actors : [];
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
    }

    addNewActor(event: any) {
        event.preventDefault();

        const personId = event.target['newActorPersonId'].value;
        const personName = event.target['newActorName'].value;
        const characterName = event.target['newActorCharacterName'].value;

        if ((!personId && !personName) || !characterName) {
            alert('Både skådespelarens och rollfigurens namn måste anges.');
            return;
        }

        const {persons} = this.props.person;

        // If a new name is given (not an existing person is selected), check if the name already exists.
        if (!personId
            && persons.findIndex((p: NameEntityModel) => p.name === personName) > -1
            && !window.confirm('En person med detta namn finns redan. Vill du skapa en ny person som har samma namn? Avbryt annars och välj befintlig person i listan intill.')) {
            event.target['newActorName'].value = '';
            return;
        }

        this.updateMovieActorState(personId, personName, characterName);

        event.target['newActorPersonId'].value = '';
        event.target['newActorName'].value = '';
        event.target['newActorCharacterName'].value = '';

        const state = this.state;
        this.setState({
            ...state,
            selectablePersons: [],
            selectedPersonId: undefined,
            selectedPersonName: undefined
        } as ICastState);

        this.props.dispatch(getActors());
    }

    // Adds new actor (existing or completely new PERSON)
    private updateMovieActorState(personId: string, personName: string, characterName: string) {
        if ((!personId && !personName) || !characterName) {
            return;
        }

        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
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
    }

    removeActor(actorId: number, personName: string) {
        if (!window.confirm('Vill du ta bort denna skådespelare från filmen?')) {
            return;
        }

        const {movieItem} = this.props.movie;
        let actorsForMovie = movieItem.actors ? movieItem.actors : [];

        //actorsForMovie = actorsForMovie.filter((a: CastAndCrewModel) => a.id !== actorId);

        actorsForMovie.forEach((a: CastAndCrewModel) => {
            if ((a.id && a.id === actorId) || !a.id && a.personRole.person.name === personName) {
                a.deleted = true;
            }
        });

        this.props.dispatch(updateMovieState({
            ...movieItem,
            actors: actorsForMovie
        } as MovieModel));

        const state = this.state;
        this.setState({
            ...state,
            selectablePersons: [],
            selectedPersonId: undefined,
            selectedPersonName: undefined
        } as ICastState);
    }

    getSelectablePersonOptions(): Array<any> {
        const {movieItem} = this.props.movie;
        const {persons} = this.props.person;
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

        //const state = this.state;
        //this.setState({
        //    ...state,
        //    selectablePersons
        //} as ICastState);
    }

    updateNewActorName(event: any) {
        const selectedPersonId: string = event.target.value;
        const selectedPersonName: string = event.target.selectedOptions[0].label;

        const state = this.state;
        this.setState({
            ...state,
            selectedPersonId,
            selectedPersonName
        } as ICastState);
    }
}

function stateToProps({movie, person}) {
    return {
        movie,
        person
    };
}

export default connect(stateToProps)(CastPanel);
