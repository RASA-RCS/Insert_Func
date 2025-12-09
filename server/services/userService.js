import User from "../models/User.js";

const saveUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

export default { saveUser };
