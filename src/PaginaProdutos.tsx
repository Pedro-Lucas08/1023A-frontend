import { useEffect, useState } from "react";
import './PaginaProdutos.css';

interface Produto {
    id: number;
    nome: string;
    preco: number;
    categoria: string;
}

function PaginaProdutos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("");
    const [mensagem, setMensagem] = useState("");

    // Buscar produtos ao carregar a página
    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/produtos");
                if (resultado.ok) {
                    const dados = await resultado.json();
                    setProdutos(dados);
                } else {
                    const erro = await resultado.json();
                    setMensagem(erro.mensagem || "Erro ao carregar produtos.");
                }
            } catch (erro) {
                setMensagem("Erro ao buscar produtos.");
            }
        };

        buscarProdutos();
    }, []);

    // Cadastrar novo produto
    const cadastrarProduto = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!id || !nome || !preco || !categoria) {
            setMensagem("Preencha todos os campos.");
            return;
        }

        const novoProduto: Produto = {
            id: Number(id),
            nome,
            preco: Number(preco),
            categoria
        };

        try {
            const resposta = await fetch("http://localhost:8000/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoProduto)
            });

            if (resposta.ok) {
                const dados = await resposta.json();
                setProdutos([...produtos, dados]);
                setMensagem("Produto cadastrado com sucesso!");

                // Limpar formulário
                setId("");
                setNome("");
                setPreco("");
                setCategoria("");
            } else {
                const erro = await resposta.json();
                setMensagem(erro.mensagem || "Erro ao cadastrar produto.");
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
                        <div><strong>Nome:</strong> {produto.nome}</div>
                        <div><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</div>
                        <div><strong>Categoria:</strong> {produto.categoria}</div>
                    </div>
                ))}
            </div>

            <div className="container-produtos">
                <h2>Cadastrar Produto</h2>
                <form onSubmit={cadastrarProduto}>
                    <input
                        type="text"
                        placeholder="ID"
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
                        step="0.01"
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
