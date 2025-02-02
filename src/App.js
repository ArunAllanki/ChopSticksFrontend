import "./App.css";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import Home from "./screens/Home";
// import Login from "../Login";
import Admin from "./screens/Admin";
import { createContext } from "react";
import Success from "./screens/Success";

const DataContext = createContext();

function App() {
  document.title = "ChopSticks"
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} />
        {/* <Route path="/Login" element={<Login />} /> */}
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
