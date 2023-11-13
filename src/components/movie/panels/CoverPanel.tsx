import React from 'react';
import {connect} from 'react-redux';

import '../movie.details.scss';

import { Loader } from '../../common/loader/Loader';
import FormComponent from '../../common/FormComponent';
import { updateMovieState } from '../../../actions/movie.actions';
import MovieModel from '../../../models/MovieModel';
import {IMovieProps} from "../IMovieProps";
import {IMovieState} from "../IMovieState";

import {environment} from '../../../env/environment';

export const IMAGE_URL = `${environment.apiBaseUrl}image/`;

// TODO: Slå kanske ihop med format-panelen (cover-info till höger i så fall).

class CoverPanel extends FormComponent<IMovieProps, IMovieState> {  // TODO: Byta FormComponent mot Component?

    static defaultProps = {
        testName: 'CoverPanel_test'
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
        const cover = movieItem.movieFormatInfo ? movieItem.movieFormatInfo.cover: undefined;

        let content;

        if (movieErrorMessages) {  // TODO: Fyll på
            //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
            //alert(movieErrorMessages);

            content = (<div></div>);
        } else if (this.isMovieLoading || !movieItem || !cover) {
            // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
            content = (<div>
                <Loader />
            </div>);
        } else {
            content = (
                <div className="cover-panel">
                    <div className="labelled-input">
                        <label htmlFor="foregroundUrl">Förgrundsbild:</label>
                        {cover.fgFileName ?
                            (<img src={IMAGE_URL + cover.fgFileName} alt="Förgrundsbild" className="cover-image" />)
                            : (<>
                                    {cover.foregroundUrl && (<img src={cover.foregroundUrl} alt="Förgrundsbild"/>)}
                                    <input className="text-input-field" type="text" id="foregroundUrl"
                                           name="foregroundUrl"
                                           defaultValue={cover.foregroundUrl} onBlur={this.movieStateChanged}/>
                                </>
                            )
                        }
                    </div>

                    <div className="labelled-input">
                        <label htmlFor="backgroundUrl">Bakgrundsbild:</label>
                        {cover.bgFileName ? (<img src={IMAGE_URL + cover.bgFileName} alt="Bakgrundsbild" className="cover-image"/>)
                            : (
                                <>
                                    {cover.backgroundUrl && (<img src={cover.backgroundUrl} alt="Bakgrundsbild"/>)}
                                    <input className="text-input-field" type="text" id="backgroundUrl"
                                           name="backgroundUrl"
                                           defaultValue={cover.backgroundUrl} onBlur={this.movieStateChanged}/>
                                </>
                            )}
                    </div>
                </div>
            );

            // TODO: Inför file-upload-dialog, som i SBR2.
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
        const {movieFormatInfo} = movieItem;
        const {cover} = movieItem.movieFormatInfo;
        const {name, value} = event.target;
debugger;
        let cValue = value;

        //if (name === 'format') {
        //    const {formats} = this.props.baseData;
        //
        //    cValue = formats.find((f: SelectableModel) => f.code === value);
        //}

        dispatch(updateMovieState({
            ...movieItem,
            movieFormatInfo: {
                ...movieFormatInfo,
                cover: {
                    ...cover,
                    [name]: cValue
                }
            }
        } as MovieModel));
    }
}

const getImageUrl = (image: Uint32Array) => {
    const blob = new Blob([image], { type: 'image/jpeg' });
    // return URL.createObjectURL(blob);
    return `data:image/jpeg;base64,${image}`;
};

function toDataURL(img:ArrayBuffer, contentType = 'image/jpeg') {
    const image = btoa(
        new Uint32Array(img)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return `data:${contentType};base64,${image}`;
}

function stateToProps({movie}) {
    return {
        movie
    };
}

export default connect(stateToProps)(CoverPanel);
