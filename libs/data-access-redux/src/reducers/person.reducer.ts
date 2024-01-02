import {
  ACTORS_ERROR,
  ACTORS_FETCHING,
  ACTORS_RECEIVED,
  ALL_PERSONS_ERROR,
  ALL_PERSONS_FETCHING,
  ALL_PERSONS_RECEIVED,
  CREW_ERROR,
  CREW_FETCHING,
  CREW_RECEIVED,
} from '../actions/person.actions';
import { createErrorMessageArray, McPayload } from './movie.reducer';
import { PersonRoleModel } from '../models/PersonRoleModel';
import { PersonStateModel } from '../models/state/person-state.model';
import {
  getFailedLoadingState,
  initialLoadingState,
  loadingLoadingState,
  successLoadingState,
} from '../models/state/loading.model';

export interface PersonActionProps {
  type: string;
  payload: PersonRoleModel[] | McPayload;
}

export default function personReducer(
  state: PersonStateModel = {
    actorsLoading: initialLoadingState,
    crewLoading: initialLoadingState,
    personsLoading: initialLoadingState,
    crewNotLoaded: true,
    personsNotLoaded: true,
  },
  { type, payload }: PersonActionProps
) {
  switch (type) {
    case ACTORS_FETCHING:
      return {
        ...state,
        actorsLoading: loadingLoadingState,
        actorsErrorMessages: undefined,
      };
    case ACTORS_RECEIVED:
      return {
        ...state,
        actors: payload,
        actorsLoading: successLoadingState,
        actorsErrorMessages: undefined,
      };
    case ACTORS_ERROR:
      // TODO: Implementera felhantering

      return {
        ...state,
        actors: [],
        actorsLoading: getFailedLoadingState(
          undefined,
          createErrorMessageArray(payload as McPayload)
        ),
      };
    case CREW_FETCHING:
      return {
        ...state,
        crewLoading: loadingLoadingState,
        crewNotLoaded: true,
      };
    case CREW_RECEIVED:
      return {
        ...state,
        crew: payload,
        crewLoading: successLoadingState,
        crewNotLoaded: false,
      };
    case CREW_ERROR:
      // TODO: Implementera felhantering

      return {
        ...state,
        crew: [],
        crewLoading: getFailedLoadingState(
          undefined,
          createErrorMessageArray(payload as McPayload)
        ),
        crewNotLoaded: false,
      };
    case ALL_PERSONS_FETCHING:
      return {
        ...state,
        personsLoading: loadingLoadingState,
        personsNotLoaded: true,
      };
    case ALL_PERSONS_RECEIVED:
      return {
        ...state,
        persons: payload,
        personsLoading: successLoadingState,
        personsNotLoaded: false,
      };
    case ALL_PERSONS_ERROR:
      // TODO: Implementera felhantering

      return {
        ...state,
        persons: [],
        personsLoading: getFailedLoadingState(
          undefined,
          createErrorMessageArray(payload as McPayload)
        ),
        personsNotLoaded: false,
      };
    default:
      return state;
  }
}
