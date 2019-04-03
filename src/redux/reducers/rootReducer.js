import { combineReducers } from "redux";
import topology from "./topoReducer";
import activeProject from "./activeProjectReducer"
import graph from './graphReducer'

export default combineReducers({
    topology, activeProject, graph
});
