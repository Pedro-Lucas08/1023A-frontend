import { useEffect, useState } from "react";
import "./PaginaCategoria.css";

interface Categoria {
  id: number;
  nome: string;
}

export default function PaginaCategoria() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  // id que está em modo edição (0 = nenhum)
  const [editId, setEditId] = useState<number | 0>(0);
  const [editNome, setEditNome] = useState("");

  /* ------------------------------------------------------------------ */
  // FETCH INICIAL
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:8000/categorias");
        if (!r.ok) throw await r.json();
        setCategorias(await r.json());
      } catch (e: any) {
        setMensagem(e?.mensagem ?? "Erro ao carregar categorias.");
      }
    })();
  }, []);

  /* ------------------------------------------------------------------ */
  // CRIAR
  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setMensagem("Nome obrigatório.");
    try {
      const r = await fetch("http://localhost:8000/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });
      if (!r.ok) throw await r.json();
      const salvo = await r.json();
      setCategorias((c) => [...c, salvo]);
      setNome("");
      setMensagem("Categoria criada!");
    } catch (e: any) {
      setMensagem(e?.mensagem ?? "Erro ao cadastrar.");
    }
  }

  /* ------------------------------------------------------------------ */
  // ATIVAR EDIÇÃO
  function iniciarEdicao(cat: Categoria) {
    setEditId(cat.id);
    setEditNome(cat.nome);
    setMensagem("");
  }

  /* ------------------------------------------------------------------ */
  // CANCELAR EDIÇÃO
  function cancelarEdicao() {
    setEditId(0);
    setEditNome("");
  }

  /* ------------------------------------------------------------------ */
  // SALVAR EDIÇÃO (PUT)
  async function salvarEdicao() {
    if (!editNome.trim()) return setMensagem("Nome obrigatório.");
    try {
      const r = await fetch(`http://localhost:8000/categorias/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editNome }),
      });
      if (!r.ok) throw await r.json();
      const atualizado = await r.json();
      setCategorias((c) =>
        c.map((cat) => (cat.id === editId ? atualizado : cat))
      );
      cancelarEdicao();
    } catch (e: any) {
      setMensagem(e?.mensagem ?? "Erro ao atualizar.");
    }
  }

  /* ------------------------------------------------------------------ */
  // DELETAR
  async function deletar(id: number) {
    if (!confirm("Excluir esta categoria?")) return;
    try {
      const r = await fetch(`http://localhost:8000/categorias/${id}`, {
        method: "DELETE",
      });
      if (!r.ok) throw await r.json();
      setCategorias((c) => c.filter((cat) => cat.id !== id));
    } catch (e: any) {
      setMensagem(e?.mensagem ?? "Erro ao excluir.");
    }
  }

  /* ------------------------------------------------------------------ */
  return (
    <div>
      <header>
        <h1>Categorias</h1>
      </header>

      {mensagem && <div className="mensagem">{mensagem}</div>}

      {/* LISTAGEM */}
      <section className="container-listagem">
        {categorias.map((cat) =>
          editId === cat.id ? (
            // MODO EDIÇÃO
            <div key={cat.id} className="categoria-container editando">
              <input
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
              />
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={cancelarEdicao}>Cancelar</button>
            </div>
          ) : (
            // VISUALIZAÇÃO NORMAL
            <div key={cat.id} className="categoria-container">
              <span>{cat.nome}</span>
              <div className="acoes">
                <button onClick={() => iniciarEdicao(cat)}>Editar</button>
                <button onClick={() => deletar(cat.id)}>Excluir</button>
              </div>
            </div>
          )
        )}
      </section>

      {/* FORM CADASTRO */}
      <section className="container-categoria">
        <h2>Cadastrar Categoria</h2>
        <form onSubmit={cadastrar}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input type="submit" value="Cadastrar" />
        </form>
      </section>
    </div>
  );
}
