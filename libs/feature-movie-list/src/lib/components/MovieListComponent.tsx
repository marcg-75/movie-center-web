'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { MovieList } from '@giron/shared-movie-components';
import { MovieFilterComponent } from './movie-filter/MovieFilterComponent';
import { SortModel } from '@giron/shared-models';
import { useMovieList } from '@giron/data-access';
import { useState } from 'react';
import { getDefaultSortModel } from '@giron/shared-util-helpers';

const SORT_ORDERS_BY_COLUMN = [
  { column: 'title', sortOrder: 'title' },
  { column: 'genre', sortOrder: 'genres.genre.name' },
  { column: 'grade', sortOrder: 'moviePersonalInfo.grade' },
];

type Props = {};

export const MovieListComponent = ({}: Props) => {
  const router = useRouter();
  const searchParms = useSearchParams();

  const [sort, setSort] = useState(
    getDefaultSortModel('title', searchParms.toString())
  );

  const sortOrder = SORT_ORDERS_BY_COLUMN.filter(
    (csort) => csort.column === sort.sortOrder
  )[0].sortOrder;

  const { movies, isMoviesLoading, error } = useMovieList(
    sortOrder,
    sort.sortDirection,
    0,
    1000
  );

  const createMovie = () => {
    router.push('/movie/0');
  };

  const goToMovie = (movieId?: number) => {
    if (movieId) {
      router.push(`/movie/${movieId}`);
    }
  };

  const changeSortOrder = (newSortOrder: string) => {
    sort.changeSortOrder(newSortOrder);
    setSort(SortModel.of(sort.sortOrder, sort.sortDirection));
  };

  return (
    <MovieList
      filterComponent={<MovieFilterComponent />}
      sort={sort}
      movies={movies}
      createMovie={createMovie}
      goToMovie={goToMovie}
      changeSortOrder={changeSortOrder}
      isLoading={isMoviesLoading}
    />
  );
};
