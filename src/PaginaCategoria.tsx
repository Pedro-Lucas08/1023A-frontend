import { useEffect, useState } from "react";

interface Categoria { id: number; nome: string }
interface ApiErro { mensagem: string }
const paraErro = (res: Response): Promise<never> =>
  res.json().then((j: ApiErro) => { throw new Error(j.mensagem); });

export default function PaginaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [msg, setMsg] = useState("");

  // Form para nova categoria
  const [formNome, setFormNome] = useState("");

  // Estado edição categoria
  const [editCatId, setEditCatId] = useState<number | null>(null);
  const [editCatNome, setEditCatNome] = useState("");

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      const r = await fetch("http://localhost:8000/categorias");
      if (!r.ok) await paraErro(r);
      setCategorias(await r.json());
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  async function cadastrarCategoria(e: React.FormEvent) {
    e.preventDefault();
    if (!formNome.trim()) return setMsg("Nome da categoria é obrigatório.");
    try {
      const r = await fetch("http://localhost:8000/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: formNome }),
      });
      if (!r.ok) await paraErro(r);
      setFormNome("");
      await fetchCategorias();
      setMsg("Categoria cadastrada!");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  async function salvarEdicaoCategoria(id: number) {
    if (!editCatNome.trim()) return setMsg("Nome da categoria é obrigatório.");
    try {
      const r = await fetch(`http://localhost:8000/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editCatNome }),
      });
      if (!r.ok) await paraErro(r);
      setEditCatId(null);
      await fetchCategorias();
      setMsg("Categoria editada!");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  async function deletarCategoria(id: number) {
    if (!confirm("Excluir categoria?")) return;
    try {
      const r = await fetch(`http://localhost:8000/categorias/${id}`, { method: "DELETE" });
      if (!r.ok) await paraErro(r);
      setCategorias(c => c.filter(x => x.id !== id));
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  return (
    <div>
      <h1>Categorias</h1>
      {msg && <div className="mensagem">{msg}</div>}

      <div className="container-listagem">
        {categorias.map(c => (
          <div key={c.id} className="produto-container">
            {editCatId === c.id ? (
              <>
                <input
                  value={editCatNome}
                  onChange={e => setEditCatNome(e.target.value)}
                  placeholder="Nome da Categoria"
                />
                <button onClick={() => salvarEdicaoCategoria(c.id)}>Salvar</button>
                <button onClick={() => setEditCatId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <div><strong>{c.nome}</strong></div>
                <button onClick={() => {
                  setEditCatId(c.id);
                  setEditCatNome(c.nome);
                }}>Editar</button>
                <button onClick={() => deletarCategoria(c.id)}>Excluir</button>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={cadastrarCategoria} className="container-cadastro">
        <h3>Cadastro de Categoria</h3>
        <input
          placeholder="Nome"
          value={formNome}
          onChange={e => setFormNome(e.target.value)}
        />
        <button type="submit">Cadastrar Categoria</button>
      </form>
    </div>
  );
}
