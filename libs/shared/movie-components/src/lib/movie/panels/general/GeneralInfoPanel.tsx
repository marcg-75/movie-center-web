import '../../movie.details.scss';
import { ReactNode } from 'react';
import { Loader } from '@giron/shared-ui-library';
import {
  CastAndCrewModel,
  IMovie,
  NameEntityModel,
  RoleEnum,
  SelectableModel,
} from '@giron/shared-models';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { InputFields } from './InputFields';

type Props = {
  movie?: IMovie;
  genres?: SelectableModel[];
  studios?: NameEntityModel[];
  isLoading?: boolean;
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  testName?: string;
};

export const GeneralInfoPanel = ({
  movie,
  genres,
  studios,
  isLoading = false,
  control,
  setValue,
  error,
  errors,
  testName = 'GeneralInfoPanel_test',
}: Props) => {
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
    content = (
      <div className="panel-content">
        <InputFields
          control={control}
          setValue={setValue}
          movie={movie}
          genres={genres}
          studios={studios}
        />
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};
