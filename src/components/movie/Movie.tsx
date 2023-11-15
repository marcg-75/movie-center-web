import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './movie.details.scss';

import { Loader } from '../common/loader/Loader';
import GeneralInfoPanel from './panels/GeneralInfoPanel';
import CastPanel from './panels/CastPanel';
import CrewPanel from './panels/CrewPanel';
import FormatPanel from './panels/FormatPanel';
import CoverPanel from './panels/CoverPanel';
import PersonalInfoPanel from './panels/PersonalInfoPanel';
import {
    clearMovieActionState,
    createMovie,
    getEmptyMovie,
    getMovieById,
    updateMovie,
    updateMovieState
} from '../../actions/movie.actions';
import { loadFormats, loadLanguages, loadRoles, loadStudios } from '../../actions/base-data.actions';
import { getActors, getAllPersons, getCrew } from '../../actions/person.actions';
import MovieModel from '../../models/MovieModel';
import { environment } from "../../env/environment";
import { MovieStateModel } from '../../actions/models/movie-state.model';
import { PersonStateModel } from '../../actions/models/person-state.model';
import { BaseDataStateModel } from '../../actions/models/base-data-state.model';

const INFO_PANEL_GENERAL = 'general';
const INFO_PANEL_CAST = 'cast';
const INFO_PANEL_CREW = 'crew';
const INFO_PANEL_FORMAT = 'format';
const INFO_PANEL_COVER = 'cover';
const INFO_PANEL_PERSONAL = 'personal';

interface MovieProps {
    movie: MovieStateModel;
    person: PersonStateModel;
    baseData: BaseDataStateModel;
    history: any;
    location: any;
    dispatch: (any: any) => void;
    testName?: string;
}

const Movie = ({
                   movie,
                   person,
                   baseData,
                   history,
                   location,
                   dispatch,
                   testName = 'Movie_test'
               }: MovieProps) => {

    const [movieId, setMovieId] = useState<number>();
    const [activeInfoPanel, setActiveInfoPanel] = useState(INFO_PANEL_GENERAL);
    const [isMovieLoading, setIsMovieLoading] = useState(false);
    const [isBaseDataLoading, setIsBaseDataLoading] = useState(false);

    useEffect(() => {
        const {pathname} = location;
        const movieId = parseInt(pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length), 10);

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

        setMovieId(movieId);

        if (movieId === 0) {
            dispatch(getEmptyMovie());
        } else {
            dispatch(getMovieById(movieId));
        }
    }, []);

    useEffect(() => {
        setIsMovieLoading(!movie || movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting);
        setIsBaseDataLoading(!baseData || !(baseData.genresLoaded && baseData.formatsLoaded && baseData.studiosLoaded && baseData.rolesLoaded));

        const {movieCreated, movieUpdated} = movie;

        if (movieCreated || movieUpdated) {
            // Clear action state
            dispatch(clearMovieActionState());

            // Navigate back to list.
            history.push(`/movies`);
        }
    }, [movie, baseData]);

    const {movieItem, movieErrorMessages} = movie;
    const {actorsErrorMessages} = person;
    const {genres, studios, formats} = baseData;  // TODO: Expose errors in an "error panel".

    const saveMovie = () => {
        alert('Saving movie: ' + JSON.stringify(movieItem));

        if (!movieItem.id || movieItem.id === 0) {
            delete movieItem.id;
            dispatch(createMovie(movieItem));
        } else {
            dispatch(updateMovie(movieItem));
        }
    };

    const cancel = () => {
        if (!window.confirm('Vill du avbryta redigeringen av denna film?')) {
            return;
        }

        history.goBack();
    };

    const isCreateMode = (): boolean => {
        return movieId === 0;
    };

    const movieStateChanged = (event: any) => {
        const {name, value} = event.target;

        dispatch(updateMovieState({
            ...movieItem,
            [name]: value
        } as MovieModel));
    };

    let content;

    if (movieErrorMessages || actorsErrorMessages) {
        //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
        //alert(movieErrorMessages);
        const errors = movieErrorMessages.concat(actorsErrorMessages);

        content = (<div>
            <ul>{errors.map((m: string, i: number) => <li key={i}>{m}</li>)}</ul>
        </div>);
    } else if (isMovieLoading || !movieItem || isBaseDataLoading) {
        // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
        content = (<div><Loader/></div>);
    } else {
        const titleElem = isCreateMode()
            ? (<div className="labelled-input">
                    <label htmlFor="title">Filmtitel: *</label>
                    <input className="text-input-field" type="text" placeholder="Ange filmtitel"
                           id="title" name="title" defaultValue={movieItem.title} required={true}
                           onBlur={movieStateChanged}/></div>
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
                            <button
                                className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_GENERAL ? 'active' : '')}
                                onClick={(e) => setActiveInfoPanel(INFO_PANEL_GENERAL)}>Generell information
                            </button>
                            <button
                                className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_CAST ? 'active' : '')}
                                onClick={(e) => setActiveInfoPanel(INFO_PANEL_CAST)}>Rollbesättning
                            </button>
                            <button
                                className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_CREW ? 'active' : '')}
                                onClick={(e) => setActiveInfoPanel(INFO_PANEL_CREW)}>Filmteam
                            </button>
                            <button
                                className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_FORMAT ? 'active' : '')}
                                onClick={(e) => setActiveInfoPanel(INFO_PANEL_FORMAT)}>Media & Format
                            </button>
                            <button
                                className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_COVER ? 'active' : '')}
                                onClick={(e) => setActiveInfoPanel(INFO_PANEL_COVER)}>Omslagsbilder
                            </button>
                            <button
                                className={'movie-menu-link-box ' + (activeInfoPanel === INFO_PANEL_PERSONAL ? 'active' : '')}
                                onClick={(e) => setActiveInfoPanel(INFO_PANEL_PERSONAL)}>Personlig information
                            </button>
                        </div>
                    </div>

                    <div className={'movie-details-panel ' + activeInfoPanel}>
                        <div className="general-info">
                            <GeneralInfoPanel/>
                        </div>

                        <div className="cast-info">
                            <CastPanel/>
                        </div>

                        <div className="crew-info">
                            <CrewPanel/>
                        </div>

                        <div className="format-info">
                            <FormatPanel/>
                        </div>

                        <div className="cover-info">
                            <CoverPanel/>
                        </div>

                        <div className="personal-info">
                            <PersonalInfoPanel/>
                        </div>
                    </div>
                </div>

                <div className="movie-action-panel" hidden={!environment.enableMovieInfoEdit}>
                    <button className="btn secondary" onClick={saveMovie.bind(this)}>Spara</button>

                    <button className="btn secondary" onClick={cancel.bind(this)}>Avbryt</button>
                </div>
            </div>
        );
    }

//<HeaderComponent />
    return (
        <div>

            <div className="main-page-container" data-test-name={testName}>
                {content}
            </div>
        </div>
    );
}

function stateToProps({movie, person, baseData}) {
    return {
        movie,
        person,
        baseData
    };
}

export default withRouter(connect(stateToProps)(Movie));
