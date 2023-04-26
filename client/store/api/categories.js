import http from "../../services/http";
import { handleErrors } from "../../helpers/error";

//entities
import { loadingCategories, setCategories } from "../entities/categories";
//UI

//http path
const path = "/categories";
// http.get('/categories/list', {'x-auth-token': xAuthToken});
export const loadCategories = ({ onSuccess, onError } = {}) => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { entities, auth } = store;

      const { loading } = entities.categories;
      if (loading) return;

      dispatch(loadingCategories(true));

      const res = await http.get({
        url: path,
        headers: {
          "x-auth-token": auth.token,
        },
      });

      dispatch(setCategories(res.data.data));
      //onSuccess event firing
      if (onSuccess) onSuccess(res);
    } catch (err) {
      //onError event firing
      if (onError) onError(err);
      else handleErrors(err);
    } finally {
      dispatch(loadingCategories(false));
    }
  };
};
