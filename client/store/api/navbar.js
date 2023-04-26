import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import { loadingNavbarMenus, setNavbarMenus } from "../ui/navbarMenus";
const path = "/cms/navbar";

export const getNavbarMenus = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      dispatch(loadingNavbarMenus(true));
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.get({
        url: path,
        headers: {
          "x-auth-token": token,
        },
      });

      console.log("NAV MENUSSS => ", res.data.data);
      dispatch(setNavbarMenus(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingNavbarMenus(false));
    }
  };
};
