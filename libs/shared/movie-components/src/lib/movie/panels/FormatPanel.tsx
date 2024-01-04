import '../movie.details.scss';
import { ChangeEvent, ReactNode } from 'react';
import {
  LabeledSelect,
  LabeledTextInput,
  Loader,
} from '@giron/shared-ui-library';
import { IMovie, LanguageModel, SelectableModel } from '@giron/shared-models';

const REGIONS: Array<number> = [1, 2, 3, 4, 5, 6];
const regionOptions: ReactNode[] = REGIONS.map((r: number, i: number) => {
  return (
    <option key={i + 1} value={r}>
      {r}
    </option>
  );
});
regionOptions.unshift(<option key="0" value=""></option>);

const SYSTEMS: Array<string> = ['PAL', 'NTSC'];
const systemOptions: ReactNode[] = SYSTEMS.map((s: string, i: number) => {
  return (
    <option key={i + 1} value={s}>
      {s}
    </option>
  );
});
systemOptions.unshift(<option key="0" value=""></option>);

type Props = {
  movie?: IMovie;
  formats?: SelectableModel[];
  languages?: LanguageModel[];
  isLoading?: boolean;
  onMovieChange: (movie: IMovie) => void;
  error?: string | Error;
  errors?: string[] | Error[];
  testName?: string;
};

export const FormatPanel = ({
  movie,
  formats,
  languages,
  isLoading = false,
  onMovieChange,
  error,
  errors,
  testName = 'FormatPanel_test',
}: Props) => {
  const movieFormatInfo = movie?.movieFormatInfo;

  const movieStateChanged = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    let cValue: number | string | SelectableModel | undefined = value;

    if (name === 'format') {
      cValue = formats?.find((f: SelectableModel) => f.code === value);
    } else if (name === 'discs') {
      cValue = parseInt(value, 10);

      if (isNaN(cValue)) {
        event.target.value = '';
        return;
      }
    }

    onMovieChange({
      ...movie,
      movieFormatInfo: {
        ...movieFormatInfo,
        [name]: cValue,
      },
    } as IMovie);
  };

  const audioLanguagesChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const audioLanguages: Array<LanguageModel> = getSelectedLanguages(event);

    onMovieChange({
      ...movie,
      movieFormatInfo: {
        ...movieFormatInfo,
        audioLanguages,
      },
    } as IMovie);
  };

  const subtitlesChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const subtitles: Array<LanguageModel> = getSelectedLanguages(event);

    onMovieChange({
      ...movie,
      movieFormatInfo: {
        ...movieFormatInfo,
        subtitles,
      },
    } as IMovie);
  };

  const getSelectedLanguages = (
    event: ChangeEvent<HTMLSelectElement>
  ): Array<LanguageModel> => {
    const { selectedOptions } = event.target;
    const chosenLanguages: Array<LanguageModel> = [];

    for (let i = 0; i < selectedOptions.length; i++) {
      const option = selectedOptions[i];
      const lang: LanguageModel | undefined = languages?.find(
        (l: LanguageModel) => l.id === parseInt(option.value, 10)
      );

      if (lang) {
        chosenLanguages.push(lang);
      }
    }
    return chosenLanguages;
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

  let content;

  if (error || errors) {
    // TODO: Fyll på
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = <div>Ett fel inträffade</div>;
  } else if (isLoading || !movie || !movieFormatInfo?.format) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    const formatOptions = formats?.map((option: SelectableModel, i: number) => {
      return (
        <option key={i + 1} value={option.code}>
          {option.name}
        </option>
      );
    });
    formatOptions?.unshift(<option key="0" value=""></option>);

    const languageOptions = languages?.map(
      (option: LanguageModel, i: number) => {
        return (
          <option key={i + 1} value={option.id}>
            {option.nameSwedish}
          </option>
        );
      }
    );
    languageOptions?.unshift(<option key="0" value=""></option>);

    const currentAudioLanguageIds: Array<string> =
      movieFormatInfo?.audioLanguages
        ? movieFormatInfo?.audioLanguages.map(
            (lang: LanguageModel) => '' + lang.id
          )
        : [];

    const currentSubtitleIds: Array<string> = movieFormatInfo?.subtitles
      ? movieFormatInfo?.subtitles.map((lang: LanguageModel) => '' + lang.id)
      : [];

    content = (
      <div className="panel-content">
        <LabeledSelect
          label="Format: *"
          id="format"
          defaultValue={undefined}
          value={movieFormatInfo?.format.code}
          options={formatOptions}
          callback={movieStateChanged}
          required={true}
          multiple={false}
        />

        <LabeledTextInput
          label="UPC-ID:"
          id="upcId"
          defaultValue={movieFormatInfo?.upcId}
          callback={movieStateChanged}
        />

        <LabeledSelect
          label="Region:"
          id="region"
          defaultValue={undefined}
          value={movieFormatInfo?.region}
          options={regionOptions}
          callback={movieStateChanged}
          required={false}
          multiple={false}
        />

        <LabeledTextInput
          label="Antal skivor:"
          id="discs"
          defaultValue={movieFormatInfo?.discs}
          callback={movieStateChanged}
        />

        <LabeledTextInput
          label="Bildformat:"
          id="pictureFormat"
          defaultValue={movieFormatInfo?.pictureFormat}
          callback={movieStateChanged}
        />

        <LabeledSelect
          label="System:"
          id="system"
          defaultValue={undefined}
          value={movieFormatInfo?.system}
          options={systemOptions}
          callback={movieStateChanged}
          required={false}
          multiple={false}
        />

        <LabeledSelect
          label="Språk:"
          id="audioLanguages"
          defaultValue={undefined}
          value={currentAudioLanguageIds}
          options={languageOptions}
          callback={audioLanguagesChanged}
          required={false}
          multiple={true}
        />

        <LabeledSelect
          label="Undertexter:"
          id="subtitles"
          defaultValue={undefined}
          value={currentSubtitleIds}
          options={languageOptions}
          callback={subtitlesChanged}
          required={false}
          multiple={true}
        />
      </div>
    );
  }

  //{// TODO: Flytta till admin-vy
  //    environment.enableMovieFormatEdit && (
  //        <LabeledTextInput label="Add new language to select:" id="newLanguage" defaultValue={undefined} callback={languageAdded} />
  //    )}

  return <div data-test-name={testName}>{content}</div>;
};
