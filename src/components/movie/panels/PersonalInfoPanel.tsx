import React from 'react';
import {connect} from 'react-redux';

import '../movie.details.scss';

import Loader from '../../common/loader/Loader';
import FormComponent from '../../common/FormComponent';
import LabelledTextInput from '../inputs/LabelledTextInput';
import LabelledSelect from '../inputs/LabelledSelect';
import LabelledDateInput from '../inputs/LabelledDateInput';
import LabelledTextarea from '../inputs/LabelledTextarea';
import { updateMovieState } from '../../../actions/movie.actions';
import MovieModel from '../../../models/MovieModel';
import {IMovieProps} from "../IMovieProps";
import {IMovieState} from "../IMovieState";

const GRADES: Array<number> = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const gradeOptions: Array<any> = GRADES.map((g: number, i: number) => {
    return <option key={i+1} value={g}>{g}</option>;
});
gradeOptions.unshift(<option key="0" value=""></option>);

const CURRENCIES: Array<string> = ['SEK', 'EUR', 'NOK', 'DKK', 'GBP', 'USD'];
const currencyOptions: Array<any> = CURRENCIES.map((c: string, i: number) => {
    return <option key={i+1} value={c}>{c}</option>;
});
currencyOptions.unshift(<option key="0" value=""></option>);

class PersonalInfoPanel extends FormComponent<IMovieProps, IMovieState> {  // TODO: Byta FormComponent mot Component?

    static defaultProps = {
        testName: 'PersonalInfoPanel_test'
    };

    constructor(props) {
        super(props);

        this.movieStateChanged = this.movieStateChanged.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        const {movieItem, movieErrorMessages} = this.props.movie;
        const {moviePersonalInfo} = movieItem;

        let content;

        if (movieErrorMessages) {  // TODO: Fyll på
            //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieErrorMessages);

            content = (<div></div>);
        } else if (this.isMovieLoading || !movieItem) {
            // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
            content = (<div><Loader /></div>);
        } else {
            content = (
                <div>
                    <LabelledTextInput label="Arkivnummer:" id="archiveNumber" defaultValue={moviePersonalInfo.archiveNumber} callback={this.movieStateChanged} />

                    <LabelledSelect label="Betyg:" id="grade" defaultValue={undefined} value={moviePersonalInfo.grade} options={gradeOptions} callback={this.movieStateChanged} required={false} multiple={false} />

                    <LabelledDateInput label="Datum inskaffad:" id="obtainDate" defaultValue={moviePersonalInfo.obtainDate} callback={this.movieStateChanged} />

                    <LabelledTextInput label="Inköpspris:" id="obtainPrice" defaultValue={moviePersonalInfo.obtainPrice} callback={this.movieStateChanged} />

                    <LabelledSelect label="Valuta:" id="currency" defaultValue={undefined} value={moviePersonalInfo.currency} options={currencyOptions} callback={this.movieStateChanged} required={false} multiple={false} />

                    <LabelledTextInput label="Plats för inskaffning:" id="obtainPlace" defaultValue={moviePersonalInfo.obtainPlace} callback={this.movieStateChanged} />

                    <LabelledTextarea label="Anteckningar:" id="notes" defaultValue={moviePersonalInfo.notes} callback={this.movieStateChanged} required={false} />
                </div>
            );
        }

        return (
            <div data-test-name={this.props.testName}>{content}</div>
        );
    }

    get isMovieLoading(): boolean {
        const {movie} = this.props;

        return movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting;
    }

    movieStateChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {moviePersonalInfo} = movieItem;
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
    }
}

function stateToProps({movie}) {
    return {
        movie
    };
}

export default connect(stateToProps)(PersonalInfoPanel);
