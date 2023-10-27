import React from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

import ListComponent, {IAbstractListState, getQueryParamValue} from "../common/ListComponent";
import MovieModel, {MovieFilter} from "../../models/MovieModel";
import {
    getMovies,
    updateFilterAndReloadMovies,
    clearFilterAndReloadMovies
} from "../../actions/movie.actions";
import Loader from '../common/loader/Loader';
import MovieFilterComponent from './movie-filter/MovieFilter';

interface IMovieListProps {
    movie: any,
    history: any,
    location: any,
    testName: string,
    dispatch: any
}

interface IMovieListState extends IAbstractListState {
    //filter: MovieFilter
    //componentName: string,
    //sort: SortModel
}

class MovieList extends ListComponent<IMovieListProps, IMovieListState> {

    static defaultProps = {testName: 'MovieList_test'};

    constructor(props:any) {
        super(props, 'movie-list', 'name');

        //props.dispatch(clearFilter());
    }

    sortOrdersByColumn = [
        {column: 'title', sortOrder: 'title'},
        {column: 'mainGenre', sortOrder: 'mainGenre.name'},
        {column: 'grade', sortOrder: 'grade'}
    ];

    componentDidMount() {
        this.loadMovies();
    }

    render() {
        const {movie, testName} = this.props;
        const {sort, componentName} = this.state as IMovieListState;
        const {movies, moviesNotLoaded, movieListErrorMessages} = movie;

        let content;

        if (movieListErrorMessages) {
            //DialogComponent.openDefaultErrorDialog(this.dialog, movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieListErrorMessages);
        }

        if (moviesNotLoaded) {
            // TODO: Add app start loader (splash screen)
            content = (<div><Loader /></div>);
        } else {
            content = (<div>
                <div className="list-templates">
                    <div className="list-create-link-and-no-items-container">
                        {(!movies || !movies.length) && (
                        <div className="list-no-items-text">
                            <h5>Filtreringsresultat saknas</h5>
                            <p>Det finns tyvärr inga filmer som passar filtreringen. Ändra filtreringen eller registrera en ny film.</p>
                        </div>
                            )}

                        <div onClick={() => this.createMovie()} className={'list-create-link-container' + (movies && movies.length) ? ' list-create-link-container-aligned' : ''}>
                            <div className="list-create-link-icon"><i className="fas fa-plus-circle orange"></i></div> <div className="list-create-link-text">Lägg till ny film</div>
                        </div>
                    </div>

                    {(movies && movies.length > 0) && (
                    <table className="mat-elevation-z8 authority-list-table mat-table">
                        <thead><tr className="mat-header-row">
                            <th onClick={() => this.changeSortOrder('title')} className="sortable mat-header-cell cdk-column-name mat-column-name">
                                <span className="icon-texts">Film</span>
                                <span>{sort.sortOrder === 'title' && (<i className={`icons sort-icon fas fa-sort-${sort.sortArrow()}`} />)}</span>
                            </th>
                            <th onClick={() => this.changeSortOrder('mainGenre')} className="sortable hide-small-screen mat-header-cell cdk-column-name mat-column-name">
                                <span className="icon-texts">Genre</span>
                                <span>{sort.sortOrder === 'mainGenre' && (<i className={`icons sort-icon fas fa-sort-${sort.sortArrow()}`} />)}</span>
                            </th>
                            <th onClick={() => this.changeSortOrder('grade')} className="sortable mat-header-cell cdk-column-name mat-column-name">
                                <span className="icon-texts">Betyg</span>
                                <span>{sort.sortOrder === 'grade' && (<i className={`icons sort-icon fas fa-sort-${sort.sortArrow()}`} />)}</span>
                            </th>
                        </tr></thead>

                        <tbody>
                            {
                                movies.map((element: MovieModel, i: number) => {
                                    return (<tr className="clickable mat-row" key={i}>
                                        <td className="mat-cell cdk-column-name mat-column-name" onClick={() => this.goToMovie(element.id)}>{ element.title }</td>
                                        <td className="mat-cell cdk-column-genre mat-column-genre hide-small-screen" onClick={() => this.goToMovie(element.id)}>{ element.mainGenre ? element.mainGenre.name : '' }</td>
                                        <td className="mat-cell cdk-column-grade mat-column-grade" onClick={() => this.goToMovie(element.id)}>{ element.moviePersonalInfo ? element.moviePersonalInfo.grade : '' }</td>
                                    </tr>)
                                    })
                                }
                        </tbody>
                    </table>
                        )}
                </div>

                <div className="middle-panel-navigate-bottom-to-top" onClick={() => this.scrollToTop()}>
                    <span className="icons app-link-with-icon">
                        <i className="app-icon fas fa-chevron-circle-up back-to-top"></i>
                    </span>
                    <span className="icon-texts app-text middle-panel-navigate-bottom-to-top-text">Tillbaka till toppen</span>
                </div>
            </div>)
        }
    //<HeaderComponent />
        return (
            <div data-test-name={testName}>

                <div className="main-page-container" data-test-name={testName}>
                    <MovieFilterComponent componentName={componentName}
                                          clearFilter={this.clearFilter.bind(this)}
                                          filterChanged={this.filterChanged.bind(this)}
                                          loadFilter={this.loadFilter.bind(this)} />
                    {content}
                </div>
            </div>
        )
    }

    createMovie() {
        this.props.history.push('/movie/0', [{mode: 'CREATE'}]);
    }

    changeSortOrder(newSortOrder) {
        this.state.sort.changeSortOrder(newSortOrder);
        //this.navigateToSelfWithFilter();
    }

    goToMovie(movieId: number) {
        this.props.history.push(`/movie/${movieId}`);
    }

    filterChanged(filter: MovieFilter) {
        this.props.dispatch(updateFilterAndReloadMovies(filter));
    }

    clearFilter() {
        this.props.dispatch(clearFilterAndReloadMovies());
    }

    loadFilter(filter: MovieFilter) {
        this.filterChanged(filter);
    }

    private loadMovies() {
        const {movie, dispatch} = this.props;
        const {sort} = this.state as IMovieListState;

        const sortOrder = this.sortOrdersByColumn.filter(sort => sort.column === sort.sortOrder)[0].sortOrder;

        dispatch(getMovies(movie.filter, sortOrder, sort.sortDirection, 0, 1000));
    }
}

function stateToProps({movie}) {
    return {
        movie
    };
}

export default withRouter(connect(stateToProps)(MovieList));
