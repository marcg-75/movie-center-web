import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';
import LabelledTextInput from '../inputs/LabelledTextInput';
import LabelledSelect from '../inputs/LabelledSelect';
import { updateMovieState } from '../../../actions/movie.actions';
import MovieModel from '../../../models/MovieModel';
import SelectableModel from "../../../models/SelectableModel";
import LanguageModel from "../../../models/LanguageModel";
import { MovieStateModel } from '../../../actions/models/movie-state.model';
import { BaseDataStateModel } from '../../../actions/models/base-data-state.model';

const REGIONS: Array<number> = [1, 2, 3, 4, 5, 6];
const regionOptions: Array<any> = REGIONS.map((r: number, i: number) => {
    return <option key={i + 1} value={r}>{r}</option>;
});
regionOptions.unshift(<option key="0" value=""></option>);

const SYSTEMS: Array<string> = ['PAL', 'NTSC'];
const systemOptions: Array<any> = SYSTEMS.map((s: string, i: number) => {
    return <option key={i + 1} value={s}>{s}</option>;
});
systemOptions.unshift(<option key="0" value=""></option>);

interface FormatPanelProps {
    movie: MovieStateModel;
    baseData: BaseDataStateModel;
    dispatch: (any: any) => void;
    testName?: string;
}

const FormatPanel = ({movie, baseData, dispatch, testName = 'FormatPanel_test'}: FormatPanelProps) => {

    const [isMovieLoading, setIsMovieLoading] = useState(false);
    const [isBaseDataLoading, setIsBaseDataLoading] = useState(false);

    useEffect(() => {
        setIsMovieLoading(!movie || movie.movieNotLoaded || movie.movieCreating || movie.movieUpdating || movie.movieDeleting);
        setIsBaseDataLoading(!baseData || !(baseData.formatsLoaded && baseData.languagesLoaded));
    }, [movie, baseData]);

    const {movieItem, movieErrorMessages} = movie;
    const {formats, languages} = baseData;
    const {movieFormatInfo} = movieItem;

    const movieStateChanged = (event: any) => {
        const {name, value} = event.target;

        let cValue = value;

        if (name === 'format') {
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
    };

    const audioLanguagesChanged = (event: any) => {
        const audioLanguages: Array<LanguageModel> = getSelectedLanguages(event);

        dispatch(updateMovieState({
            ...movieItem,
            movieFormatInfo: {
                ...movieFormatInfo,
                audioLanguages
            }
        } as MovieModel));
    };

    const subtitlesChanged = (event: any) => {
        const subtitles: Array<LanguageModel> = getSelectedLanguages(event);

        dispatch(updateMovieState({
            ...movieItem,
            movieFormatInfo: {
                ...movieFormatInfo,
                subtitles
            }
        } as MovieModel));
    };

    const getSelectedLanguages = (event: any): Array<LanguageModel> => {
        const {selectedOptions} = event.target;
        const chosenLanguages: Array<LanguageModel> = [];

        for (let i = 0; i < selectedOptions.length; i++) {
            let option: any = selectedOptions[i];
            let lang: LanguageModel = languages.find((l: LanguageModel) => l.id === parseInt(option.value, 10));

            if (lang) {
                chosenLanguages.push(lang);
            }
        }
        return chosenLanguages;
    };

    // TODO: Move to admin page.
    //languageAdded(event: any) {
    //    const {dispatch} = props;
    //    let {languages} = props.baseData;
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

    let content;

    if (movieErrorMessages) {  // TODO: Fyll på
        //DialogComponent.openDefaultErrorDialog(dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
        //alert(movieErrorMessages);

        content = (<div></div>);
    } else if (isMovieLoading || !movieItem || isBaseDataLoading || !movieFormatInfo.format) {
        // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
        content = (<div><Loader/></div>);
    } else {
        const formatOptions = formats.map((option: SelectableModel, i: number) => {
            return <option key={i + 1} value={option.code}>{option.name}</option>;
        });
        formatOptions.unshift(<option key="0" value=""></option>);

        const languageOptions = languages.map((option: LanguageModel, i: number) => {
            return <option key={i + 1} value={option.id}>{option.nameSwedish}</option>;
        });
        languageOptions.unshift(<option key="0" value=""></option>);

        const currentAudioLanguageIds: Array<string> = movieFormatInfo.audioLanguages
            ? movieFormatInfo.audioLanguages.map((lang: LanguageModel) => '' + lang.id) : [];

        const currentSubtitleIds: Array<string> = movieFormatInfo.subtitles
            ? movieFormatInfo.subtitles.map((lang: LanguageModel) => '' + lang.id) : [];

        content = (
            <div>
                <LabelledSelect label="Format: *" id="format" defaultValue={undefined}
                                value={movieFormatInfo.format.code} options={formatOptions} callback={movieStateChanged}
                                required={true} multiple={false}/>

                <LabelledTextInput label="UPC-ID:" id="upcId" defaultValue={movieFormatInfo.upcId}
                                   callback={movieStateChanged}/>

                <LabelledSelect label="Region:" id="region" defaultValue={undefined} value={movieFormatInfo.region}
                                options={regionOptions} callback={movieStateChanged} required={false} multiple={false}/>

                <LabelledTextInput label="Antal skivor:" id="discs" defaultValue={movieFormatInfo.discs}
                                   callback={movieStateChanged}/>

                <LabelledTextInput label="Bildformat:" id="pictureFormat" defaultValue={movieFormatInfo.pictureFormat}
                                   callback={movieStateChanged}/>

                <LabelledSelect label="System:" id="system" defaultValue={undefined} value={movieFormatInfo.system}
                                options={systemOptions} callback={movieStateChanged} required={false} multiple={false}/>

                <LabelledSelect label="Språk:" id="audioLanguages" defaultValue={undefined}
                                value={currentAudioLanguageIds} options={languageOptions}
                                callback={audioLanguagesChanged} required={false} multiple={true}/>

                <LabelledSelect label="Undertexter:" id="subtitles" defaultValue={undefined} value={currentSubtitleIds}
                                options={languageOptions} callback={subtitlesChanged} required={false} multiple={true}/>
            </div>
        );
    }

    //{// TODO: Flytta till admin-vy
    //    environment.enableMovieFormatEdit && (
    //        <LabelledTextInput label="Add new language to select:" id="newLanguage" defaultValue={undefined} callback={languageAdded} />
    //    )}

    return (
        <div data-test-name={testName}>{content}</div>
    );
}

function stateToProps({movie, baseData}) {
    return {
        movie,
        baseData
    };
}

export default connect(stateToProps)(FormatPanel);
