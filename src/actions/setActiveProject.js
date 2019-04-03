import {SET_PROJECT} from "../constants";

export const setProject = (url) => {
    const action = {
        type: SET_PROJECT,
        url
    };
    console.log('action in setProject', action);
    return action;
};
