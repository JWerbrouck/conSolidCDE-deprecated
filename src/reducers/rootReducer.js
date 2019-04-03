import { combineReducers } from "redux";
import topology from "./topoReducer";
import activeProject from "./activeProjectReducer"

export default combineReducers({
    topology, activeProject
});
