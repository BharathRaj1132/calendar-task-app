import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesComponent from "./components/RoutesComponent";

export default function App() {
  return (
    <BrowserRouter>
      <RoutesComponent />
    </BrowserRouter>
  );
}
