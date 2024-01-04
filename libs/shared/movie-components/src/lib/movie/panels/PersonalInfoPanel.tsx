import '../movie.details.scss';
import { ChangeEvent, ReactNode } from 'react';
import {
  LabeledDateInput,
  LabeledSelect,
  LabeledTextarea,
  LabeledTextInput,
  Loader,
} from '@giron/shared-ui-library';
import { IMovie } from '@giron/shared-models';

const GRADES: Array<number> = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const gradeOptions: ReactNode[] = GRADES.map((g: number, i: number) => {
  return (
    <option key={i + 1} value={g}>
      {g}
    </option>
  );
});
gradeOptions.unshift(<option key="0" value=""></option>);

const CURRENCIES: Array<string> = ['SEK', 'EUR', 'NOK', 'DKK', 'GBP', 'USD'];
const currencyOptions: ReactNode[] = CURRENCIES.map((c: string, i: number) => {
  return (
    <option key={i + 1} value={c}>
      {c}
    </option>
  );
});
currencyOptions.unshift(<option key="0" value=""></option>);

type Props = {
  movie?: IMovie;
  isLoading: boolean;
  onMovieChange: (movie: IMovie) => void;
  error?: string | Error;
  errors?: string[] | Error[];
  testName?: string;
};

export const PersonalInfoPanel = ({
  movie,
  isLoading = false,
  onMovieChange,
  error,
  errors,
  testName = 'PersonalInfoPanel_test',
}: Props) => {
  const moviePersonalInfo = movie?.moviePersonalInfo;

  const movieStateChanged = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    let cValue: number | string = value;

    if (name === 'grade') {
      cValue = parseFloat(value);
    } else if (name === 'obtainPrice') {
      cValue = parseFloat(value);

      if (isNaN(cValue)) {
        alert('Pris måste vara ett tal.');
        event.target.value = '';
        return;
      }
    }

    onMovieChange({
      ...movie,
      moviePersonalInfo: {
        ...moviePersonalInfo,
        [name]: cValue,
      },
    } as IMovie);
  };

  let content;

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
    content = (
      <div className="panel-content">
        <LabeledTextInput
          label="Arkivnummer:"
          id="archiveNumber"
          defaultValue={moviePersonalInfo?.archiveNumber}
          callback={movieStateChanged}
        />

        <LabeledSelect
          label="Betyg:"
          id="grade"
          defaultValue={undefined}
          value={moviePersonalInfo?.grade}
          options={gradeOptions}
          callback={movieStateChanged}
          required={false}
          multiple={false}
        />

        <LabeledDateInput
          label="Datum inskaffad:"
          id="obtainDate"
          defaultValue={moviePersonalInfo?.obtainDate}
          callback={movieStateChanged}
        />

        <LabeledTextInput
          label="Inköpspris:"
          id="obtainPrice"
          defaultValue={moviePersonalInfo?.obtainPrice}
          callback={movieStateChanged}
        />

        <LabeledSelect
          label="Valuta:"
          id="currency"
          defaultValue={undefined}
          value={moviePersonalInfo?.currency}
          options={currencyOptions}
          callback={movieStateChanged}
          required={false}
          multiple={false}
        />

        <LabeledTextInput
          label="Plats för inskaffning:"
          id="obtainPlace"
          defaultValue={moviePersonalInfo?.obtainPlace}
          callback={movieStateChanged}
        />

        <LabeledTextarea
          label="Anteckningar:"
          id="notes"
          defaultValue={moviePersonalInfo?.notes}
          callback={movieStateChanged}
          required={false}
        />
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};
