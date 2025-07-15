import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// páginas
import Home from './Home';
import PaginaProdutos from './PaginaProdutos';
import PaginaCategorias from './PaginaCategoria';
import PaginaClientes from './PaginaClientes';
import Adm from './Adm';

function App() {
  return (
    <Router>
      <header>
        <div>Logo</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/categorias">Categorias</Link></li>
            <li><Link to="/clientes">Clientes</Link></li>
            <li><Link to="/adm">Adm</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<PaginaProdutos />} />
          <Route path="/categorias" element={<PaginaCategorias />} />
          <Route path="/clientes" element={<PaginaClientes />} />
          <Route path="/adm" element={<Adm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
