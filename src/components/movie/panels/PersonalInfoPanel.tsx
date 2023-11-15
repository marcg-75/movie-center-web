import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';
import LabelledTextInput from '../inputs/LabelledTextInput';
import LabelledSelect from '../inputs/LabelledSelect';
import LabelledDateInput from '../inputs/LabelledDateInput';
import LabelledTextarea from '../inputs/LabelledTextarea';
import { updateMovieState } from '../../../actions/movie.actions';
import MovieModel from '../../../models/MovieModel';
import { MovieStateModel } from '../../../actions/models/movie-state.model';

const GRADES: Array<number> = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const gradeOptions: Array<any> = GRADES.map((g: number, i: number) => {
    return <option key={i + 1} value={g}>{g}</option>;
});
gradeOptions.unshift(<option key="0" value=""></option>);

const CURRENCIES: Array<string> = ['SEK', 'EUR', 'NOK', 'DKK', 'GBP', 'USD'];
const currencyOptions: Array<any> = CURRENCIES.map((c: string, i: number) => {
    return <option key={i + 1} value={c}>{c}</option>;
});
currencyOptions.unshift(<option key="0" value=""></option>);

interface PersonalInfoPanelProps {
    movie: MovieStateModel;
    dispatch: (any: any) => void;
    testName?: string;
}

const PersonalInfoPanel = ({movie, dispatch, testName = 'PersonalInfoPanel_test'}: PersonalInfoPanelProps) => {

    const [isMovieLoading, setIsMovieLoading] = useState(false);

    useEffect(() => {
        setIsMovieLoading(!movie || movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting);
    }, [movie]);

    const {movieItem, movieErrorMessages} = movie;
    const {moviePersonalInfo} = movieItem;

    const movieStateChanged = (event: any) => {
        const {name, value} = event.target;

        let cValue = value;

        if (name === 'grade') {
            cValue = parseFloat(value);
        } else if (name === 'obtainPrice') {
            cValue = parseFloat(value);

            if (isNaN(cValue)) {
                alert('Pris måste vara ett tal.');
                event.target.value = '';
                return;
            }
        }

        dispatch(updateMovieState({
            ...movieItem,
            moviePersonalInfo: {
                ...moviePersonalInfo,
                [name]: cValue
            }
        } as MovieModel));
    };

    let content;

    if (movieErrorMessages) {  // TODO: Fyll på
        //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
        //alert(movieErrorMessages);

        content = (<div></div>);
    } else if (isMovieLoading || !movieItem) {
        // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
        content = (<div><Loader/></div>);
    } else {
        content = (
            <div>
                <LabelledTextInput label="Arkivnummer:" id="archiveNumber"
                                   defaultValue={moviePersonalInfo.archiveNumber} callback={movieStateChanged}/>

                <LabelledSelect label="Betyg:" id="grade" defaultValue={undefined} value={moviePersonalInfo.grade}
                                options={gradeOptions} callback={movieStateChanged} required={false} multiple={false}/>

                <LabelledDateInput label="Datum inskaffad:" id="obtainDate" defaultValue={moviePersonalInfo.obtainDate}
                                   callback={movieStateChanged}/>

                <LabelledTextInput label="Inköpspris:" id="obtainPrice" defaultValue={moviePersonalInfo.obtainPrice}
                                   callback={movieStateChanged}/>

                <LabelledSelect label="Valuta:" id="currency" defaultValue={undefined}
                                value={moviePersonalInfo.currency} options={currencyOptions}
                                callback={movieStateChanged} required={false} multiple={false}/>

                <LabelledTextInput label="Plats för inskaffning:" id="obtainPlace"
                                   defaultValue={moviePersonalInfo.obtainPlace} callback={movieStateChanged}/>

                <LabelledTextarea label="Anteckningar:" id="notes" defaultValue={moviePersonalInfo.notes}
                                  callback={movieStateChanged} required={false}/>
            </div>
        );
    }

    return (
        <div data-test-name={testName}>{content}</div>
    );
}

function stateToProps({movie}) {
    return {
        movie
    };
}

export default connect(stateToProps)(PersonalInfoPanel);
