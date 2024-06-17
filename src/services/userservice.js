import ConfigBase from "./config";

const userRegisterService = async (user) => {
  try {
    const response = await ConfigBase.post("/User/register", user);
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};

const userLoginService = async (user) => {
  try {
    const response = await ConfigBase.post("/User/login", user);
    const data = await response.data;
    return data;
  } catch (error) {
    return error;
  }
};

export { userRegisterService, userLoginService };
