import { Route, Routes } from "react-router-dom";
import LoginSignup from "./Component/LoginSignup";
import HomePage from "./Pages/HomePage";
import Protected from "./Component/Protected";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Protected Component={HomePage} />} />
        <Route path="/login-signup" element={<LoginSignup />} />
      </Routes>
    </div>
  );
}

export default App;
