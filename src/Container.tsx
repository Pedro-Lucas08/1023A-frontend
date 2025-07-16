import { useState, useEffect } from "react";

// Definindo a interface para as props que o componente recebe
interface ContainerProps {
  nome: string;
}

function Container(props: ContainerProps) {
  const [texto, setTexto] = useState(""); // Estado que guarda o valor do input

  // Função que trata a alteração no campo de input
  function trataInput(event: React.ChangeEvent<HTMLInputElement>) {
    setTexto(event.currentTarget.value); // Atualiza o estado com o valor digitado
  }

  // Usando o useEffect para mostrar uma mensagem quando o texto mudar
  useEffect(() => {
    if (texto === "") {
      console.log("O campo de texto está vazio.");
    } else {
      console.log("Texto atual: ", texto);
    }
  }, [texto]); // A dependência é o 'texto', então o efeito roda sempre que o valor de texto mudar

  return (
    <>
      <h1>{props.nome}</h1>
      <p>Texto: {texto}</p>
      <input
        type="text"
        placeholder="Mostrar Texto"
        value={texto} // Valor do input vinculado ao estado
        onChange={trataInput} // Atualiza o estado conforme o usuário digita
      />
    </>
  );
}

import imgCalendar from './assets/6d80bf9e93aee8114455aa6b0564c6a0.webp'; // Importa a imagem local
import './Container.css'; // Importa o CSS do componente

function Container() {
  const img = "https://a-static.mlcdn.com.br/800x560/computador-completo-intel-i5-4-geracao-8gb-hd-1tb-facil-computadores/olistplus/opmk9w8zulz00ecr/6d80bf9e93aee8114455aa6b0564c6a0.jpeg"; // URL externa

  return (
    <>
      {/* Imagem externa */}
      <img src={img} alt="imagem de um computador" className="calendar-image" />

      {/* Imagem local */}
      <img src={imgCalendar} alt="imagem local de um computador" className="calendar-image" />
    </>
  );
}
export default Container;
