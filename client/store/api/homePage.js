import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import { setHomeLoader, setHomeData } from "../ui/homePage";

const path = "/cms/home_page_cms_data";

export const loadHomePageCMS = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      dispatch(setHomeLoader(true));
      const res = await http.get({ url: path });
      const { data } = res.data;
      dispatch(setHomeData(data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(setHomeLoader(false));
      if (onEnd) onEnd();
    }
  };
};
