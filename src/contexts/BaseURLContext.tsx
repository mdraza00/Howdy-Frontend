import { createContext } from "react";

type BaseURLContextType = {
  baseUrl: string;
  imageUrl: string;
};
const Context = createContext<BaseURLContextType>({
  baseUrl: `http://192.168.116.164:3000/api`,
  imageUrl: `http://192.168.116.164:3000`,
});
export default Context;
