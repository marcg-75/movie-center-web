import { IMovie } from '@giron/shared-models';
import { FormatPanel } from '@giron/shared-movie-components';
import { useFormats, useLanguages } from '@giron/data-access';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  testName?: string;
};

export const FormatPanelComponent = ({
  movie,
  isMovieLoading,
  testName = 'FormatPanelComponent_test',
}: Props) => {
  const { formats, isFormatsLoading, error: formatError } = useFormats();
  const { languages, isLanguagesLoading, error: langError } = useLanguages();

  const notYetImplemented = (movie: IMovie) => {
    console.log('Invoking a not yet implemented method.');
  };

  return (
    <FormatPanel
      movie={movie}
      formats={formats}
      languages={languages}
      isLoading={isMovieLoading || isFormatsLoading || isLanguagesLoading}
      onMovieChange={notYetImplemented}
      error={formatError || langError}
      testName={testName}
    />
  );
};
