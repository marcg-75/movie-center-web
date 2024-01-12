import { useState } from 'react';
import { connect } from 'react-redux';
import { BaseDataStateModel, MovieStateModel } from '@giron/data-access-redux';
import { checkIfBaseDataIsLoading } from '../../utils/movie.utils';
import { IMovie } from '@giron/shared-models';
import { GeneralInfoPanel } from '@giron/shared-movie-components';
import { Control, UseFormSetValue } from 'react-hook-form';

type Props = {
  movie: MovieStateModel;
  baseData: BaseDataStateModel;
  control: Control<IMovie>;
  setValue: UseFormSetValue<IMovie>;
  testName?: string;
};

const GeneralInfoPanelComponent = ({
  movie,
  baseData,
  control,
  setValue,
  testName = 'GeneralInfoPanelComponent_test',
}: Props) => {
  const [isMovieLoading] = useState(movie?.movieLoading?.loading);
  const [isBaseDataLoading] = useState(checkIfBaseDataIsLoading(baseData));

  const { movieItem, movieLoading } = movie;
  const { genres, studios } = baseData;

  return (
    <>
      {movieItem && (
        <GeneralInfoPanel
          control={control}
          setValue={setValue}
          movie={movieItem}
          genres={genres}
          studios={studios}
          isLoading={isMovieLoading || isBaseDataLoading}
          errors={movieLoading.errors}
          testName={testName}
        />
      )}
    </>
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

export default connect(stateToProps)(GeneralInfoPanelComponent);
