const Joi = require("joi");
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  // },
  // desc: {
  //   type: String,
  // },
  banner: {
    type: String,
  },
  image: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports.Result = mongoose.model("result", resultSchema);

// module.exports.validateResult = (data) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     desc: Joi.string().required(),
//   });
//   return schema.validate(data);
// };
