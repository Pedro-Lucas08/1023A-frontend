import React from 'react';
import { Link } from 'react-router-dom';

const Adm = () => (
  <div>
    <h1>Página de Administração</h1>

    <nav>
      <ul>
        <li>
          {/* permanece na própria rota, só como exemplo */}
          <Link to="/adm">ADM</Link>
        </li>
        <li>
          <Link to="/">Retornar à página inicial</Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Adm;
