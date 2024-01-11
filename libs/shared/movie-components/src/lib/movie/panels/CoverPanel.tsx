import '../movie.details.scss';
import { ChangeEvent } from 'react';
import { Loader } from '@giron/shared-ui-library';
import { IMovie } from '@giron/shared-models';
import { Control } from 'react-hook-form';

export const IMAGE_URL = `${
  process.env.NX_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
}image/`;

type Props = {
  movie?: IMovie;
  isLoading?: boolean;
  onMovieChange: (movie: IMovie) => void;
  control: Control<IMovie>;
  error?: string | Error | unknown;
  errors?: string[] | Error[];
  testName?: string;
};

// TODO: Slå kanske ihop med format-panelen (cover-info till höger i så fall).

export const CoverPanel = ({
  movie,
  isLoading = false,
  onMovieChange,
  control,
  error,
  errors,
  testName = 'CoverPanel_test',
}: Props) => {
  const movieFormatInfo = movie?.movieFormatInfo;
  const cover = movieFormatInfo ? movieFormatInfo.cover : undefined;

  const movieStateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    onMovieChange({
      ...movie,
      movieFormatInfo: {
        ...movieFormatInfo,
        cover: {
          ...cover,
          [name]: value, // cValue
        },
      },
    } as IMovie);
  };

  let content;

  if (error || errors) {
    // TODO: Fyll på
    //DialogComponent.openDefaultErrorDialog(this.dialog, movie.movieListErrorMessages);  // TODO: Implement error dialog handling.
    //alert(movieErrorMessages);

    content = <div>Ett fel inträffade</div>;
  } else if (isLoading || !movie || !cover) {
    // <loading-content [isLoading]="isLoading || isSaving" [showOverlay]="isSaving" loaderClass="fixed-loader" [loaderText]="isLoading ? 'Hämtar huvudman...' : 'Sparar huvudmannen...'">
    content = (
      <div>
        <Loader />
      </div>
    );
  } else {
    content = (
      <div className="panel-content cover-panel">
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
