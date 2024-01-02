import { ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';

import '../movie.details.scss';

import { Loader } from '@giron/shared-ui-library';
import { IMovie, MovieStateModel, updateMovieState } from '@giron/data-access-redux';
import { environment } from '../../../../../../apps/movie-center-web-redux/src/env/environment';

export const IMAGE_URL = `${environment.apiBaseUrl}image/`;

interface CoverPanelProps {
  movie: MovieStateModel;
  dispatch: (any: unknown) => void;
  testName?: string;
}

// TODO: Slå kanske ihop med format-panelen (cover-info till höger i så fall).

const CoverPanel = ({
  movie,
  dispatch,
  testName = 'CoverPanel_test',
}: CoverPanelProps) => {
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  useEffect(() => {
    setIsMovieLoading(!movie?.movieLoading || movie.movieLoading.loading);
  }, [movie]);

  const { movieItem, movieLoading } = movie;
  const movieFormatInfo = movieItem?.movieFormatInfo;
  const cover = movieFormatInfo ? movieFormatInfo.cover : undefined;

  const movieStateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // let cValue = value;

    //if (name === 'format') {
    //    const {formats} = this.props.baseData;
    //
    //    cValue = formats.find((f: SelectableModel) => f.code === value);
    //}

    dispatch(
      updateMovieState({
        ...movieItem,
        movieFormatInfo: {
          ...movieFormatInfo,
          cover: {
            ...cover,
            [name]: value, // cValue
          },
        },
      } as IMovie)
    );
  };

  let content;

  if (movieLoading?.errors) {
    // TODO: Fyll på
    //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = <div></div>;
  } else if (isMovieLoading || !movieItem || !cover) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    content = (
      <div className="cover-panel">
        <div className="labelled-input">
          <label htmlFor="foregroundUrl">Förgrundsbild:</label>
          {cover.fgFileName ? (
            <img
              src={IMAGE_URL + cover.fgFileName}
              alt="Förgrundsbild"
              className="cover-image"
            />
          ) : (
            <>
              {cover.foregroundUrl && (
                <img src={cover.foregroundUrl} alt="Förgrundsbild" />
              )}
              <input
                className="text-input-field"
                type="text"
                id="foregroundUrl"
                name="foregroundUrl"
                defaultValue={cover.foregroundUrl}
                onBlur={movieStateChanged}
              />
            </>
          )}
        </div>

        <div className="labelled-input">
          <label htmlFor="backgroundUrl">Bakgrundsbild:</label>
          {cover.bgFileName ? (
            <img
              src={IMAGE_URL + cover.bgFileName}
              alt="Bakgrundsbild"
              className="cover-image"
            />
          ) : (
            <>
              {cover.backgroundUrl && (
                <img src={cover.backgroundUrl} alt="Bakgrundsbild" />
              )}
              <input
                className="text-input-field"
                type="text"
                id="backgroundUrl"
                name="backgroundUrl"
                defaultValue={cover.backgroundUrl}
                onBlur={movieStateChanged}
              />
            </>
          )}
        </div>
      </div>
    );

    // TODO: Inför file-upload-dialog, som i SBR2.
  }

  return <div data-test-name={testName}>{content}</div>;
};

// const getImageUrl = (image: Uint32Array) => {
//   const blob = new Blob([image], { type: 'image/jpeg' });
//   // return URL.createObjectURL(blob);
//   return `data:image/jpeg;base64,${image}`;
// };
//
// function toDataURL(img: ArrayBuffer, contentType = 'image/jpeg') {
//   const image = btoa(
//     new Uint32Array(img).reduce(
//       (data, byte) => data + String.fromCharCode(byte),
//       ''
//     )
//   );
//   return `data:${contentType};base64,${image}`;
// }

function stateToProps({ movie }: { movie: MovieStateModel }) {
  return {
    movie,
  };
}

export default connect(stateToProps)(CoverPanel);
