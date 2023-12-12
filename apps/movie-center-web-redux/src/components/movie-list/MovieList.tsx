import { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMovies } from '../../actions/movie.actions';
import { Loader } from '../common/loader/Loader';
import { MovieFilterComponent } from './movie-filter';
import { MovieListStateModel } from '../../actions/models/movie-state.model';
import { getDefaultSortModel, scrollToTop } from '../../utils/list.util';
import { SortModel } from '../../models/SortModel';
import { MovieGenreModel } from '../../models/MovieGenreModel';
import { IMovie } from '../../models/movie.model';

const SORT_ORDERS_BY_COLUMN = [
  { column: 'title', sortOrder: 'title' },
  { column: 'mainGenre', sortOrder: 'mainGenre.name' },
  { column: 'grade', sortOrder: 'grade' },
];

interface MovieListProps {
  movieList: MovieListStateModel;
  history: any;
  location: any;
  dispatch: (any: any) => void;
  testName?: string;
}

const MovieList = ({
  movieList,
  history,
  location,
  dispatch,
  testName = 'MovieList_test',
}: MovieListProps) => {
  const [sort, setSort] = useState(
    getDefaultSortModel('title', location.search)
  );

  useEffect(() => {
    loadMovies();
  }, [sort]);

  const loadMovies = () => {
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

  const changeSortOrder = (newSortOrder: string) => {
    sort.changeSortOrder(newSortOrder);
    setSort(SortModel.of(sort.sortOrder, sort.sortDirection));
  };

  const goToMovie = (movieId?: number) => {
    if (movieId) {
      history.push(`/movie/${movieId}`);
    }
  };

  const getMovieGenres = (movie: IMovie, limit = 3): string[] => {
    const mainGenre: MovieGenreModel | undefined = movie.genres.find(
      (mg) => mg.mainGenre
    );

    if (mainGenre) {
      return [mainGenre.genre.name];
    }

    const result: string[] = movie.genres.map((mg) => mg.genre.name);
    const genreNames = result.slice(0, limit);

    return genreNames.map((genre, idx) =>
      idx < genreNames.length - 1 ? `${genre}, ` : genre
    );
  };

  const { movies, moviesNotLoaded, movieListErrorMessages } = movieList;

  if (movieListErrorMessages) {
    //DialogComponent.openDefaultErrorDialog(this.dialog, movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieListErrorMessages);
  }

  return (
    <div data-test-name={testName}>
      <div className="main-page-container" data-test-name={testName}>
        <MovieFilterComponent componentName="movie_list" />
        {moviesNotLoaded ? (
          <div>
            <Loader />
          </div> // TODO: Add app start loader (splash screen)
        ) : (
          <div>
            <div className="list-templates">
              <div className="list-create-link-and-no-items-container">
                {(!movies || !movies.length) && (
                  <div className="list-no-items-text">
                    <h5>Filtreringsresultat saknas</h5>
                    <p>
                      Det finns tyvärr inga filmer som passar filtreringen.
                      Ändra filtreringen eller registrera en ny film.
                    </p>
                  </div>
                )}

                <div
                  onClick={() => createMovie()}
                  className={
                    'list-create-link-container' + (movies && movies.length)
                      ? ' list-create-link-container-aligned'
                      : ''
                  }
                >
                  <div className="list-create-link-icon">
                    <i className="fas fa-plus-circle orange"></i>
                  </div>{' '}
                  <div className="list-create-link-text">Lägg till ny film</div>
                </div>
              </div>

              {movies && movies.length > 0 && (
                <table className="mat-elevation-z8 authority-list-table mat-table">
                  <thead>
                    <tr className="mat-header-row">
                      <th
                        onClick={() => changeSortOrder('title')}
                        className="sortable mat-header-cell cdk-column-name mat-column-name"
                      >
                        <span className="icon-texts">Film</span>
                        <span>
                          {sort.sortOrder === 'title' && (
                            <i
                              className={`icons sort-icon fas fa-sort-${sort.sortArrow}`}
                            />
                          )}
                        </span>
                      </th>
                      <th
                        onClick={() => changeSortOrder('mainGenre')}
                        className="sortable hide-small-screen mat-header-cell cdk-column-name mat-column-name"
                      >
                        <span className="icon-texts">Genre</span>
                        <span>
                          {sort.sortOrder === 'mainGenre' && (
                            <i
                              className={`icons sort-icon fas fa-sort-${sort.sortArrow}`}
                            />
                          )}
                        </span>
                      </th>
                      <th
                        onClick={() => changeSortOrder('grade')}
                        className="sortable mat-header-cell cdk-column-name mat-column-name"
                      >
                        <span className="icon-texts">Betyg</span>
                        <span>
                          {sort.sortOrder === 'grade' && (
                            <i
                              className={`icons sort-icon fas fa-sort-${sort.sortArrow}`}
                            />
                          )}
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {movies.map((element: IMovie, i: number) => {
                      return (
                        <tr className="clickable mat-row" key={i}>
                          <td
                            className="mat-cell cdk-column-name mat-column-name"
                            onClick={() => goToMovie(element.id)}
                          >
                            {element.title}
                          </td>
                          <td
                            className="mat-cell cdk-column-genre mat-column-genre hide-small-screen"
                            onClick={() => goToMovie(element.id)}
                          >
                            {getMovieGenres(element)}
                          </td>
                          <td
                            className="mat-cell cdk-column-grade mat-column-grade"
                            onClick={() => goToMovie(element.id)}
                          >
                            {element.moviePersonalInfo
                              ? element.moviePersonalInfo.grade
                              : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div
              className="middle-panel-navigate-bottom-to-top"
              onClick={() => scrollToTop()}
            >
              <span className="icons app-link-with-icon">
                <i className="app-icon fas fa-chevron-circle-up back-to-top"></i>
              </span>
              <span className="icon-texts app-text middle-panel-navigate-bottom-to-top-text">
                Tillbaka till toppen
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// @ts-ignore
function stateToProps({ movieList }) {
  return {
    movieList,
  };
}

export default withRouter(connect(stateToProps)(MovieList));
