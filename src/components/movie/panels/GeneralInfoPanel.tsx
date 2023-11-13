import React from 'react';
import {connect} from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';
import FormComponent from '../../common/FormComponent';
import LabelledTextInput from '../inputs/LabelledTextInput';
import LabelledDateInput from '../inputs/LabelledDateInput';
import LabelledTimeInput from '../inputs/LabelledTimeInput';
import LabelledTextarea from '../inputs/LabelledTextarea';
import LabelledSelect from '../inputs/LabelledSelect';
import { updateMovieState } from '../../../actions/movie.actions';
import MovieModel from '../../../models/MovieModel';
import SelectableModel from "../../../models/SelectableModel";
import NameEntityModel from "../../../models/NameEntityModel";
import {environment} from "../../../env/environment";
import {IMovieProps} from "../IMovieProps";
import {IMovieState} from "../IMovieState";
import { MovieGenreModel } from '../../../models/MovieGenreModel';

class GeneralInfoPanel extends FormComponent<IMovieProps, IMovieState> {  // TODO: Byta FormComponent mot Component?

    static defaultProps = {
        testName: 'GeneralInfoPanel_test'
    };

    constructor(props) {
        super(props);

        //this.isCreateMode = this.isCreateMode.bind(this);
        this.movieStateChanged = this.movieStateChanged.bind(this);
        this.additionalGenresChanged = this.additionalGenresChanged.bind(this);
        this.studiosChanged = this.studiosChanged.bind(this);
        this.studioAdded = this.studioAdded.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {

    }

    render() {
        const {movieItem, movieErrorMessages} = this.props.movie;
        const {genres, studios} = this.props.baseData;

        let content;

        if (movieErrorMessages) {  // TODO: Fyll på
            //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieErrorMessages);

            content = (<div></div>);
        } else if (this.isMovieLoading || !movieItem || this.isBaseDataLoading) {
            // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
            content = (<div><Loader /></div>);
        } else {
            const genreOptions = genres.map((option:SelectableModel, i:number) => {
                return <option key={i+1} value={option.code}>{option.name}</option>;
            });
            genreOptions.unshift(<option key="0" value=""></option>);

            const studioOptions = studios.map((option:NameEntityModel, i:number) => {
                return <option key={i+1} value={option.id}>{option.name}</option>;
            });
            studioOptions.unshift(<option key="0" value=""></option>);

            const mainGenre: MovieGenreModel | null = movieItem.genres?.find((mg) => mg.mainGenre);
            const currentAdditionalGenres: MovieGenreModel[] = movieItem.genres?.filter((mg) => !mg.mainGenre);

            const currentAdditionalGenreCodes: string[] = (currentAdditionalGenres?.length > 0)
                ? currentAdditionalGenres.map((mg) => mg.genre.code) : [];

            const currentStudioIds:Array<string> = movieItem.studios
                ? movieItem.studios.map((studio:NameEntityModel) => '' + studio.id) : [];

            content = (
                <div>
                    {mainGenre && (<LabelledSelect label="Huvudgenre: *" id="mainGenre" defaultValue={undefined} value={mainGenre.genre.code} options={genreOptions} callback={this.movieStateChanged} required={true} multiple={false} />)}

                    <LabelledSelect label="Andra genrer:" id="additionalGenres" defaultValue={currentAdditionalGenreCodes} value={undefined} options={genreOptions} callback={this.additionalGenresChanged} required={false} multiple={true} />

                    <LabelledTimeInput label="Speltid:" id="runtime" defaultValue={movieItem.runtime} callback={this.movieStateChanged} />

                    <LabelledDateInput label="Release-datum:" id="releaseDate" defaultValue={movieItem.releaseDate} callback={this.movieStateChanged} />

                    <LabelledTextInput label="Land:" id="country" defaultValue={movieItem.country} callback={this.movieStateChanged} />

                    <LabelledTextInput label="Ålder:" id="ageRestriction" defaultValue={movieItem.ageRestriction} callback={this.movieStateChanged} />

                    <LabelledSelect label="Studior:" id="studios" defaultValue={undefined} value={currentStudioIds} options={studioOptions} callback={this.studiosChanged} required={false} multiple={true} />

                    {environment.enableMovieInfoEdit && (
                        <LabelledTextInput label="Lägg till ny studio:" id="newStudio" defaultValue={undefined} callback={this.studioAdded} />
                    )}

                    <LabelledTextarea label="Beskrivning: *" id="description" defaultValue={movieItem.description} callback={this.movieStateChanged} required={true} />
                </div>
            );
        }

        return (
            <div data-test-name={this.props.testName}>{content}</div>
        );
    }

    get isBaseDataLoading(): boolean {
        const {baseData} = this.props;

        return !baseData || !(baseData.genresLoaded && baseData.formatsLoaded && baseData.studiosLoaded);
    }

    get isMovieLoading(): boolean {
        const {movie} = this.props;

        return movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting;
    }

    movieStateChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {name, value} = event.target;

        let cValue = value;

        if (name === 'mainGenre') {
            const {genres} = this.props.baseData;

            cValue = genres.find((g: SelectableModel) => g.code === value);
        }

        dispatch(updateMovieState({
            ...movieItem,
            [name]: cValue
        } as MovieModel));
    }

    additionalGenresChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {genres} = this.props.baseData;
        const {selectedOptions} = event.target;
        const chosenGenres: Array<MovieGenreModel> = [];

        for (let i = 0 ; i < selectedOptions.length ; i++) {
            let option: any = selectedOptions[i];
            let genre: SelectableModel = genres.find((g: SelectableModel) => g.code === option.value);

            if (genre) {
                const movieGenre: MovieGenreModel = {
                  movieTitle: movieItem.title,
                  genre,
                  mainGenre: false  // TODO: Change this when main genre selection feature is being implemented.
                };

                chosenGenres.push(movieGenre);
            }
        }

        dispatch(updateMovieState({
            ...movieItem,
            genres: chosenGenres
        } as MovieModel));
    }

    studiosChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {studios} = this.props.baseData;
        const {selectedOptions} = event.target;
        const chosenStudios: Array<NameEntityModel> = [];

        for (let i = 0 ; i < selectedOptions.length ; i++) {
            let option: any = selectedOptions[i];
            let studio: NameEntityModel = studios.find((s: NameEntityModel) => s.id === parseInt(option.value, 10));

            if (studio) {
                chosenStudios.push(studio);
            }
        }

        dispatch(updateMovieState({
            ...movieItem,
            studios: chosenStudios
        } as MovieModel));
    }

    studioAdded(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {value} = event.target;

        const newStudio: NameEntityModel = {name: value} as NameEntityModel;

        const chosenStudios: Array<NameEntityModel> = movieItem.studios;
        chosenStudios.push(newStudio);

        dispatch(updateMovieState({
            ...movieItem,
            studios: chosenStudios
        } as MovieModel));
    }
}

function stateToProps({movie, baseData}) {
    return {
        movie,
        baseData
    };
}

export default connect(stateToProps)(GeneralInfoPanel);