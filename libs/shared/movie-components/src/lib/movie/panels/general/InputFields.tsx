import { FocusEvent, useEffect, useState } from 'react';
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { toDate } from 'date-fns';
import {
  IMovie,
  MovieGenreModel,
  NameEntityModel,
  SelectableModel,
} from '@giron/shared-models';
import { LabeledInput } from '@giron/shared-ui-library';
import {
  mapMultipleSelectionToChips,
  SelectMenuProps,
} from '@giron/shared-util-helpers';

type Props = {
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  movie: IMovie;
  genres?: SelectableModel[];
  studios?: NameEntityModel[];
  onGenresChange?: (genres: SelectableModel[]) => void;
  onStudiosChange?: (genres: SelectableModel[]) => void;
};

export const InputFields = ({
  control,
  setValue,
  movie,
  genres,
  studios,
}: Props) => {
  const [country, setCountry] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStudios, setSelectedStudios] = useState<string[]>([]);
  const [newStudio, setNewStudio] = useState<string>('');
  const [imdbId, setImdbId] = useState('');

  useEffect(() => {
    const currentAdditionalGenres: MovieGenreModel[] = movie.genres?.filter(
      (mg) => !mg.mainGenre
    );

    const currentAdditionalGenreCodes: string[] =
      currentAdditionalGenres?.length > 0
        ? currentAdditionalGenres.map((mg) => mg.genre.code)
        : [];

    const currentStudioIds: string[] = movie.studios
      ? movie.studios.map((studio: NameEntityModel) => '' + studio.id)
      : [];

    setSelectedGenres(currentAdditionalGenreCodes);
    setSelectedStudios(currentStudioIds);

    setCountry(movie.country || '');
    setAgeRestriction(movie.ageRestriction || '');
    setDescription(movie.description || '');
    setImdbId(movie.imdbId || '');
  }, [movie]);

  const additionalGenresChanged = (value: string | string[]) => {
    const chosenGenres: MovieGenreModel[] = [];

    const selectedOptions =
      typeof value === 'string' ? value.split(',') : value;

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];
      const genre: SelectableModel | undefined = genres?.find(
        (g: SelectableModel) => g.code === option
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

    setSelectedGenres(selectedOptions);
    setValue('genres', chosenGenres);
  };

  const studioAdded = (event: FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const newStudio: NameEntityModel = { name: value } as NameEntityModel;

    const chosenStudios: NameEntityModel[] = movie.studios || [];
    chosenStudios.push(newStudio);

    setSelectedStudios([...selectedStudios, value]);
    setValue('studios', chosenStudios);
    setNewStudio('');
  };

  const studiosChanged = (value: string | string[]) => {
    const chosenStudios: NameEntityModel[] = [];

    const selectedOptions =
      typeof value === 'string' ? value.split(',') : value;

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];
      const studio: NameEntityModel | undefined = studios?.find(
        (s: NameEntityModel) => s.id === parseInt(option, 10)
      );

      if (studio) {
        chosenStudios.push(studio);
      }
    }

    setSelectedStudios(selectedOptions);
    setValue('studios', chosenStudios);
  };

  const studioOptions = studios?.map(
    (option) =>
      ({
        code: '' + option.id,
        name: option.name,
      } as SelectableModel)
  );

  return (
    <>
      <LabeledInput htmlFor="genres" label="Genrer:">
        <Controller
          control={control}
          name="genres"
          render={({ field: { ...field } }) => (
            <Select
              {...field}
              multiple={true}
              value={selectedGenres}
              onChange={(e) => additionalGenresChanged(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, genres)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {genres?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="runtime" label="Speltid:">
        <Controller
          control={control}
          name="runtime"
          render={({ field: { ...field } }) => (
            <TimePicker
              {...field}
              className="date-input"
              value={movie.runtime ? toDate(new Date(movie.runtime)) : null}
              format="HH:mm"
              ampm={false}
            />
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="releaseDate" label="Release-datum:">
        <Controller
          control={control}
          name="releaseDate"
          render={({ field }) => (
            <DatePicker
              {...field}
              format="yyyy-MM-dd"
              value={movie.releaseDate ? new Date(movie.releaseDate) : null}
            />
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="country" label="Land:">
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={country || ''}
              onChange={(e) => {
                onChange(e);
                setCountry(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      {/*This works with reset, but only after the page is manually reloaded. Before that we get an error in the console.*/}
      {/*<LabeledInput htmlFor="country" label="Land:">*/}
      {/*  <Controller*/}
      {/*    control={control}*/}
      {/*    name="country"*/}
      {/*    render={({ field }) => <TextField {...field} />}*/}
      {/*    defaultValue={movie.country || ''}*/}
      {/*  />*/}
      {/*</LabeledInput>*/}

      <LabeledInput htmlFor="ageRestriction" label="Ålder:">
        <Controller
          control={control}
          name="ageRestriction"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={ageRestriction || ''}
              onChange={(e) => {
                onChange(e);
                setAgeRestriction(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      {/*This works with reset, but only after the page is manually reloaded. Before that we get an error in the console.*/}
      {/*<LabeledInput htmlFor="ageRestriction" label="Ålder:">*/}
      {/*  <Controller*/}
      {/*    control={control}*/}
      {/*    name="ageRestriction"*/}
      {/*    render={({ field }) => <TextField {...field} />}*/}
      {/*    defaultValue={movie.ageRestriction || ''}*/}
      {/*  />*/}
      {/*</LabeledInput>*/}

      <LabeledInput htmlFor="studios" label="Studior:">
        <Controller
          control={control}
          name="studios"
          render={({ field: { ...field } }) => (
            <Select
              {...field}
              multiple={true}
              value={selectedStudios}
              onChange={(e) => studiosChanged(e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, studioOptions)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {studioOptions?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      <div
        style={{ opacity: '0.65' }}
        title="Fungerar, men detta flöde har UI-buggar."
      >
        <LabeledInput htmlFor="newStudio" label="Lägg till ny studio:">
          <TextField
            type="text"
            value={newStudio}
            onChange={(e) => setNewStudio(e.target.value)}
            onBlur={studioAdded}
          />
        </LabeledInput>
        {/*TODO: Add add-button*/}
      </div>

      <LabeledInput
        htmlFor="description"
        label="Beskrivning: *"
        orientation="column"
      >
        <Controller
          control={control}
          name="description"
          render={({
            field: { onChange, ...field },
            fieldState: { error },
          }) => (
            <>
              <TextareaAutosize
                {...field}
                className="mat-select-required"
                minRows={3}
                value={description || ''}
                onChange={(e) => {
                  onChange(e);
                  setDescription(e.target.value);
                }}
              />

              <div>
                {error?.message && (
                  <small className="text-red-500" style={{ color: 'red' }}>
                    {error.message}
                  </small>
                )}
              </div>
            </>
          )}
          rules={{ required: 'Filmbeskrivningen är tom' }}
        />
      </LabeledInput>

      {movie.imdbId ? (
        <a
          href={`https://www.imdb.com/title/${movie.imdbId}/`}
          target="browser1"
        >
          IMDB info
        </a>
      ) : (
        <LabeledInput htmlFor="imdbId" label="IMDB Id:">
          <Controller
            control={control}
            name="imdbId"
            render={({ field: { onChange, ...field } }) => (
              <TextField
                {...field}
                type="text"
                defaultValue={imdbId}
                onChange={(e) => {
                  onChange(e);
                  setImdbId(e.target.value);
                }}
              />
            )}
          />
        </LabeledInput>
      )}
    </>
  );
};
