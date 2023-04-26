import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

//entities
import {
  loadingBlogCategories,
  setBlogCategories,
} from "../entities/blogCategories";
//UI

//http path
const path = "/blogs_categories";

export const loadBlogCategories = ({ onSuccess, onError } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.categories;
      if (loading) return;

      dispatch(loadingBlogCategories(true));

      const res = await http.get({
        url: path,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(setBlogCategories(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(loadingBlogCategories(false));
    }
  };
};
