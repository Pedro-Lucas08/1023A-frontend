import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaginaProdutos from './PaginaProdutos';
import PaginaCategorias from './PaginaCategoria';
import PaginaClientes from './PaginaClientes';

function App() {
  return (
    <Router>
      <div>
        <header>
          <div>Logo</div>
          <nav>
            <ul>
              <li><Link to="/">Produtos</Link></li>
              <li><Link to="/categorias">Categorias</Link></li>
              <li><Link to="/clientes">Clientes</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PaginaProdutos />} />
            <Route path="/categorias" element={<PaginaCategorias />} />
            <Route path="/clientes" element={<PaginaClientes />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
