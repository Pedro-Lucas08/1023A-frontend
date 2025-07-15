import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importações corretas com base nos seus arquivos:
import Home from "../Home"; // Home.js
import Produtos from "../PaginaProdutos"; // PaginaProdutos.tsx
import Adm from "../Adm"; // Adm.js

const Rotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/adm" element={<Adm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Rotas;