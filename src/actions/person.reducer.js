import {
    ACTORS_FETCHING, ACTORS_RECEIVED, ACTORS_ERROR,
    CREW_FETCHING, CREW_RECEIVED, CREW_ERROR,
    ALL_PERSONS_FETCHING, ALL_PERSONS_RECEIVED, ALL_PERSONS_ERROR
} from './person.actions';
import {createErrorMessageArray} from './movie.reducer';

export default function personReducer(state = {
    actorsNotLoaded: true,
    crewNotLoaded: true,
    personsNotLoaded: true
}, {
    type,
    payload
    }) {
    switch (type) {
        case ACTORS_FETCHING:
            return {
                ...state,
                actorsNotLoaded: true,
                actorsErrorMessages: undefined
            };
        case ACTORS_RECEIVED:
            return {
                ...state,
                actors: payload,
                actorsNotLoaded: false,
                actorsErrorMessages: undefined
            };
        case ACTORS_ERROR:
            const actorsErrorMessages = createErrorMessageArray(payload);

            // TODO: Implementera felhantering

            return {
                ...state,
                actorsErrorMessages,
                actors: [],
                actorsNotLoaded: false
            };
        case CREW_FETCHING:
            return {
                ...state,
                crewNotLoaded: true,
                crewErrorMessages: undefined
            };
        case CREW_RECEIVED:
            return {
                ...state,
                crew: payload,
                crewNotLoaded: false,
                crewErrorMessages: undefined
            };
        case CREW_ERROR:
            const crewErrorMessages = createErrorMessageArray(payload);

            // TODO: Implementera felhantering

            return {
                ...state,
                crewErrorMessages,
                crew: [],
                crewNotLoaded: false
            };
        case ALL_PERSONS_FETCHING:
            return {
                ...state,
                personsNotLoaded: true,
                personsErrorMessages: undefined
            };
        case ALL_PERSONS_RECEIVED:
            return {
                ...state,
                persons: payload,
                personsNotLoaded: false,
                personsErrorMessages: undefined
            };
        case ALL_PERSONS_ERROR:
            const personsErrorMessages = createErrorMessageArray(payload);

            // TODO: Implementera felhantering

            return {
                ...state,
                personsErrorMessages,
                persons: [],
                personsNotLoaded: false
            };
        default:
            return state;
    }
}
