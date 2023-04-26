import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/trial_requests";

export const requestTrialApi = ({ body = {}, onSuccess, onError, onEnd }) => {
  return async (dispatch, getState) => {
    try {
      const res = await http.post({
        url: path,
        body,
      });
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      if (onEnd) onEnd();
    }
  };
};
