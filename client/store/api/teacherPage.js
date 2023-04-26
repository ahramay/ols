import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

import {
  setOurTeachersLoader,
  setOurTeachersData,
} from "../ui/ourTeachersPage";
const path = "/cms/teacher_page_cms_data";

export const loadTeacherPageCMS = ({
  body = {},
  onSuccess,
  onError,
  onEnd,
} = {}) => {
  return async (dispatch, getState) => {
    try {
      //showing loader on ui
      setOurTeachersLoader(true);
      const res = await http.get({ url: path });
      const { data } = res.data;
      dispatch(setOurTeachersData(data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing

      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      setOurTeachersLoader(true);
      if (onEnd) onEnd();
    }
  };
};
