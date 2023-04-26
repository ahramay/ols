function store(key, value) {
  if (typeof value === "object") value = JSON.stringify(value);
  localStorage.setItem(key, value);
}

function get(key) {
  let data = localStorage.getItem(key);
  if (!data) return "";
  try {
    data = JSON.parse(data);
  } catch (e) {
    data = data;
  }
  return data;
}

function remove(key) {
  localStorage.removeItem(key);
}

export default {
  store,
  get,
  remove,
};
