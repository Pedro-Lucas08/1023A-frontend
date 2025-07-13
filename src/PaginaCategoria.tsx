import { useState, useEffect } from "react";

interface Categoria {
    id: number;
    nome: string;
}

function PaginaCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [nome, setNome] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        const buscarCategorias = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/categorias");
                if (resultado.status === 200) {
                    const dados = await resultado.json();
                    setCategorias(dados);
                } else {
                    const erro = await resultado.json();
                    setMensagem(erro.mensagem);
                }
            } catch (erro) {
                setMensagem("Erro ao buscar categorias.");
            }
        };
        buscarCategorias();
    }, []);

    const cadastrarCategoria = async (event: React.FormEvent) => {
        event.preventDefault();
        const novaCategoria = { nome };
        try {
            const resposta = await fetch("http://localhost:8000/categorias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaCategoria)
            });
            if (resposta.status === 200) {
                const dados = await resposta.json();
                setCategorias([...categorias, dados]);
            } else {
                const erro = await resposta.json();
                setMensagem(erro.mensagem);
            }
        } catch (erro) {
            setMensagem("Erro ao cadastrar categoria.");
        }
    };

    return (
        <div>
            <h1>Categorias</h1>
            {mensagem && <div className="mensagem">{mensagem}</div>}

            <div className="container-listagem">
                {categorias.map((categoria) => (
                    <div key={categoria.id} className="categoria-container">
                        <div>{categoria.nome}</div>
                    </div>
                ))}
            </div>

            <div className="container-cadastro">
                <h2>Cadastrar Categoria</h2>
                <form onSubmit={cadastrarCategoria}>
                    <input type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
                    <input type="submit" value="Cadastrar" />
                </form>
            </div>
        </div>
    );
}

export default PaginaCategorias;
