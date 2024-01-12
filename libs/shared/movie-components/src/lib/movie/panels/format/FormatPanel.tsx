import '../../movie.details.scss';
import { Loader } from '@giron/shared-ui-library';
import {
  IMovie,
  LanguageModel,
  MovieFormatInfo,
  SelectableModel,
} from '@giron/shared-models';
import { Control, UseFormSetValue } from 'react-hook-form';
import { InputFields } from './InputFields';

type Props = {
  movieFormatInfo: MovieFormatInfo;
  formats?: SelectableModel[];
  languages?: LanguageModel[];
  isLoading?: boolean;
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  testName?: string;
};

export const FormatPanel = ({
  movieFormatInfo,
  formats,
  languages,
  isLoading = false,
  control,
  setValue,
  error,
  errors,
  testName = 'FormatPanel_test',
}: Props) => {
  let content;

  if (error || errors) {
    // TODO: Fyll på
    //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = <div>Ett fel inträffade</div>;
  } else if (isLoading) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    content = (
      <div className="panel-content">
        <InputFields
          control={control}
          setValue={setValue}
          movieFormatInfo={movieFormatInfo}
          formats={formats}
          languages={languages}
        />
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};
