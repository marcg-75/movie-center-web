import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMovies, MovieListStateModel } from '@giron/data-access-redux';
import { MovieFilterComponent } from './movie-filter';
import { SortModel } from '@giron/shared-models';
import * as H from 'history';
import { MovieList } from '@giron/shared-movie-components';
import { useEffect, useState } from 'react';
import { getDefaultSortModel } from '@giron/shared-util-helpers';

const SORT_ORDERS_BY_COLUMN = [
  { column: 'title', sortOrder: 'title' },
  { column: 'genre', sortOrder: 'genres.genre.name' },
  { column: 'grade', sortOrder: 'moviePersonalInfo.grade' },
];

interface MovieListProps {
  movieList: MovieListStateModel;
  history: H.History;
  location: H.Location;
  dispatch: (any: unknown) => void;
}

const MovieListComponent = ({
  movieList,
  history,
  location,
  dispatch,
}: MovieListProps) => {
  const [sort, setSort] = useState(
    getDefaultSortModel('title', location.search)
  );

  useEffect(() => {
    loadMovies(sort);
  }, [sort]);

  const loadMovies = (sort: SortModel) => {
    const sortOrder = SORT_ORDERS_BY_COLUMN.filter(
      (csort) => csort.column === sort.sortOrder
    )[0].sortOrder;

    dispatch(
      getMovies(movieList.filter, sortOrder, sort.sortDirection, 0, 1000)
    );
  };

  const createMovie = () => {
    history.push('/movie/0', [{ mode: 'CREATE' }]);
  };

  const goToMovie = (movieId?: number) => {
    if (movieId) {
      history.push(`/movie/${movieId}`);
    }
  };

  const changeSortOrder = (newSortOrder: string) => {
    sort.changeSortOrder(newSortOrder);
    setSort(SortModel.of(sort.sortOrder, sort.sortDirection));
  };

  const { movies, moviesNotLoaded, movieListErrorMessages } = movieList;

  if (movieListErrorMessages) {
    //DialogComponent.openDefaultErrorDialog(this.dialog, movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieListErrorMessages);
  }

  return (
    <MovieList
      filterComponent={<MovieFilterComponent />}
      sort={sort}
      movies={movies}
      createMovie={createMovie}
      goToMovie={goToMovie}
      changeSortOrder={changeSortOrder}
      isLoading={moviesNotLoaded}
    />
  );
};

function stateToProps({ movieList }: { movieList: MovieListStateModel }) {
  return {
    movieList,
  };
}

export default withRouter(connect(stateToProps)(MovieListComponent));
