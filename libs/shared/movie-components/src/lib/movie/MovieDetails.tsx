import './movie.details.scss';
import { ChangeEvent, ReactNode, useState } from 'react';
import { Loader } from '@giron/shared-ui-library';
import { IMovie } from '@giron/shared-models';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

const INFO_PANEL_GENERAL = 'general';
const INFO_PANEL_CAST = 'cast';
const INFO_PANEL_CREW = 'crew';
const INFO_PANEL_FORMAT = 'format';
const INFO_PANEL_COVER = 'cover';
const INFO_PANEL_PERSONAL = 'personal';

type Props = {
  movie?: IMovie;
  isLoading?: boolean;
  isCreateMode?: boolean;
  onCreateMovie: (movie: IMovie) => void;
  onUpdateMovie: (movie: IMovie) => void;
  onMovieTitleChange: (movie: IMovie) => void;
  onCancel: () => void;
  generalInfoPanel: ReactNode;
  castPanel: ReactNode;
  crewPanel: ReactNode;
  formatPanel: ReactNode;
  coverPanel: ReactNode;
  personalInfoPanel: ReactNode;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  testName?: string;
};

export const MovieDetails = ({
  movie,
  isLoading = false,
  isCreateMode = false,
  onCreateMovie,
  onUpdateMovie,
  onMovieTitleChange,
  onCancel,
  generalInfoPanel,
  castPanel,
  crewPanel,
  formatPanel,
  coverPanel,
  personalInfoPanel,
  error,
  errors,
  testName = 'MovieDetails_test',
}: Props) => {
  const [activeInfoPanel, setActiveInfoPanel] = useState(INFO_PANEL_GENERAL);

  const saveMovie = () => {
    if (!movie) {
      return;
    }

    alert('Saving movie: ' + JSON.stringify(movie));

    if (!movie.id || movie.id === 0) {
      delete movie.id;
      onCreateMovie(movie);
    } else {
      onUpdateMovie(movie);
    }
  };

  const cancel = () => {
    if (!window.confirm('Vill du avbryta redigeringen av denna film?')) {
      return;
    }

    onCancel();
  };

  const movieStateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    onMovieTitleChange({
      ...movie,
      [name]: value,
    } as IMovie);
  };

  let content;

  if (error) {
    content = (
      <div>
        <ul>
          <li>
            {typeof error === 'string' ? error : (error as Error).message}
          </li>
        </ul>
      </div>
    );
  } else if (errors) {
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);
    const errs = errors as string[];

    content = (
      <div>
        <ul>
          {errs.map((m: string, i: number) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    );
  } else if (isLoading || !movie) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    const titleElem = isCreateMode ? (
      <div className="labelled-input">
        <label htmlFor="title">Filmtitel: *</label>
        <input
          className="text-input-field"
          type="text"
          placeholder="Ange filmtitel"
          id="title"
          name="title"
          defaultValue={movie.title}
          required={true}
          onBlur={movieStateChanged}
        />
      </div>
    ) : (
      <h2>{movie.title}</h2>
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
              <div className="general-info">{generalInfoPanel}</div>
            )}

            {activeInfoPanel === INFO_PANEL_CAST && (
              <div className="cast-info">{castPanel}</div>
            )}

            {activeInfoPanel === INFO_PANEL_CREW && (
              <div className="crew-info">{crewPanel}</div>
            )}

            {activeInfoPanel === INFO_PANEL_FORMAT && (
              <div className="format-info">{formatPanel}</div>
            )}

            {activeInfoPanel === INFO_PANEL_COVER && (
              <div className="cover-info">{coverPanel}</div>
            )}

            {activeInfoPanel === INFO_PANEL_PERSONAL && (
              <div className="personal-info">{personalInfoPanel}</div>
            )}
          </div>
        </div>

        <div className="movie-action-panel" hidden={!enableMovieInfoEdit}>
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
