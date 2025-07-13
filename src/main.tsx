import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.tsx'
//import Container from './Container.tsx'
import { BrowserRouter } from 'react-router-dom';
import Pagina from './Pagina'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {<Pagina/>}
    </BrowserRouter>
    {/* <Container nome='Header'/>
    <Container nome='Body'/>
    <Container nome='Footer'/> */}
    
  </StrictMode>,
)











/*

-- Criar o banco de dados
CREATE DATABASE loja;

-- Usar o banco de dados
USE loja;

-- Criar tabela Categorias
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Chave primária
    nome VARCHAR(255) NOT NULL              -- Nome da categoria
);

-- Criar tabela Produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Chave primária
    nome VARCHAR(255) NOT NULL,             -- Nome do produto
    preco DECIMAL(10,2) NOT NULL,           -- Preço do produto (com 2 casas decimais)
    categoria_id INT,                       -- ID da categoria (chave estrangeira)
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL  -- Relacionamento com a tabela 'categorias'
);

-- Criar tabela Clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Chave primária
    nome VARCHAR(255) NOT NULL,             -- Nome do cliente
    email VARCHAR(255) NOT NULL UNIQUE      -- E-mail do cliente (único)
);

-- Inserir algumas categorias (dados iniciais)
INSERT INTO categorias (nome) VALUES
('Eletrônicos'),
('Vestuário'),
('Alimentos');

-- Inserir alguns produtos (dados iniciais)
INSERT INTO produtos (nome, preco, categoria_id) VALUES
('Smartphone', 1999.99, 1),  -- Categoria 1: Eletrônicos
('Camiseta', 59.90, 2),      -- Categoria 2: Vestuário
('Arroz', 3.50, 3);          -- Categoria 3: Alimentos

-- Inserir alguns clientes (dados iniciais)
INSERT INTO clientes (nome, email) VALUES
('Carlos Silva', 'carlos.silva@example.com'),
('Maria Oliveira', 'maria.oliveira@example.com');


*/