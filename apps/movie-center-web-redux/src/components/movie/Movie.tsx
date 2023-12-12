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
  updateMovieState,
} from '../../actions/movie.actions';
import { loadRoles, loadStudios } from '../../actions/base-data.actions';
import { getAllPersons } from '../../actions/person.actions';
import { IMovie } from '../../models/movie.model';
import { environment } from '../../env/environment';
import { MovieStateModel } from '../../actions/models/movie-state.model';
import { BaseDataStateModel } from '../../actions/models/base-data-state.model';
import { checkIfBaseDataIsLoading } from './utils';

const INFO_PANEL_GENERAL = 'general';
const INFO_PANEL_CAST = 'cast';
const INFO_PANEL_CREW = 'crew';
const INFO_PANEL_FORMAT = 'format';
const INFO_PANEL_COVER = 'cover';
const INFO_PANEL_PERSONAL = 'personal';

interface MovieProps {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  history: any;
  location: any;
  dispatch: (any: any) => void;
  testName?: string;
}

const Movie = ({
  movie,
  baseData,
  history,
  location,
  dispatch,
  testName = 'Movie_test',
}: MovieProps) => {
  const [movieId, setMovieId] = useState<number>();
  const [activeInfoPanel, setActiveInfoPanel] = useState(INFO_PANEL_GENERAL);
  const [isMovieLoading] = useState(movie?.movieLoading?.loading);
  const [isBaseDataLoading] = useState(checkIfBaseDataIsLoading(baseData));

  useEffect(() => {
    const { pathname } = location;
    const movieId = parseInt(
      pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length),
      10
    );

    // Clear action state
    dispatch(clearMovieActionState());

    dispatch(loadStudios());
    dispatch(loadRoles());

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
    const { movieCreated, movieUpdated } = movie;

    if (movieCreated || movieUpdated) {
      // Clear action state
      dispatch(clearMovieActionState());

      // Navigate back to list.
      history.push(`/movies`);
    }
  }, [movie, baseData]);

  const { movieItem, movieLoading } = movie;

  const saveMovie = () => {
    if (!movieItem) {
      return;
    }

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
    const { name, value } = event.target;

    dispatch(
      updateMovieState({
        ...movieItem,
        [name]: value,
      } as IMovie)
    );
  };

  let content;

  if (movieLoading?.errors) {
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);
    const errors = movieLoading.errors as string[];

    content = (
      <div>
        <ul>
          {errors.map((m: string, i: number) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    );
  } else if (isMovieLoading || !movieItem || isBaseDataLoading) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    const titleElem = isCreateMode() ? (
      <div className="labelled-input">
        <label htmlFor="title">Filmtitel: *</label>
        <input
          className="text-input-field"
          type="text"
          placeholder="Ange filmtitel"
          id="title"
          name="title"
          defaultValue={movieItem.title}
          required={true}
          onBlur={movieStateChanged}
        />
      </div>
    ) : (
      <h2>{movieItem.title}</h2>
    );

    content = (
      <div className="panel-container">
        <div className="movie-title-panel">{titleElem}</div>

        <div className="movie-details-panel-container">
          <div className="movie-menu-panel">
            <div className="movie-menu-links">
              <button
                className={
                  'movie-menu-link-box ' +
                  (activeInfoPanel === INFO_PANEL_GENERAL ? 'active' : '')
                }
                onClick={() => setActiveInfoPanel(INFO_PANEL_GENERAL)}
              >
                Generell information
              </button>
              <button
                className={
                  'movie-menu-link-box ' +
                  (activeInfoPanel === INFO_PANEL_CAST ? 'active' : '')
                }
                onClick={() => setActiveInfoPanel(INFO_PANEL_CAST)}
              >
                Rollbesättning
              </button>
              <button
                className={
                  'movie-menu-link-box ' +
                  (activeInfoPanel === INFO_PANEL_CREW ? 'active' : '')
                }
                onClick={() => setActiveInfoPanel(INFO_PANEL_CREW)}
              >
                Filmteam
              </button>
              <button
                className={
                  'movie-menu-link-box ' +
                  (activeInfoPanel === INFO_PANEL_FORMAT ? 'active' : '')
                }
                onClick={() => setActiveInfoPanel(INFO_PANEL_FORMAT)}
              >
                Media & Format
              </button>
              <button
                className={
                  'movie-menu-link-box ' +
                  (activeInfoPanel === INFO_PANEL_COVER ? 'active' : '')
                }
                onClick={() => setActiveInfoPanel(INFO_PANEL_COVER)}
              >
                Omslagsbilder
              </button>
              <button
                className={
                  'movie-menu-link-box ' +
                  (activeInfoPanel === INFO_PANEL_PERSONAL ? 'active' : '')
                }
                onClick={() => setActiveInfoPanel(INFO_PANEL_PERSONAL)}
              >
                Personlig information
              </button>
            </div>
          </div>

          <div className={'movie-details-panel ' + activeInfoPanel}>
            {activeInfoPanel === INFO_PANEL_GENERAL && (
              <div className="general-info">
                <GeneralInfoPanel />
              </div>
            )}

            {activeInfoPanel === INFO_PANEL_CAST && (
              <div className="cast-info">
                <CastPanel />
              </div>
            )}

            {activeInfoPanel === INFO_PANEL_CREW && (
              <div className="crew-info">
                <CrewPanel />
              </div>
            )}

            {activeInfoPanel === INFO_PANEL_FORMAT && (
              <div className="format-info">
                <FormatPanel />
              </div>
            )}

            {activeInfoPanel === INFO_PANEL_COVER && (
              <div className="cover-info">
                <CoverPanel />
              </div>
            )}

            {activeInfoPanel === INFO_PANEL_PERSONAL && (
              <div className="personal-info">
                <PersonalInfoPanel />
              </div>
            )}
          </div>
        </div>

        <div
          className="movie-action-panel"
          hidden={!environment.enableMovieInfoEdit}
        >
          <button className="btn secondary" onClick={saveMovie.bind(this)}>
            Spara
          </button>

          <button className="btn secondary" onClick={cancel.bind(this)}>
            Avbryt
          </button>
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
};

// @ts-ignore
function stateToProps({ movie, baseData }) {
  return {
    movie,
    baseData,
  };
}

export default withRouter(connect(stateToProps)(Movie));
