import { IMovie } from '@giron/shared-models';
import { FormatPanel } from '@giron/shared-movie-components';
import { useFormats, useLanguages } from '@giron/data-access';
import { Control, UseFormSetValue } from 'react-hook-form';

type Props = {
  movie?: IMovie;
  isMovieLoading: boolean;
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  testName?: string;
};

export const FormatPanelComponent = ({
  movie,
  isMovieLoading,
  control,
  setValue,
  testName = 'FormatPanelComponent_test',
}: Props) => {
  const { formats, isFormatsLoading, error: formatError } = useFormats();
  const { languages, isLanguagesLoading, error: langError } = useLanguages();

  return (
    <FormatPanel
      control={control}
      setValue={setValue}
      movie={movie}
      formats={formats}
      languages={languages}
      isLoading={isMovieLoading || isFormatsLoading || isLanguagesLoading}
      error={formatError || langError}
      testName={testName}
    />
  );
};
