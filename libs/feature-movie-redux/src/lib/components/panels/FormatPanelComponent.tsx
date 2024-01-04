import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  BaseDataStateModel,
  loadFormats,
  loadLanguages,
  MovieStateModel,
  updateMovieState,
} from '@giron/data-access-redux';
import { IMovie } from '@giron/shared-models';
import { FormatPanel } from '@giron/shared-movie-components';

interface FormatPanelProps {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

const FormatPanelComponent = ({
  movie,
  baseData,
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
      movie={movieItem}
      formats={formats}
      languages={languages}
      isLoading={isMovieLoading || isBaseDataLoading}
      onMovieChange={(movie: IMovie) => dispatch(updateMovieState(movie))}
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
