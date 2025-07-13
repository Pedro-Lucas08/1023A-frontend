import { useState, useEffect } from "react";

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
                if (resultado.status === 200) {
                    const dados = await resultado.json();
                    setClientes(dados);
                } else {
                    const erro = await resultado.json();
                    setMensagem(erro.mensagem);
                }
            } catch (erro) {
                setMensagem("Erro ao buscar clientes.");
            }
        };
        buscarClientes();
    }, []);  // O array vazio faz o efeito rodar apenas uma vez após o primeiro render

    // Função para cadastrar um novo cliente
    const cadastrarCliente = async (event: React.FormEvent) => {
        event.preventDefault();

        // Verificando se o nome e email são válidos
        if (!nome || !email) {
            setMensagem("Nome e email são obrigatórios.");
            return;
        }

        const novoCliente = { nome, email };
        try {
            const resposta = await fetch("http://localhost:8000/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoCliente)
            });
            
            // Verificando a resposta da API
            if (resposta.ok) {  // `.ok` é uma forma mais segura de verificar status
                const dados = await resposta.json();
                setClientes((clientesAnterior) => [...clientesAnterior, dados]); // Atualizando estado corretamente
                setMensagem(""); // Limpar mensagem de erro
                setNome(""); // Limpar o nome após cadastro
                setEmail(""); // Limpar o email após cadastro
            } else {
                const erro = await resposta.json();
                setMensagem(erro.mensagem);
            }
        } catch (erro) {
            setMensagem("Erro ao cadastrar cliente.");
        }
    };

    return (
        <div>
            <h1>Clientes</h1>
            {mensagem && <div className="mensagem">{mensagem}</div>}

            <div className="container-listagem">
                {clientes.map((cliente) => (
                    <div key={cliente.id} className="cliente-container">
                        <div>{cliente.nome}</div>
                        <div>{cliente.email}</div>
                    </div>
                ))}
            </div>

            <div className="container-cadastro">
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
            </div>
        </div>
    );
}

export default PaginaClientes;
