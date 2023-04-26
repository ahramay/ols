import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/cms/about_us_cms_data";

import { setAboutData, setAboutLoader } from "../ui/aboutPage";

export const loadAbouPageCMS = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      dispatch(setAboutLoader(true));
      const res = await http.get({ url: path });
      const { data } = res.data;

      dispatch(setAboutData(data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing

      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(setAboutLoader(false));
      if (onEnd) onEnd();
    }
  };
};
