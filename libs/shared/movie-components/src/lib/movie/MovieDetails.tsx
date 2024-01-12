import './movie.details.scss';
import { ChangeEvent, MouseEvent, ReactNode, useState } from 'react';
import { LabeledInput, Loader } from '@giron/shared-ui-library';
import { IMovie } from '@giron/shared-models';
import { Control, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

const PANEL_GENERAL = 'general';
const PANEL_CAST = 'cast';
const PANEL_CREW = 'crew';
const PANEL_FORMAT = 'format';
const PANEL_COVER = 'cover';
const PANEL_PERSONAL = 'personal';

type Props = {
  movie?: IMovie;
  isLoading?: boolean;
  isCreateMode?: boolean;
  onReset: () => void;
  onCancel: () => void;
  control: Control<IMovie>;
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
  onReset,
  onCancel,
  control,
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
  const [activePanel, setActivePanel] = useState(PANEL_GENERAL);
  const [title, setTitle] = useState(movie?.title || '');

  const onResetMovie = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !window.confirm('Vill du ta bort alla gjorda ändringar av denna film?')
    ) {
      return;
    }

    onReset();
  };

  const onCancelEdit = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onCancel();
  };

  const movieStateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // onMovieTitleChange({
    //   ...movie,
    //   [name]: value,
    // } as IMovie);
  };

  const onChangePanel = (e: MouseEvent, activePanel: string) => {
    e.preventDefault();
    e.stopPropagation();

    setActivePanel(activePanel);
  };

  if (error || errors) {
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    return (
      <MoviePageLayout testName={testName}>
        {!!error && (
          <div>
            {typeof error === 'string' ? error : (error as Error).message}
          </div>
        )}

        {errors && (
          <ul>
            {(errors as string[]).map((m: string, i: number) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </MoviePageLayout>
    );
  } else if (isLoading || (!movie && !isCreateMode)) {
    return (
      <MoviePageLayout testName={testName}>
        <Loader />
      </MoviePageLayout>
    );
  } else {
    const titleElem = isCreateMode ? (
      <LabeledInput htmlFor="title" label="Filmtitel: *">
        <Controller
          control={control}
          name="title"
          render={({
            field: { onChange, ...field },
            fieldState: { error },
          }) => (
            <>
              <TextField
                {...field}
                type="text"
                className="mat-input-required"
                value={title || ''}
                onChange={(e) => {
                  onChange(e);
                  setTitle(e.target.value);
                }}
              />

              <div style={{ marginLeft: '0.5rem' }}>
                {error?.message && (
                  <small className="text-red-500" style={{ color: 'red' }}>
                    {error.message}
                  </small>
                )}
              </div>
            </>
          )}
          rules={{ required: 'Filmtiteln är tom' }}
        />
      </LabeledInput>
    ) : (
      <h2>{movie?.title}</h2>
    );

    const menuItems = (
      <>
        <button
          className={
            'movie-menu-link-box ' +
            (activePanel === PANEL_GENERAL ? 'active' : '')
          }
          onClick={(e) => onChangePanel(e, PANEL_GENERAL)}
        >
          Generell information
        </button>
        <button
          className={
            'movie-menu-link-box ' +
            (activePanel === PANEL_CAST ? 'active' : '')
          }
          onClick={(e) => onChangePanel(e, PANEL_CAST)}
        >
          Rollbesättning
        </button>
        <button
          className={
            'movie-menu-link-box ' +
            (activePanel === PANEL_CREW ? 'active' : '')
          }
          onClick={(e) => onChangePanel(e, PANEL_CREW)}
        >
          Filmteam
        </button>
        <button
          className={
            'movie-menu-link-box ' +
            (activePanel === PANEL_FORMAT ? 'active' : '')
          }
          onClick={(e) => onChangePanel(e, PANEL_FORMAT)}
        >
          Media & Format
        </button>
        <button
          className={
            'movie-menu-link-box ' +
            (activePanel === PANEL_COVER ? 'active' : '')
          }
          onClick={(e) => onChangePanel(e, PANEL_COVER)}
        >
          Omslagsbilder
        </button>
        <button
          className={
            'movie-menu-link-box ' +
            (activePanel === PANEL_PERSONAL ? 'active' : '')
          }
          onClick={(e) => onChangePanel(e, PANEL_PERSONAL)}
        >
          Personlig information
        </button>
      </>
    );

    const actionItems = (
      <>
        <input type="submit" className="btn secondary" value="Spara" />

        {/*react-hook-form reset doesn't work on all fields at the moment.*/}
        {/*<button className="btn secondary" onClick={(e: MouseEvent) => onResetMovie(e)}>*/}
        {/*  Ångra*/}
        {/*</button>*/}

        <button
          className="btn secondary"
          onClick={(e: MouseEvent) => onCancelEdit(e)}
        >
          Avbryt
        </button>
      </>
    );
    return (
      <MoviePageLayout testName={testName}>
        <MovieDetailsLayout
          titleElement={titleElem}
          menuItems={menuItems}
          actionItems={actionItems}
        >
          <div className={'movie-details-panel ' + activePanel}>
            {activePanel === PANEL_GENERAL && (
              <div className="general-info">{generalInfoPanel}</div>
            )}

            {activePanel === PANEL_CAST && (
              <div className="cast-info">{castPanel}</div>
            )}

            {activePanel === PANEL_CREW && (
              <div className="crew-info">{crewPanel}</div>
            )}

            {activePanel === PANEL_FORMAT && (
              <div className="format-info">{formatPanel}</div>
            )}

            {activePanel === PANEL_COVER && (
              <div className="cover-info">{coverPanel}</div>
            )}

            {activePanel === PANEL_PERSONAL && (
              <div className="personal-info">{personalInfoPanel}</div>
            )}
          </div>
        </MovieDetailsLayout>
      </MoviePageLayout>
    );
  }
};

type MoviePageLayoutProps = {
  children: ReactNode;
  testName?: string;
};

const MoviePageLayout = ({ children, testName }: MoviePageLayoutProps) => {
  return (
    //<HeaderComponent />
    <div className="main-page-container" data-test-name={testName}>
      {children}
    </div>
  );
};

type MovieDetailsLayoutProps = {
  titleElement: ReactNode;
  menuItems: ReactNode;
  actionItems: ReactNode;
  children: ReactNode;
};

const MovieDetailsLayout = ({
  titleElement,
  menuItems,
  actionItems,
  children,
}: MovieDetailsLayoutProps) => {
  return (
    <div className="panel-container">
      <div className="movie-title-panel">{titleElement}</div>

      <div className="movie-details-panel-container">
        <div className="movie-menu-panel">
          <div className="movie-menu-links">{menuItems}</div>
        </div>

        {children}
      </div>

      <div className="movie-action-panel" hidden={!enableMovieInfoEdit}>
        {actionItems}
      </div>
    </div>
  );
};
