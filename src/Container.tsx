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

export default Container;
