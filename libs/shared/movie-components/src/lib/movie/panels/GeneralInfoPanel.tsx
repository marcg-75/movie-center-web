import '../movie.details.scss';
import { ChangeEvent, ReactNode } from 'react';
import {
  LabeledDateInput,
  LabeledSelect,
  LabeledTextarea,
  LabeledTextInput,
  LabeledTimeInput,
  Loader,
} from '@giron/shared-ui-library';
import {
  IMovie,
  MovieGenreModel,
  NameEntityModel,
  SelectableModel,
} from '@giron/shared-models';

type Props = {
  movie?: IMovie;
  genres?: SelectableModel[];
  studios?: NameEntityModel[];
  isLoading?: boolean;
  onMovieChange: (movie: IMovie) => void;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  testName?: string;
};

const enableMovieInfoEdit: boolean =
  process.env.NEXT_PUBLIC_ENABLE_MOVIE_INFO_EDIT === 'true' ||
  process.env.NX_ENABLE_MOVIE_INFO_EDIT === 'true';

export const GeneralInfoPanel = ({
  movie,
  genres,
  studios,
  isLoading = false,
  onMovieChange,
  error,
  errors,
  testName = 'GeneralInfoPanel_test',
}: Props) => {
  const movieStateChanged = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    const cValue: string | SelectableModel | undefined = value;

    onMovieChange({
      ...movie,
      [name]: cValue,
    } as IMovie);
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
          movieTitle: movie?.title || '',
          genre,
          mainGenre: false, // TODO: Change this when main genre selection feature is being implemented.
        };

        chosenGenres.push(movieGenre);
      }
    }

    onMovieChange({
      ...movie,
      genres: chosenGenres,
    } as IMovie);
  };

  const studioAdded = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const newStudio: NameEntityModel = { name: value } as NameEntityModel;

    const chosenStudios: Array<NameEntityModel> = movie?.studios || [];
    chosenStudios.push(newStudio);

    onMovieChange({
      ...movie,
      studios: chosenStudios,
    } as IMovie);
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

    onMovieChange({
      ...movie,
      studios: chosenStudios,
    } as IMovie);
  };

  let content: ReactNode;

  if (error || errors) {
    // TODO: Fyll på
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = <div>Ett fel inträffade</div>;
  } else if (isLoading || !movie) {
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

    const mainGenre: MovieGenreModel | undefined = movie.genres?.find(
      (mg) => mg.mainGenre
    );
    const currentAdditionalGenres: MovieGenreModel[] = movie.genres?.filter(
      (mg) => !mg.mainGenre
    );

    const currentAdditionalGenreCodes: string[] =
      currentAdditionalGenres?.length > 0
        ? currentAdditionalGenres.map((mg) => mg.genre.code)
        : [];

    const currentStudioIds: Array<string> = movie.studios
      ? movie.studios.map((studio: NameEntityModel) => '' + studio.id)
      : [];

    content = (
      <div className="panel-content">
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
          defaultValue={movie.runtime}
          callback={movieStateChanged}
        />

        <LabeledDateInput
          label="Release-datum:"
          id="releaseDate"
          defaultValue={movie.releaseDate}
          callback={movieStateChanged}
        />

        <LabeledTextInput
          label="Land:"
          id="country"
          defaultValue={movie.country}
          callback={movieStateChanged}
        />

        <LabeledTextInput
          label="Ålder:"
          id="ageRestriction"
          defaultValue={movie.ageRestriction}
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

        {enableMovieInfoEdit && (
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
          defaultValue={movie.description}
          callback={movieStateChanged}
          required={true}
        />

        <a
          href={`https://www.imdb.com/title/${movie.imdbId}/`}
          target="browser1"
        >
          IMDB info
        </a>
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};
