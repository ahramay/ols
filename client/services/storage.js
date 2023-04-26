function store(key, value) {
  if (typeof value === "object") value = JSON.stringify(value);
  if (typeof window !== "undefined") localStorage.setItem(key, value);
}

function get(key) {
  let data;
  if (typeof window !== "undefined") data = localStorage.getItem(key);
  else data = "";

  if (!data) return "";
  try {
    data = JSON.parse(data);
  } catch (e) {
    data = data;
  }
  return data;
}

function remove(key) {
  if (typeof window !== "undefined") localStorage.removeItem(key);
}

export default {
  store,
  get,
  remove,
};
