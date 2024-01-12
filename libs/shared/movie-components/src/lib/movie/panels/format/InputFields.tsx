import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { IMovie, LanguageModel, MovieFormatInfo, SelectableModel, } from '@giron/shared-models';
import { LabeledInput } from '@giron/shared-ui-library';
import { Box, MenuItem, Select, SelectChangeEvent, TextField, } from '@mui/material';
import { useEffect, useState } from 'react';
import { mapMultipleSelectionToChips, SelectMenuProps, } from '@giron/shared-util-helpers';

const REGIONS = ['', '1', '2', '3', '4', '5', '6'];
const regionOptions: SelectableModel[] = REGIONS.map((r) => ({
  code: r,
  name: r,
}));

const SYSTEMS: string[] = ['', 'PAL', 'NTSC', '1080p'];
const systemOptions: SelectableModel[] = SYSTEMS.map((s) => ({
  code: s,
  name: s,
}));

type Props = {
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  movieFormatInfo: MovieFormatInfo;
  formats?: SelectableModel[];
  languages?: LanguageModel[];
};

export const InputFields = ({
                              control,
                              setValue,
                              movieFormatInfo,
                              formats,
                              languages,
                            }: Props) => {
  const [selectedFormat, setSelectedFormat] = useState(movieFormatInfo.format?.code || '');
  const [upcId, setUpcId] = useState(movieFormatInfo.upcId || '');
  const [region, setRegion] = useState<string>(
    movieFormatInfo.region ? `${movieFormatInfo.region}` : ''
  );
  const [discs, setDiscs] = useState(
    movieFormatInfo.discs ? `${movieFormatInfo.discs}` : ''
  );
  const [pictureFormat, setPictureFormat] = useState(
    movieFormatInfo.pictureFormat || ''
  );
  const [system, setSystem] = useState(movieFormatInfo.system || '');
  const [selectedAudio, setSelectedAudio] = useState<string[]>([]);
  const [selectedSubtitles, setSelectedSubtitles] = useState<string[]>([]);

  useEffect(() => {
    const currentAudioLanguageIds: string[] =
      movieFormatInfo?.audioLanguages?.map(
        (lang: LanguageModel) => '' + lang.id
      ) || [];

    const currentSubtitleIds: string[] =
      movieFormatInfo?.subtitles?.map((lang: LanguageModel) => '' + lang.id) ||
      [];

    setSelectedAudio(currentAudioLanguageIds);
    setSelectedSubtitles(currentSubtitleIds);
  }, [movieFormatInfo]);

  const languageOptions: SelectableModel[] | undefined = languages?.map(
    (l) => ({
      code: l.id + '',
      name: l.nameSwedish,
    })
  );

  const formatChanged = (event: SelectChangeEvent) => {
    const { value } = event.target;

    const chosenFormat: SelectableModel | undefined = formats?.find(
      (f: SelectableModel) => f.code === value
    );

    if (chosenFormat) {
      setSelectedFormat(value);
      setValue('movieFormatInfo.format', chosenFormat);
    }
  };

  const audioLanguagesChanged = (event: SelectChangeEvent) => {
    const { chosenLanguages, selectedOptions } = getSelectedLanguages(event);

    setSelectedAudio(selectedOptions);
    setValue('movieFormatInfo.audioLanguages', chosenLanguages);
  };

  const subtitlesChanged = (event: SelectChangeEvent) => {
    const { chosenLanguages, selectedOptions } = getSelectedLanguages(event);

    setSelectedSubtitles(selectedOptions);
    setValue('movieFormatInfo.subtitles', chosenLanguages);
  };

  const getSelectedLanguages = (
    event: SelectChangeEvent
  ): { chosenLanguages: LanguageModel[]; selectedOptions: string[] } => {
    const { value } = event.target;
    const chosenLanguages: LanguageModel[] = [];

    const selectedOptions =
      typeof value === 'string' ? value.split(',') : value;

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];
      const lang: LanguageModel | undefined = languages?.find(
        (l: LanguageModel) => l.id === parseInt(option, 10)
      );

      if (lang) {
        chosenLanguages.push(lang);
      }
    }
    return { chosenLanguages, selectedOptions };
  };

  // TODO: Move to admin page.
  //languageAdded(event: any) {
  //    const {dispatch} = props;
  //    let {languages} = props.baseData;
  //    const {value} = event.target;
  //
  //    // Find existing language.
  //    let newLanguage: LanguageModel = languages.find((lang: LanguageModel) => (lang.nameSwedish === value || lang.name === value));
  //
  //    if (!newLanguage) {
  //        languages.push({name: value, nameSwedish: } as LanguageModel);
  //    }
  //
  //    dispatch(updateLanguages(languages));
  //}

  return (
    <>
      <LabeledInput htmlFor="format" label="Format: *">
        <Controller
          control={control}
          name="movieFormatInfo.format"
          render={({ field: { onChange, ...field }, fieldState: { error } }) => (
            <>
              <Select
                {...field}
                className="mat-select-required"
                value={selectedFormat}
                onChange={formatChanged}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {mapMultipleSelectionToChips(selected, formats)}
                  </Box>
                )}
                MenuProps={SelectMenuProps}
              >
                {formats?.map((option, index) => (
                  <MenuItem key={index} value={option.code}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>

              <div style={{marginLeft: '0.5rem', display: 'flex', alignItems: 'center'}}>
                {error?.message && (
                  <small className="text-red-500" style={{ color: 'red' }}>{error.message}</small>
                )}
              </div>
            </>
          )}
          rules={{ required: 'Format är inte angivet' }}
        />
      </LabeledInput>

      <LabeledInput htmlFor="upcId" label="UPC-ID:">
        <Controller
          control={control}
          name="movieFormatInfo.upcId"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={upcId || ''}
              onChange={(e) => {
                onChange(e);
                setUpcId(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="region" label="Region:">
        <Controller
          control={control}
          name="movieFormatInfo.region"
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              value={region}
              onChange={(e) => {
                onChange(e);
                setRegion(e.target.value);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, regionOptions)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {regionOptions?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="discs" label="Antal skivor:">
        <Controller
          control={control}
          name="movieFormatInfo.discs"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={discs || ''}
              onChange={(e) => {
                onChange(e);
                setDiscs(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="pictureFormat" label="Bildformat:">
        <Controller
          control={control}
          name="movieFormatInfo.pictureFormat"
          render={({ field: { onChange, ...field } }) => (
            <TextField
              {...field}
              type="text"
              value={pictureFormat || ''}
              onChange={(e) => {
                onChange(e);
                setPictureFormat(e.target.value);
              }}
            />
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="system" label="System:">
        <Controller
          control={control}
          name="movieFormatInfo.system"
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              value={system}
              onChange={(e) => {
                onChange(e);
                setSystem(e.target.value);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, systemOptions)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {systemOptions?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="audioLanguages" label="Språk:">
        <Controller
          control={control}
          name="movieFormatInfo.audioLanguages"
          render={({ field: { ...field } }) => (
            <Select
              {...field}
              multiple={true}
              value={selectedAudio}
              onChange={audioLanguagesChanged}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, languageOptions)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {languageOptions?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      <LabeledInput htmlFor="subtitles" label="Undertexter:">
        <Controller
          control={control}
          name="movieFormatInfo.subtitles"
          render={({ field: { ...field } }) => (
            <Select
              {...field}
              multiple={true}
              value={selectedSubtitles}
              onChange={subtitlesChanged}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {mapMultipleSelectionToChips(selected, languageOptions)}
                </Box>
              )}
              MenuProps={SelectMenuProps}
            >
              {languageOptions?.map((option, index) => (
                <MenuItem key={index} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </LabeledInput>

      {/*TODO: Flytta till admin-vy*/}
      {/*{environment.enableMovieFormatEdit && (*/}
      {/*  <LabeledTextInput label="Add new language to select:" id="newLanguage" defaultValue={undefined} callback={languageAdded} />*/}
      {/*)}*/}
    </>
  );
};
