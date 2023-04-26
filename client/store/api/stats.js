import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/cms/stats_slider";

export const loadStats = ({ body = {}, onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
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
