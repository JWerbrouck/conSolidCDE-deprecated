import {FETCH_GRAPH_BEGIN, FETCH_GRAPH_FAILURE, FETCH_GRAPH_SUCCESS} from "../constants";

const initialState = {
    graph: '',
    loading: false,
    error: null
}

export default function topoReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_GRAPH_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_GRAPH_SUCCESS:
            console.log('graph is', action.payload.graph)
            return {
                ...state,
                loading: false,
                graph: action.payload.graph
            };

        case FETCH_GRAPH_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                graph: ''
            };
        default:
            return state
    }
};
