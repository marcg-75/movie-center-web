import React from 'react';
import {connect} from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';
import FormComponent from '../../common/FormComponent';
import LabelledTextInput from '../inputs/LabelledTextInput';
import LabelledSelect from '../inputs/LabelledSelect';
import { updateMovieState } from '../../../actions/movie.actions';
import MovieModel from '../../../models/MovieModel';
import SelectableModel from "../../../models/SelectableModel";
import {IMovieProps} from "../IMovieProps";
import {IMovieState} from "../IMovieState";
import LanguageModel from "../../../models/LanguageModel";

const REGIONS: Array<number> = [1, 2, 3, 4, 5, 6];
const regionOptions: Array<any> = REGIONS.map((r: number, i: number) => {
    return <option key={i+1} value={r}>{r}</option>;
});
regionOptions.unshift(<option key="0" value=""></option>);

const SYSTEMS: Array<string> = ['PAL', 'NTSC'];
const systemOptions: Array<any> = SYSTEMS.map((s: string, i: number) => {
    return <option key={i+1} value={s}>{s}</option>;
});
systemOptions.unshift(<option key="0" value=""></option>);

class FormatPanel extends FormComponent<IMovieProps, IMovieState> {  // TODO: Byta FormComponent mot Component?

    static defaultProps = {
        testName: 'FormatPanel_test'
    };

    constructor(props) {
        super(props);

        this.movieStateChanged = this.movieStateChanged.bind(this);
        this.audioLanguagesChanged = this.audioLanguagesChanged.bind(this);
        this.subtitlesChanged = this.subtitlesChanged.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        const {movieItem, movieErrorMessages} = this.props.movie;
        const {formats, languages} = this.props.baseData;
        const {movieFormatInfo} = movieItem;

        let content;

        if (movieErrorMessages) {  // TODO: Fyll på
            //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieErrorMessages);

            content = (<div></div>);
        } else if (this.isMovieLoading || !movieItem || this.isBaseDataLoading || !movieFormatInfo.format) {
            // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
            content = (<div><Loader /></div>);
        } else {
            const formatOptions = formats.map((option: SelectableModel, i: number) => {
                return <option key={i+1} value={option.code}>{option.name}</option>;
            });
            formatOptions.unshift(<option key="0" value=""></option>);

            const languageOptions = languages.map((option: LanguageModel, i:number) => {
                return <option key={i+1} value={option.id}>{option.nameSwedish}</option>;
            });
            languageOptions.unshift(<option key="0" value=""></option>);

            const currentAudioLanguageIds: Array<string> = movieFormatInfo.audioLanguages
                ? movieFormatInfo.audioLanguages.map((lang: LanguageModel) => '' + lang.id) : [];

            const currentSubtitleIds: Array<string> = movieFormatInfo.subtitles
                ? movieFormatInfo.subtitles.map((lang: LanguageModel) => '' + lang.id) : [];

            content = (
                <div>
                    <LabelledSelect label="Format: *" id="format" defaultValue={undefined} value={movieFormatInfo.format.code} options={formatOptions} callback={this.movieStateChanged} required={true} multiple={false} />

                    <LabelledTextInput label="UPC-ID:" id="upcId" defaultValue={movieFormatInfo.upcId} callback={this.movieStateChanged} />

                    <LabelledSelect label="Region:" id="region" defaultValue={undefined} value={movieFormatInfo.region} options={regionOptions} callback={this.movieStateChanged} required={false} multiple={false} />

                    <LabelledTextInput label="Antal skivor:" id="discs" defaultValue={movieFormatInfo.discs} callback={this.movieStateChanged} />

                    <LabelledTextInput label="Bildformat:" id="pictureFormat" defaultValue={movieFormatInfo.pictureFormat} callback={this.movieStateChanged} />

                    <LabelledSelect label="System:" id="system" defaultValue={undefined} value={movieFormatInfo.system} options={systemOptions} callback={this.movieStateChanged} required={false} multiple={false} />

                    <LabelledSelect label="Språk:" id="audioLanguages" defaultValue={undefined} value={currentAudioLanguageIds} options={languageOptions} callback={this.audioLanguagesChanged} required={false} multiple={true} />

                    <LabelledSelect label="Undertexter:" id="subtitles" defaultValue={undefined} value={currentSubtitleIds} options={languageOptions} callback={this.subtitlesChanged} required={false} multiple={true} />
                </div>
            );
        }

        //{// TODO: Flytta till admin-vy
        //    environment.enableMovieFormatEdit && (
        //        <LabelledTextInput label="Add new language to select:" id="newLanguage" defaultValue={undefined} callback={this.languageAdded} />
        //    )}

        return (
            <div data-test-name={this.props.testName}>{content}</div>
        );
    }

    get isBaseDataLoading(): boolean {
        const {baseData} = this.props;

        return !baseData || !(baseData.formatsLoaded && baseData.languagesLoaded);
    }

    get isMovieLoading(): boolean {
        const {movie} = this.props;

        return movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting;
    }

    movieStateChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {movieFormatInfo} = movieItem;
        const {name, value} = event.target;

        let cValue = value;

        if (name === 'format') {
            const {formats} = this.props.baseData;

            cValue = formats.find((f: SelectableModel) => f.code === value);
        } else if (name === 'discs') {
            cValue = parseInt(value, 10);

            if (isNaN(cValue)) {
                event.target.value = '';
                return;
            }
        }

        dispatch(updateMovieState({
            ...movieItem,
            movieFormatInfo: {
                ...movieFormatInfo,
                [name]: cValue
            }
        } as MovieModel));
    }

    audioLanguagesChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {movieFormatInfo} = movieItem;
        const audioLanguages: Array<LanguageModel> = this.getSelectedLanguages(event);

        dispatch(updateMovieState({
            ...movieItem,
            movieFormatInfo: {
                ...movieFormatInfo,
                audioLanguages
            }
        } as MovieModel));
    }

    subtitlesChanged(event: any) {
        const {dispatch} = this.props;
        const {movieItem} = this.props.movie;
        const {movieFormatInfo} = movieItem;
        const subtitles: Array<LanguageModel> = this.getSelectedLanguages(event);

        dispatch(updateMovieState({
            ...movieItem,
            movieFormatInfo: {
                ...movieFormatInfo,
                subtitles
            }
        } as MovieModel));
    }

    private getSelectedLanguages(event: any) : Array<LanguageModel> {
        const {languages} = this.props.baseData;
        const {selectedOptions} = event.target;
        const chosenLanguages: Array<LanguageModel> = [];

        for (let i = 0 ; i < selectedOptions.length ; i++) {
            let option: any = selectedOptions[i];
            let lang: LanguageModel = languages.find((l: LanguageModel) => l.id === parseInt(option.value, 10));

            if (lang) {
                chosenLanguages.push(lang);
            }
        }
        return chosenLanguages;
    }

    // TODO: Move to admin page.
    //languageAdded(event: any) {
    //    const {dispatch} = this.props;
    //    let {languages} = this.props.baseData;
    //    const {value} = event.target;
    //
    //    // Find existing language.
    //    let newLanguage: LanguageModel = languages.find((lang: LanguageModel) => (lang.nameSwedish === value || lang.name === value));
    //
    //    if (!newLanguage) {
    //        languages.push({name: value, nameSwedish: } as LanguageModel);
    //    }
    //
    //    dispatch(updateLanguages(languages));
    //}
}

function stateToProps({movie, baseData}) {
    return {
        movie,
        baseData
    };
}

export default connect(stateToProps)(FormatPanel);
