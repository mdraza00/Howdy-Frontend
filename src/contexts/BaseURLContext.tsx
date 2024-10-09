import { createContext } from "react";

type BaseURLContextType = {
  baseUrl: string;
};
const Context = createContext<BaseURLContextType>({
  baseUrl: `http://192.168.116.164:3000`,
});
export default Context;
