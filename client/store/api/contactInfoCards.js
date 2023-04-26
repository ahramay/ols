import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/cms/contact_us_info_cards";

export const loadInfoCards = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const res = await http.get({ url: path });

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
