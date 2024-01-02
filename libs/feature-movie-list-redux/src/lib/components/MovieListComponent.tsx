import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMovies, MovieListStateModel } from '@giron/data-access-redux';
import { MovieFilterComponent } from './movie-filter';
import { SortModel } from '@giron/shared-models';
import * as H from 'history';
import { MovieList } from '@giron/shared-movie-components';

const SORT_ORDERS_BY_COLUMN = [
  { column: 'title', sortOrder: 'title' },
  { column: 'mainGenre', sortOrder: 'mainGenre.name' },
  { column: 'grade', sortOrder: 'grade' },
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

  const { movies, moviesNotLoaded, movieListErrorMessages } = movieList;

  if (movieListErrorMessages) {
    //DialogComponent.openDefaultErrorDialog(this.dialog, movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieListErrorMessages);
  }

  return (
    <MovieList
      filterComponent={<MovieFilterComponent componentName="movie_list" />}
      movies={movies}
      createMovie={createMovie}
      goToMovie={goToMovie}
      reloadMovies={loadMovies}
      queryParams={location.search}
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
