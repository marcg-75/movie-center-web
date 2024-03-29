import { Loader } from '@giron/shared-ui-library';
import { IMovie, MovieGenreModel, SortModel } from '@giron/shared-models';
import { ReactNode } from 'react';
import { scrollToTop } from '@giron/shared-util-helpers';

type Props = {
  filterComponent: ReactNode;
  sort: SortModel;
  movies?: IMovie[];
  createMovie: () => void;
  goToMovie: (movieId?: number) => void;
  changeSortOrder: (newSortOrder: string) => void;
  isLoading?: boolean;
  testName?: string;
};

export const MovieList = ({
  filterComponent,
  sort,
  movies,
  createMovie,
  goToMovie,
  changeSortOrder,
  isLoading = false,
  testName = 'MovieList_test',
}: Props) => {
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

  return (
    <div data-test-name={testName}>
      <div className="main-page-container" data-test-name={testName}>
        {filterComponent}
        {isLoading ? (
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
                    <i className="text-pink-600 fas fa-plus-circle"></i>
                  </div>{' '}
                  <div className="list-create-link-text">Lägg till ny film</div>
                </div>
              </div>

              {movies && movies.length > 0 && (
                <table className="text-body-small mat-elevation-z8 authority-list-table mat-table">
                  <thead>
                    <tr className="font-bold text-left mat-header-row">
                      <th
                        onClick={() => changeSortOrder('title')}
                        className="bg-blue-900 sticky pl-6 sortable mat-header-cell cdk-column-name mat-column-name"
                      >
                        <span>Film</span>
                        <span>
                          {sort.sortOrder === 'title' && (
                            <i
                              className={`icons sort-icon fas fa-sort-${sort.sortArrow}`}
                            />
                          )}
                        </span>
                      </th>
                      <th className="bg-blue-900 sticky text-left px-1 hide-small-screen mat-header-cell cdk-column-name mat-column-name">
                        <span>Genre</span>
                      </th>
                      <th
                        onClick={() => changeSortOrder('grade')}
                        className="bg-blue-900 text-left sticky px-1 sortable mat-header-cell cdk-column-name mat-column-name"
                      >
                        <span>Betyg</span>
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
                        <tr
                          className="text-left [&:nth-child(even)]:bg-blue-50 hover:bg-blue-100 hover:[&:nth-child(even)]:bg-blue-100 clickable mat-row"
                          key={i}
                        >
                          <td
                            className="pl-6 mat-cell cdk-column-name mat-column-name"
                            onClick={() => goToMovie(element.id)}
                          >
                            {element.title}
                          </td>
                          <td
                            className="text-left px-1 mat-cell cdk-column-genre mat-column-genre hide-small-screen"
                            onClick={() => goToMovie(element.id)}
                          >
                            {getMovieGenres(element)}
                          </td>
                          <td
                            className="text-left px-1 mat-cell cdk-column-grade mat-column-grade"
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
              <span className="text-body-small font-bold app-text middle-panel-navigate-bottom-to-top-text">
                Tillbaka till toppen
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
