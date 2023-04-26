import Joi from "joi-browser";
const validateSchema = (form, schema, errorMessages = {}) => {
  const result = Joi.validate(form, schema, {
    abortEarly: false,
    allowUnknown: true
  });

  if (result.error) {
    const formErrors = {};
    for (let e of result.error.details) {
      const path = e.path[0];
      const type = e.type;
      if (!formErrors[path]) {
        formErrors[path] =
          getCustomMessage(path, type, errorMessages) || e.message;
      }
    }
    return formErrors;
  }

  return null;
};

function getCustomMessage(path, type, messages) {
  if (!messages) return "";
  if (!messages[path]) return "";
  if (!messages[path][type]) return "";
  return messages[path][type];
}

export default validateSchema;
