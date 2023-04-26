import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import { loadingCommonData, setCommonData } from "../ui/commonData";
const path = "/cms/common_site_data";

export const loadCommonData = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      dispatch(loadingCommonData(true));
      const res = await http.get({ url: path });
      dispatch(setCommonData(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(loadingCommonData(false));
      if (onEnd) onEnd();
    }
  };
};
