import axios from "axios";
import { apiPath } from "../configs";

const post = ({
  url = "",
  body = {},
  headers = {},
  queryParams = {},
  otherConfigs = {},
}) => {
  return axios.post(apiPath + url, body, {
    headers,
    params: queryParams,
    ...otherConfigs,
  });
};

const put = ({
  url = "",
  body = {},
  headers = {},
  queryParams = {},
  otherConfigs = {},
}) => {
  return axios.put(apiPath + url, body, {
    headers,
    params: queryParams,
    ...otherConfigs,
  });
};

const get = ({
  url = "",
  headers = {},
  queryParams = {},
  otherConfigs = {},
}) => {
  return axios.get(apiPath + url, {
    headers,
    params: queryParams,
    ...otherConfigs,
  });
};

const deleteRequest = ({
  url = "",
  headers = {},
  queryParams = {},
  otherConfigs = {},
}) => {
  return axios.delete(apiPath + url, {
    headers,
    params: queryParams,
    ...otherConfigs,
  });
};

export default {
  get,
  post,
  put,
  delete: deleteRequest,
};
