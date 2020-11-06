const bcrypt = require("bcryptjs");
const helpers = {};

helpers.encrypt = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  return hash;
};

helpers.matchPass = async (contra, savePass) => {
  try {
    return await bcrypt.compare(contra, savePass);
  } catch (e) {
    console.log("error match ", e);
  }
};
module.exports = helpers;
