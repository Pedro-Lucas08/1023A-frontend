import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaginaProdutos from './PaginaProdutos';
import PaginaCategoria from './PaginaCategoria';
import PaginaClientes from './PaginaClientes';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PaginaProdutos />} />
      <Route path="/produtos" element={<PaginaProdutos />} />
      <Route path="/categorias" element={<PaginaCategoria />} />
      <Route path="/clientes" element={<PaginaClientes />} />
    </Routes>
  );
}
