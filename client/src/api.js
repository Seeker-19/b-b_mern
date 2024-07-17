import axios from "axios";
import { server } from "./main";

export const getToken = async () => {
  try {
    const { data } = await axios.get(`${server}/gettoken`, {
      withCredentials: true,
    });

    //console.log(token);

    if (data?.token) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    //console.log(error);
    return false;
  }
};
