import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import  ImageUploader  from "./pages/color_picker.js"

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<ImageUploader />} />
      </Routes>
   </Router>
  );
}

export default App;
