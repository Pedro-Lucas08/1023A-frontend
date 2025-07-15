import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Página Inicial</h1>

    <nav>
      <ul>
        <li>
          <Link to="/produtos">Produtos</Link>
        </li>
        <li>
          <Link to="/adm">Administração</Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Home;
