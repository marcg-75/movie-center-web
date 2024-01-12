import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  BaseDataStateModel,
  loadFormats,
  loadLanguages,
  MovieStateModel,
} from '@giron/data-access-redux';
import { IMovie, MovieFormatInfo } from '@giron/shared-models';
import { FormatPanel } from '@giron/shared-movie-components';
import { Control, UseFormSetValue } from 'react-hook-form';

interface FormatPanelProps {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const FormatPanelComponent = ({
  movie,
  baseData,
  control,
  setValue,
  dispatch,
  testName = 'FormatPanelComponent_test',
}: FormatPanelProps) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [isBaseDataLoading, setIsBaseDataLoading] = useState(false);

  useEffect(() => {
    dispatch(loadFormats());
    dispatch(loadLanguages());
  }, []);

  useEffect(() => {
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
    setIsBaseDataLoading(
      !baseData ||
        baseData.formatsLoading?.loading ||
        baseData.languagesLoading?.loading
    );
  }, [movie, baseData]);

  const { movieItem, movieLoading } = movie;
  const { formats, languages } = baseData;

  return (
    <FormatPanel
      control={control}
      setValue={setValue}
      movieFormatInfo={movieItem?.movieFormatInfo || ({} as MovieFormatInfo)}
      formats={formats}
      languages={languages}
      isLoading={isMovieLoading || isBaseDataLoading}
      errors={movieLoading?.errors}
      testName={testName}
    />
  );
};

function stateToProps({
  movie,
  baseData,
}: {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
}) {
  return {
    movie,
    baseData,
  };
}

export default connect(stateToProps)(FormatPanelComponent);
