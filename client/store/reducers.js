import { combineReducers } from "redux";

import auth from "./auth/authReducer";
import ui from "./ui/uiReducer";
import entities from "./entities/entitiesReducer";

export default combineReducers({ auth, ui, entities });
