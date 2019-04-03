import {FETCH_TOPOLOGY_BEGIN, FETCH_TOPOLOGY_SUCCESS, FETCH_TOPOLOGY_FAILURE} from "../constants";

const initialState = {
    items: [],
    loading: false,
    error: null
}

export default function topoReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TOPOLOGY_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_TOPOLOGY_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload.topology
            };
        case FETCH_TOPOLOGY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                items: []
            }
        default:
            return state
    }

};
