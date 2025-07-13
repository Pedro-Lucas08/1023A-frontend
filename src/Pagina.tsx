import { useEffect, useState } from "react";
import './Pagina.css';

interface Produto {
    id: number;
    nome: string;
    preco: number;
    categoria: string;
}

function Pagina() {
    // Estado para os campos do formulário e para os produtos
    const [formData, setFormData] = useState({
        id: "",
        nome: "",
        preco: "",
        categoria: "",
    });
    const [mensagem, setMensagem] = useState("");
    const [produtos, setProdutos] = useState<Produto[]>([]);

    // Função para buscar os produtos do backend
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

    // Função para tratar o envio do formulário
    async function handleCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Validação simples
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
                setFormData({
                    id: "",
                    nome: "",
                    preco: "",
                    categoria: "",
                }); // Limpar os campos após cadastro
            } else {
                const erro = await resposta.json();
                setMensagem(erro.mensagem);
            }
        } catch (erro) {
            setMensagem("Erro ao cadastrar produto.");
        }
    }

    // Função para tratar as mudanças nos inputs do formulário
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    return (
        <>
            <header>
                <div>Logo</div>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/">Produtos</a></li>
                        <li><a href="/">Relatórios</a></li>
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
                    {produtos.map(produto => (
                        <div className="produto-container" key={produto.id}>
                            <div className="produto-nome">{produto.nome}</div>
                            <div className="produto-preco">{produto.preco}</div>
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
                            id="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="ID"
                        />
                        <input
                            type="text"
                            name="nome"
                            id="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Nome"
                        />
                        <input
                            type="number"
                            name="preco"
                            id="preco"
                            value={formData.preco}
                            onChange={handleChange}
                            placeholder="Preço"
                        />
                        <input
                            type="text"
                            name="categoria"
                            id="categoria"
                            value={formData.categoria}
                            onChange={handleChange}
                            placeholder="Categoria"
                        />
                        <input type="submit" value="Cadastrar" />
                    </form>
                </div>
            </main>
            <footer></footer>
        </>
    );
}

export default Pagina;
