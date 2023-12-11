import { ReactNode, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';
import LabelledTextInput from '../inputs/LabelledTextInput';
import LabelledDateInput from '../inputs/LabelledDateInput';
import LabelledTimeInput from '../inputs/LabelledTimeInput';
import LabelledTextarea from '../inputs/LabelledTextarea';
import LabelledSelect from '../inputs/LabelledSelect';
import { updateMovieState } from '../../../actions/movie.actions';
import MovieModel from '../../../models/MovieModel';
import SelectableModel from "../../../models/SelectableModel";
import NameEntityModel from "../../../models/NameEntityModel";
import { environment } from "../../../env/environment";
import { MovieGenreModel } from '../../../models/MovieGenreModel';
import { MovieStateModel } from '../../../actions/models/movie-state.model';
import { BaseDataStateModel } from '../../../actions/models/base-data-state.model';

interface GeneralInfoPanelProps {
    movie: MovieStateModel;
    baseData: BaseDataStateModel;
    dispatch: (any: any) => void;
    testName?: string;
}

const GeneralInfoPanel = ({movie, baseData, dispatch, testName = 'GeneralInfoPanel_test'}: GeneralInfoPanelProps) => {

    const [isMovieLoading, setIsMovieLoading] = useState(false);
    const [isBaseDataLoading, setIsBaseDataLoading] = useState(false);

    useEffect(() => {
        setIsMovieLoading(!movie || movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting);
        setIsBaseDataLoading(!baseData || !(baseData.genresLoaded && baseData.formatsLoaded && baseData.studiosLoaded));
    }, [movie, baseData]);

    const {movieItem, movieErrorMessages} = movie;
    const {genres, studios} = baseData;

    const movieStateChanged = (event: any) => {
        const {name, value} = event.target;

        let cValue = value;

        if (name === 'mainGenre') {
            cValue = genres.find((g: SelectableModel) => g.code === value);
        }

        dispatch(updateMovieState({
            ...movieItem,
            [name]: cValue
        } as MovieModel));
    };

    const additionalGenresChanged = (event: any) => {
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
    };

    const studioAdded = (event: any) => {
        const {value} = event.target;

        const newStudio: NameEntityModel = {name: value} as NameEntityModel;

        const chosenStudios: Array<NameEntityModel> = movieItem.studios;
        chosenStudios.push(newStudio);

        dispatch(updateMovieState({
            ...movieItem,
            studios: chosenStudios
        } as MovieModel));
    };

    const studiosChanged = (event: any) => {
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
    };

    let content: ReactNode;

    if (movieErrorMessages) {  // TODO: Fyll på
        //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
        //alert(movieErrorMessages);

        content = (<div></div>);
    } else if (isMovieLoading || !movieItem || isBaseDataLoading) {
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
                {mainGenre && (<LabelledSelect label="Huvudgenre: *" id="mainGenre" defaultValue={undefined} value={mainGenre.genre.code} options={genreOptions} callback={movieStateChanged} required={true} multiple={false} />)}

                <LabelledSelect label="Genrer:" id="additionalGenres" defaultValue={currentAdditionalGenreCodes} value={undefined} options={genreOptions} callback={additionalGenresChanged} required={false} multiple={true} />

                <LabelledTimeInput label="Speltid:" id="runtime" defaultValue={movieItem.runtime} callback={movieStateChanged} />

                <LabelledDateInput label="Release-datum:" id="releaseDate" defaultValue={movieItem.releaseDate} callback={movieStateChanged} />

                <LabelledTextInput label="Land:" id="country" defaultValue={movieItem.country} callback={movieStateChanged} />

                <LabelledTextInput label="Ålder:" id="ageRestriction" defaultValue={movieItem.ageRestriction} callback={movieStateChanged} />

                <LabelledSelect label="Studior:" id="studios" defaultValue={undefined} value={currentStudioIds} options={studioOptions} callback={studiosChanged} required={false} multiple={true} />

                {environment.enableMovieInfoEdit && (
                    <LabelledTextInput label="Lägg till ny studio:" id="newStudio" defaultValue={undefined} callback={studioAdded} />
                )}

                <LabelledTextarea label="Beskrivning: *" id="description" defaultValue={movieItem.description} callback={movieStateChanged} required={true} />

                <a href={`https://www.imdb.com/title/${movieItem.imdbId}/`} target="browser1">IMDB info</a>
            </div>
        );
    }

        return (
            <div data-test-name={testName}>{content}</div>
        );
};

function stateToProps({movie, baseData}) {
    return {
        movie,
        baseData
    };
}

export default connect(stateToProps)(GeneralInfoPanel);