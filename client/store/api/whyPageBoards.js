import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

const path = "/cms/why_out_class_list";

export const loadWhyPageBoards = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      const res = await http.get({ url: path });
      const { data } = res.data;

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
