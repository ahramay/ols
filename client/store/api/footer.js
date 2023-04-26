import http from "../../services/http";
import { handleErrors } from "../../helpers/error";
import { setFooter, loadingFooter } from "../ui/footer";
const path = "/cms/footer";

export const loadFooter = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      dispatch(loadingFooter(true));
      const res = await http.get({ url: path });
      dispatch(setFooter(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(loadingFooter(false));
      if (onEnd) onEnd();
    }
  };
};
