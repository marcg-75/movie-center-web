import React from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

import './movie.details.scss';

import { Loader } from '../common/loader/Loader';
import FormComponent from '../common/FormComponent';
import GeneralInfoPanel from './panels/GeneralInfoPanel';
import CastPanel from './panels/CastPanel';
import CrewPanel from './panels/CrewPanel';
import FormatPanel from './panels/FormatPanel';
import CoverPanel from './panels/CoverPanel';
import PersonalInfoPanel from './panels/PersonalInfoPanel';
import {
    getMovieById,
    getEmptyMovie,
    updateMovieState,
    createMovie,
    updateMovie,
    deleteMovie,
    clearMovieActionState
} from '../../actions/movie.actions';
import {loadStudios, loadRoles, loadFormats, loadLanguages} from '../../actions/base-data.actions';
import {getActors, getCrew, getAllPersons} from '../../actions/person.actions';
import MovieModel from '../../models/MovieModel';
import {environment} from "../../env/environment";
import {IMovieProps} from "./IMovieProps";
import {IMovieState} from "./IMovieState";

const INFO_PANEL_GENERAL = 'general';
const INFO_PANEL_CAST = 'cast';
const INFO_PANEL_CREW = 'crew';
const INFO_PANEL_FORMAT = 'format';
const INFO_PANEL_COVER = 'cover';
const INFO_PANEL_PERSONAL = 'personal';

class Movie extends FormComponent<IMovieProps, IMovieState> {

    static defaultProps = {
        testName: 'Movie_test'
    };

    constructor(props) {
        super(props);

        this.isCreateMode = this.isCreateMode.bind(this);
        this.movieStateChanged = this.movieStateChanged.bind(this);
    }

    componentDidMount() {
        const {location, dispatch} = this.props;
        const {pathname} = location;
        const movieId = parseInt(pathname.substring(pathname.lastIndexOf('/')+1, pathname.length), 10);

        // Clear action state
        dispatch(clearMovieActionState());

        dispatch(loadStudios());
        dispatch(loadRoles());
        dispatch(getActors());
        dispatch(getCrew());
        dispatch(loadFormats());
        dispatch(loadLanguages());

        if (environment.enableMovieInfoEdit) {
            dispatch(getAllPersons());
        }

        this.setState({
            movieId,
            activeInfoPanel: INFO_PANEL_GENERAL
        } as IMovieState);

        if (movieId === 0) {
            this.props.dispatch(getEmptyMovie());
        } else {
            this.props.dispatch(getMovieById(movieId));
        }
    }

    componentDidUpdate() {
        const {movieCreated, movieUpdated} = this.props.movie;

        if (movieCreated || movieUpdated) {
            // Clear action state
            this.props.dispatch(clearMovieActionState());

            // Navigate back to list.
            this.props.history.push(`/movies`);
        }
    }

