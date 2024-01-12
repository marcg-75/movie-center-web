import { IMovie, MovieFormatInfo } from '@giron/shared-models';
import { CoverPanel } from '@giron/shared-movie-components';
import { Control } from 'react-hook-form';

type Props = {
  movieFormatInfo?: MovieFormatInfo;
  isMovieLoading: boolean;
  control: Control<IMovie>;
  testName?: string;
};

export const CoverPanelComponent = ({
  movieFormatInfo = {} as MovieFormatInfo,
  isMovieLoading,
  control,
  testName = 'CoverPanelComponent_test',
}: Props) => {
  return (
    <CoverPanel
      control={control}
      movieFormatInfo={movieFormatInfo}
      isLoading={isMovieLoading}
      testName={testName}
    />
  );
};
