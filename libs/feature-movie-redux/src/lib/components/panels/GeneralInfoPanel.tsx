import { ChangeEvent, ReactNode, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import {
  LabeledDateInput,
  LabeledSelect,
  LabeledTextarea,
  LabeledTextInput,
  LabeledTimeInput,
  Loader
} from '@giron/shared-ui-library';
import { BaseDataStateModel, MovieStateModel, updateMovieState, } from '@giron/data-access-redux';
import { checkIfBaseDataIsLoading } from '../../utils/movie.utils';
import { IMovie, MovieGenreModel, NameEntityModel, SelectableModel, } from '@giron/shared-models';

interface GeneralInfoPanelProps {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const GeneralInfoPanel = ({
  movie,
  baseData,
  dispatch,
  testName = 'GeneralInfoPanel_test',
}: GeneralInfoPanelProps) => {
  const [isMovieLoading] = useState(movie?.movieLoading?.loading);
  const [isBaseDataLoading] = useState(checkIfBaseDataIsLoading(baseData));

  const { movieItem, movieLoading } = movie;
  const { genres, studios } = baseData;

  const movieStateChanged = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    let cValue: string | SelectableModel | undefined = value;

    if (name === 'mainGenre') {
      cValue = genres?.find((g: SelectableModel) => g.code === value);
    }

    dispatch(
      updateMovieState({
        ...movieItem,
        [name]: cValue,
      } as IMovie)
    );
  };

  const additionalGenresChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const { selectedOptions } = event.target;
    const chosenGenres: Array<MovieGenreModel> = [];

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];
      const genre: SelectableModel | undefined = genres?.find(
        (g: SelectableModel) => g.code === option.value
      );

      if (genre) {
        const movieGenre: MovieGenreModel = {
          movieTitle: movieItem?.title || '',
          genre,
          mainGenre: false, // TODO: Change this when main genre selection feature is being implemented.
        };

        chosenGenres.push(movieGenre);
      }
    }

    dispatch(
      updateMovieState({
        ...movieItem,
        genres: chosenGenres,
      } as IMovie)
    );
  };

  const studioAdded = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const newStudio: NameEntityModel = { name: value } as NameEntityModel;

    const chosenStudios: Array<NameEntityModel> = movieItem?.studios || [];
    chosenStudios.push(newStudio);

    dispatch(
      updateMovieState({
        ...movieItem,
        studios: chosenStudios,
      } as IMovie)
    );
  };

  const studiosChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const { selectedOptions } = event.target;
    const chosenStudios: Array<NameEntityModel> = [];

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];
      const studio: NameEntityModel | undefined = studios?.find(
        (s: NameEntityModel) => s.id === parseInt(option.value, 10)
      );

      if (studio) {
        chosenStudios.push(studio);
      }
    }

    dispatch(
      updateMovieState({
        ...movieItem,
        studios: chosenStudios,
      } as IMovie)
    );
  };

  let content: ReactNode;

  if (movieLoading?.errors) {
    // TODO: Fyll på
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = <div></div>;
  } else if (isMovieLoading || !movieItem || isBaseDataLoading) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    const genreOptions = genres?.map((option: SelectableModel, i: number) => {
      return (
        <option key={i + 1} value={option.code}>
          {option.name}
        </option>
      );
    });
    // genreOptions?.unshift(<option key="0" value=""></option>);

    const studioOptions = studios?.map((option: NameEntityModel, i: number) => {
      return (
        <option key={i + 1} value={option.id}>
          {option.name}
        </option>
      );
    });
    // studioOptions?.unshift(<option key="0" value=""></option>);

    const mainGenre: MovieGenreModel | undefined = movieItem.genres?.find(
      (mg) => mg.mainGenre
    );
    const currentAdditionalGenres: MovieGenreModel[] = movieItem.genres?.filter(
      (mg) => !mg.mainGenre
    );

    const currentAdditionalGenreCodes: string[] =
      currentAdditionalGenres?.length > 0
        ? currentAdditionalGenres.map((mg) => mg.genre.code)
        : [];

    const currentStudioIds: Array<string> = movieItem.studios
      ? movieItem.studios.map((studio: NameEntityModel) => '' + studio.id)
      : [];

    content = (
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.625rem'}}>
        {mainGenre && (
          <LabeledSelect
            label="Huvudgenre: *"
            id="mainGenre"
            defaultValue={undefined}
            value={mainGenre.genre.code}
            options={genreOptions}
            callback={movieStateChanged}
            required={true}
            multiple={false}
          />
        )}

        <LabeledSelect
          label="Genrer:"
          id="additionalGenres"
          defaultValue={currentAdditionalGenreCodes}
          options={genreOptions}
          callback={additionalGenresChanged}
          required={false}
          multiple={true}
        />

        <LabeledTimeInput
          label="Speltid:"
          id="runtime"
          defaultValue={movieItem.runtime}
          callback={movieStateChanged}
        />

        <LabeledDateInput
          label="Release-datum:"
          id="releaseDate"
          defaultValue={movieItem.releaseDate}
          callback={movieStateChanged}
        />

        <LabeledTextInput
          label="Land:"
          id="country"
          defaultValue={movieItem.country}
          callback={movieStateChanged}
        />

        <LabeledTextInput
          label="Ålder:"
          id="ageRestriction"
          defaultValue={movieItem.ageRestriction}
          callback={movieStateChanged}
        />

        <LabeledSelect
          label="Studior:"
          id="studios"
          defaultValue={undefined}
          value={currentStudioIds}
          options={studioOptions}
          callback={studiosChanged}
          required={false}
          multiple={true}
        />

        {process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true' && (
          <LabeledTextInput
            label="Lägg till ny studio:"
            id="newStudio"
            defaultValue={undefined}
            callback={studioAdded}
          />
        )}

        <LabeledTextarea
          label="Beskrivning: *"
          id="description"
          defaultValue={movieItem.description}
          callback={movieStateChanged}
          required={true}
        />

        <a
          href={`https://www.imdb.com/title/${movieItem.imdbId}/`}
          target="browser1"
        >
          IMDB info
        </a>
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};

function stateToProps({
  movie,
  baseData,
}: {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
}) {
  return {
    movie,
    baseData,
  };
}

export default connect(stateToProps)(GeneralInfoPanel);
