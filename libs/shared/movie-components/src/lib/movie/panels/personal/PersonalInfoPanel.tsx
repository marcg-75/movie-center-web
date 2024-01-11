import '../../movie.details.scss';
import { Loader } from '@giron/shared-ui-library';
import { IMovie } from '@giron/shared-models';
import { Control, UseFormSetValue } from 'react-hook-form';
import { InputFields } from './InputFields';

type Props = {
  movie?: IMovie;
  isLoading: boolean;
  onMovieChange: (movie: IMovie) => void;
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  testName?: string;
};

export const PersonalInfoPanel = ({
  movie,
  isLoading = false,
  onMovieChange,
  control,
  setValue,
  error,
  errors,
  testName = 'PersonalInfoPanel_test',
}: Props) => {
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
        <InputFields
          control={control}
          setValue={setValue}
          moviePersonalInfo={movie?.moviePersonalInfo}
        />
      </div>
    );
  }

  return <div data-test-name={testName}>{content}</div>;
};
