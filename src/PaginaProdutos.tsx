import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Pagina.css';

interface Produto {
    id: number;
    nome: string;
    preco: number;
    categoria: string;
}

function PaginaProdutos() {
    const navigate = useNavigate(); // useNavigate para navegação
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("");
    const [mensagem, setMensagem] = useState("");

    // Fetch dos produtos
    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/produtos");
                if (resultado.status === 200) {
                    const dados = await resultado.json();
                    setProdutos(dados);
                } else {
                    const erro = await resultado.json();
                    setMensagem(erro.mensagem);
                }
            } catch (erro) {
                setMensagem("Erro ao buscar produtos.");
            }
        };
        buscarProdutos();
    }, []);

    // Função para cadastrar um novo produto
    const cadastrarProduto = async (event: React.FormEvent) => {
        event.preventDefault();
        const novoProduto = { id: parseInt(id), nome, preco: parseFloat(preco), categoria };
        try {
            const resposta = await fetch("http://localhost:8000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoProduto)
            });
            if (resposta.status === 200) {
                const dados = await resposta.json();
                setProdutos([...produtos, dados]);

                // Navegar para a página de produtos após o cadastro
                navigate("/produtos");
            } else {
                const erro = await resposta.json();
                setMensagem(erro.mensagem);
            }
        } catch (erro) {
            setMensagem("Erro ao cadastrar produto.");
        }
    };

    return (
        <div>
            <h1>Produtos</h1>
            {mensagem && <div className="mensagem">{mensagem}</div>}

            <div className="container-listagem">
                {produtos.map((produto) => (
                    <div key={produto.id} className="produto-container">
                        <div>{produto.nome}</div>
                        <div>{produto.preco}</div>
                        <div>{produto.categoria}</div>
                    </div>
                ))}
            </div>

            <div className="container-cadastro">
                <h2>Cadastrar Produto</h2>
                <form onSubmit={cadastrarProduto}>
                    <input
                        type="text"
                        placeholder="Id"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Preço"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    />
                    <input type="submit" value="Cadastrar" />
                </form>
            </div>
        </div>
    );
}

export default PaginaProdutos;
