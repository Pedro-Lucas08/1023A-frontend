import { useEffect, useState } from "react";
import './Pagina.css';
import { Link } from "react-router-dom";

// Definição da interface Produto
interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoriaId: number | null; // correto
  
}



export default function PaginaProdutos() {
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    preco: "",
    categoria: "",
  });
  
  const [mensagem, setMensagem] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Carregar produtos ao iniciar a página
  useEffect(() => {
    const buscaDados = async () => {
      try {
        const resultado = await fetch("http://localhost:8000/produtos");
        if (resultado.ok) {
          const dados = await resultado.json();
          setProdutos(dados);
        } else {
          const erro = await resultado.json();
          setMensagem(erro.mensagem);
        }
      } catch (erro) {
        setMensagem("Erro ao carregar produtos.");
      }
    };
    buscaDados();
  }, []);

  // Manipula o envio do formulário
  async function handleCadastro(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.nome || !formData.preco || !formData.categoria) {
      setMensagem("Todos os campos são obrigatórios.");
      return;
    }

    const novoProduto: Produto = {
      id: parseInt(formData.id),
      nome: formData.nome,
      preco: parseFloat(formData.preco),
      categoria: formData.categoria,
    };

    try {
      const resposta = await fetch("http://localhost:8000/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoProduto),
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setProdutos([...produtos, dados]);
        setFormData({ id: "", nome: "", preco: "", categoria: "" });
        setMensagem("Produto cadastrado com sucesso!");
      } else {
        const erro = await resposta.json();
        setMensagem(erro.mensagem);
      }
    } catch (erro) {
      setMensagem("Erro ao cadastrar produto.");
    }
  }

  // Manipula mudança nos inputs
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <>
      <header>
        <div>Logo</div>
        <nav>
          <ul>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/categorias">Categorias</Link></li>
            <li><Link to="/clientes">Clientes</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        {mensagem && (
          <div className="mensagem">
            <p>{mensagem}</p>
          </div>
        )}

        {/* Listagem de Produtos */}
        <div className="container-listagem">
          {produtos.map((produto) => (
            <div className="produto-container" key={produto.id}>
              <div className="produto-nome">{produto.nome}</div>
              <div className="produto-preco">R$ {produto.preco.toFixed(2)}</div>
              <div className="produto-categoria">{produto.categoria}</div>
            </div>
          ))}
        </div>

        {/* Formulário de Cadastro */}
        <div className="container-cadastro">
          <form onSubmit={handleCadastro}>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="ID"
            />
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome"
            />
            <input
              type="number"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              placeholder="Preço"
            />
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Categoria"
            />
            <input type="submit" value="Cadastrar" />
          </form>
        </div>
      </main>
    </>
  );
}
