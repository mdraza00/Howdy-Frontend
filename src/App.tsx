import { Routes, Route } from "react-router-dom";
import LoginSignupContainer from "./components/LoginSignupContainer/LoginSignupContainer";
import BaseURLContext from "./contexts/BaseURLContext";
import Home from "./components/Home/Home";
function App() {
  return (
    <BaseURLContext.Provider
      value={{
        baseUrl: "http://192.168.182.164:3000/api",
        imageUrl: "http://192.168.182.164:3000",
      }}
    >
      {/* <BrowserRouter> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-signup" element={<LoginSignupContainer />} />
      </Routes>
      {/* </BrowserRouter> */}
    </BaseURLContext.Provider>
  );
}

export default App;