    render() {
        const {movieItem, movieErrorMessages} = this.props.movie;
        const {actorsErrorMessages} = this.props.person;
        const {genres, studios, formats} = this.props.baseData;  // TODO: Expose errors in an "error panel".
        const {activeInfoPanel} = this.state as IMovieState;

        let content;

        if (movieErrorMessages || actorsErrorMessages) {
            //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieErrorMessages);
            const errors = movieErrorMessages.concat(actorsErrorMessages);

            content = (<div><ul>{errors.map((m: string, i: number) => <li key={i}>{m}</li>)}</ul></div>);
        } else if (this.isMovieLoading || !movieItem || this.isBaseDataLoading) {
            // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
            content = (<div><Loader /></div>);
        } else {
            const titleElem = this.isCreateMode()
                ? (<div className="labelled-input">
                <label htmlFor="title">Filmtitel: *</label>
                <input className="text-input-field" type="text" placeholder="Ange filmtitel"
                       id="title" name="title" defaultValue={movieItem.title} required={true}
                       onBlur={this.movieStateChanged} /></div>
            ) : (
                <h2>{movieItem.title}</h2>
            );

            content = (
                <div className="panel-container">
                    <div className="movie-title-panel">
                        {titleElem}
                    </div>

                    <div className="movie-details-panel-container">

                        <div className="movie-menu-panel">
                            <div className="movie-menu-links">
                                <button className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_GENERAL ? 'active' : '')}
                                        onClick={(e) => this.setActiveInfoPanel(INFO_PANEL_GENERAL, e)}>Generell information</button>
                                <button className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_CAST ? 'active' : '')}
                                        onClick={(e) => this.setActiveInfoPanel(INFO_PANEL_CAST, e)}>Rollbesättning</button>
                                <button className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_CREW ? 'active' : '')}
                                        onClick={(e) => this.setActiveInfoPanel(INFO_PANEL_CREW, e)}>Filmteam</button>
                                <button className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_FORMAT ? 'active' : '')}
                                        onClick={(e) => this.setActiveInfoPanel(INFO_PANEL_FORMAT, e)}>Media & Format</button>
                                <button className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_COVER ? 'active' : '')}
                                        onClick={(e) => this.setActiveInfoPanel(INFO_PANEL_COVER, e)}>Omslagsbilder</button>
                                <button className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_PERSONAL ? 'active' : '')}
                                        onClick={(e) => this.setActiveInfoPanel(INFO_PANEL_PERSONAL, e)}>Personlig information</button>
                            </div>
                        </div>

                        <div className={'movie-details-panel ' + activeInfoPanel}>
                            <div className="general-info">
                                <GeneralInfoPanel />
                            </div>

                            <div className="cast-info">
                                <CastPanel />
                            </div>

                            <div className="crew-info">
                                <CrewPanel />
                            </div>

                            <div className="format-info">
                                <FormatPanel />
                            </div>

                            <div className="cover-info">
                                <CoverPanel />
                            </div>

                            <div className="personal-info">
                                <PersonalInfoPanel />
                            </div>
                        </div>
                    </div>

                    <div className="movie-action-panel" hidden={!environment.enableMovieInfoEdit}>
                        <button className="btn secondary" onClick={this.saveMovie.bind(this)}>Spara</button>

                        <button className="btn secondary" onClick={this.cancel.bind(this)}>Avbryt</button>
                    </div>
                </div>
            );
        }

//<HeaderComponent />
        return (
            <div>

                <div className="main-page-container" data-test-name={this.props.testName}>
                    {content}
                </div>
            </div>
        );
    }

    setActiveInfoPanel(activeInfoPanel: string, e: any) {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            ...this.state,
            activeInfoPanel
        } as IMovieState);
    }

    saveMovie() {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;

        alert('Saving movie: ' + JSON.stringify(movieItem));

        if (!movieItem.id || movieItem.id === 0) {
            delete movieItem.id;
            dispatch(createMovie(movieItem));
        } else {
            dispatch(updateMovie(movieItem));
        }
    }

    cancel() {
        if (!window.confirm('Vill du avbryta redigeringen av denna film?')) {
            return;
        }

        this.props.history.goBack();
    }

    isCreateMode(): boolean {
        const {movieId} = this.state as IMovieState;
        return movieId === 0;
    }

    get isBaseDataLoading(): boolean {
        const {baseData} = this.props;

        return !baseData || !(baseData.genresLoaded && baseData.formatsLoaded && baseData.studiosLoaded && baseData.rolesLoaded);
    }

    get isMovieLoading(): boolean {
        const {movie} = this.props;

        return movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting;
    }

    movieStateChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {name, value} = event.target;

        dispatch(updateMovieState({
            ...movieItem,
            [name]: value
        } as MovieModel));
    }
}

function stateToProps({movie, person, baseData}) {
    return {
        movie,
        person,
        baseData
    };
}

export default withRouter(connect(stateToProps)(Movie));
