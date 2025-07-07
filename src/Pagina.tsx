import { useEffect, useState } from "react";
import './Pagina.css';
import React from "react";
import  Produtos  from "./Pagina/Produtos";
import  adm  from "./Pagina/adm"
import Router from "./Routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Pagina() {
    return (
        <div>
            <Router />
        </div>
    )
}

const produtos = () => {
    retunr (
        <div>
            <h1>Produtos</h1>
            <Link to="/">retornar pagina inicial</Link>
        </div>
    )
interface ProdutosState {
    id: number,
    nome: string,
    preco: number,
    categoria: string
}

function Pagina() {
    const [id, setId] = useState("")
    const [nome, setNome] = useState("")
    const [preco, setPreco] = useState("")
    const [categoria, setCategoria] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [produtos, setProdutos] = useState<ProdutosState[]>([])
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/produtos")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setProdutos(dados)
                }
                if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
                    //console.log(erro.mensagem)
                }
            }
            catch (erro) {
                setMensagem("Fetch não functiona")
            }
        }
        buscaDados()
    }, [])// [] => significa as dependências do useEffects
    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        //Criar um novo produto
        const novoProduto: ProdutosState = {
            id: parseInt(id),
            nome: nome,
            preco: parseFloat(preco),
            categoria: categoria
        }
        try {
            const resposta = await fetch("http://localhost:8000/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoProduto)
            })
           
            if (resposta.status === 200) {
                const dados = await resposta.json()
                setProdutos([...produtos, dados])
            }
            if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
                //console.log(erro.mensagem)
            }
            
        }
        catch (erro) {
            setMensagem("Fetch não functiona")
        }

    }
    function trataId(event: React.ChangeEvent<HTMLInputElement>) {
        setId(event.target.value)
    }
    function trataNome(event: React.ChangeEvent<HTMLInputElement>) {
        setNome(event.target.value)
    }
    function trataPreco(event: React.ChangeEvent<HTMLInputElement>) {
        setPreco(event.target.value)
    }
    function trataCategoria(event: React.ChangeEvent<HTMLInputElement>) {
        setCategoria(event.target.value)
    }
    return (
        <>
            <header>
                <div>Logo</div>
                <nav>
                    <ul>
                        <li>
                            <a href="">Produtos</a>
                        </li>
                        <li>
                            <a href="">Home</a>
                        </li>
                        <li>
                            <a href="">adm</a>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                {mensagem &&
                    <div className="mensagem">
                        <p>{mensagem}</p>
                    </div>
                }

                <div className="container-listagem">
                    {produtos.map(produto => {
                        return (
                            <div className="produto-container">
                                <div className="produto-nome">
                                    {produto.nome}
                                </div>
                                <div className="produto-preco">
                                    {produto.preco}
                                </div>
                                <div className="produto-categoria">
                                    {produto.categoria}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="text" name="id" id="id" onChange={trataId} placeholder="Id" />
                        <input type="text" name="nome" id="nome" onChange={trataNome} placeholder="Nome" />
                        <input type="number" name="preco" id="preco" onChange={trataPreco} placeholder="Preço" />
                        <input type="text" name="categoria" id="categoria" onChange={trataCategoria} placeholder="Categoria" />
                        <input type="submit" value="Cadastrar" />
                    </form>

                </div>
            </main>
        </>
    )
}
