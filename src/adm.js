import React from 'react';
import { Link } from 'react-router-dom';

 const Adm = () => {
    return (
        <div>
            <h1>Página de Administração</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">ADM</Link>
                    </li>
                    <li>
                        <Link to="/">Retornar a pg inicial</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Adm;