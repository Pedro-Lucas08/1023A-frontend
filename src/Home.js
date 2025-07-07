Import React fro m 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return(
        <div>
            <h1>Pagina Inicial</h1>
            <nav>
                <ul>
                    <li>
                        <link to="/produtos">Sobre</link>
                    </li>
                    <li>
                        <Link to="/adm">Contato</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Home;
