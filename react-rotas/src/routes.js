import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Produtos from "./components/Home";
import Home from "./components/About";
import adm from "./components/NotFound";

const Rotas = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/produtos" component={Produtos} />
      <Route path="/adm" component={adm} />
    </BrowserRouter>
  );
}

export default Rotas;