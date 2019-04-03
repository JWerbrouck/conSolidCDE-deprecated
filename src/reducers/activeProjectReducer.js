import {SET_PROJECT} from "../constants";

const setActiveProject = (action) => {
    return {
        url: action.url,
        id: Math.random(),
    };
}

const initialState = {
    url: ''
}

const activeProject = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROJECT:
            return setActiveProject(action)
        default:
            return state
    }
}

export default activeProject
