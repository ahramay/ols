import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import { setHowToPayLoader, setHowToPayData } from "../ui/howToPayPage";
const path = "/cms/how_to_pay";

export const getHowToPay = ({ onSuccess, onError, onEnd } = {}) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setHowToPayLoader(true));

      const res = await http.get({ url: path });
      dispatch(setHowToPayData(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      console.log("Error => ", err);
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(setHowToPayLoader(true));
      if (onEnd) onEnd();
    }
  };
};
