import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import { loadingFooterLinks, setFooterLinks } from "../ui/footerLinks";
const path = "/cms/footer_links";

export const getFooterMenus = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      dispatch(loadingFooterLinks(true));
      const storeState = getState();
      const { token } = storeState.auth;

      const res = await http.get({
        url: path,
        headers: {
          "x-auth-token": token,
        },
      });

      console.log("Footer MENUSSS => ", res.data.data);
      dispatch(setFooterLinks(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
      dispatch(loadingFooterLinks(false));
    }
  };
};
