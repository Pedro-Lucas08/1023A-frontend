import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PaginaCategoria.css";

interface Categoria {
  id: number;
  nome: string;
}

function PaginaCategoria() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Buscar categorias ao carregar a página
  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const resultado = await fetch("http://localhost:8000/categorias");
        if (resultado.ok) {
          const dados = await resultado.json();
          setCategorias(dados);
        } else {
          const erro = await resultado.json();
          setMensagem(erro.mensagem || "Erro ao carregar categorias.");
        }
      } catch (erro) {
        setMensagem("Erro ao buscar categorias.");
      }
    };

    buscarCategorias();
  }, []);

  // Cadastrar nova categoria
  const cadastrarCategoria = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nome.trim()) {
      setMensagem("O nome da categoria é obrigatório.");
      return;
    }

    const novaCategoria = { nome };

    try {
      const resposta = await fetch("http://localhost:8000/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCategoria),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setCategorias([...categorias, dados]);
        setNome("");
        setMensagem("Categoria cadastrada com sucesso!");
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao cadastrar categoria.");
      }
    } catch (erro) {
      setMensagem("Erro ao cadastrar categoria.");
    }
  };

  return (
    <div>
      <header>
        <h1>Categorias</h1>
        <nav>
          <ul>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/categorias">Categorias</Link></li>
            <li><Link to="/clientes">Clientes</Link></li>
          </ul>
        </nav>
      </header>

      {mensagem && (
        <div className="mensagem">
          <p>{mensagem}</p>
        </div>
      )}

      <section className="container-listagem">
        {categorias.map((categoria) => (
          <div key={categoria.id} className="categoria-container">
            <div>{categoria.nome}</div>
          </div>
        ))}
      </section>

      <section className="container-categoria">
        <h2>Cadastrar Categoria</h2>
        <form onSubmit={cadastrarCategoria}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input type="submit" value="Cadastrar" />
        </form>
      </section>
    </div>
  );
}

export default PaginaCategoria;
