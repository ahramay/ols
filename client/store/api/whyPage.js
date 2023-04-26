import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import { setWhyLoader, setWhyData } from "../ui/whyPage";
const path = "/cms/why_out_class_cms_data";

export const loadWhyPageCMS = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      dispatch(setWhyLoader(true));
      const res = await http.get({ url: path });
      const { data } = res.data;
      dispatch(setWhyData(data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(setWhyLoader(false));
      if (onEnd) onEnd();
    }
  };
};
