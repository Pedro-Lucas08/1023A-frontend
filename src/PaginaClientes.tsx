import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PaginaClientes.css";

interface Cliente {
  id: number;
  nome: string;
  email: string;
}

function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Buscar clientes ao carregar a página
  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const resultado = await fetch("http://localhost:8000/clientes");
        if (resultado.ok) {
          const dados = await resultado.json();
          setClientes(dados);
        } else {
          const erro = await resultado.json();
          setMensagem(erro.mensagem || "Erro ao carregar clientes.");
        }
      } catch (erro) {
        setMensagem("Erro ao buscar clientes.");
      }
    };

    buscarClientes();
  }, []);

  // Cadastrar novo cliente
  const cadastrarCliente = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!nome || !email) {
      setMensagem("Nome e email são obrigatórios.");
      return;
    }

    const novoCliente = { nome, email };

    try {
      const resposta = await fetch("http://localhost:8000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCliente),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setClientes([...clientes, dados]);
        setMensagem("Cliente cadastrado com sucesso!");
        setNome("");
        setEmail("");
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem || "Erro ao cadastrar cliente.");
      }
    } catch (erro) {
      setMensagem("Erro ao cadastrar cliente.");
    }
  };

  return (
    <div>
      <header>
        <h1>Clientes</h1>
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
        {clientes.map((cliente) => (
          <div key={cliente.id} className="cliente-container">
            <div><strong>Nome:</strong> {cliente.nome}</div>
            <div><strong>Email:</strong> {cliente.email}</div>
          </div>
        ))}
      </section>

      <section className="container-clientes">
        <h2>Cadastrar Cliente</h2>
        <form onSubmit={cadastrarCliente}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input type="submit" value="Cadastrar" />
        </form>
      </section>
    </div>
  );
}

export default PaginaClientes;
