import "./App.css";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Home from "./screens/Home";
// import Login from "../Login";
import Admin from "./screens/Admin";
import Success from "./screens/Success";

function App() {
  document.title = "ChopSticks";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} />
        {/* <Route path="/Login" element={<Login />} /> */}
        <Route path="/Admin" element={<Admin />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
