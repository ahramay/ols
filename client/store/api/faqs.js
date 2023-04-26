import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/cms/faqs";

export const loadFaqs = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const res = await http.get({ url: path });

      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};
