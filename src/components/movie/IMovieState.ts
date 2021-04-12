import {IAbstractFormState} from "../common/FormComponent";

export interface IMovieState extends IAbstractFormState {
    movieId: number,  // TODO: Behövs denna?
    activeInfoPanel: string
}
