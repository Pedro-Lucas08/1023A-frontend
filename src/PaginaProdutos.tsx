import { useEffect, useState } from "react";
import "./PaginaProdutos.css";

/* ---------- tipos ---------- */
interface Categoria { id: number; nome: string }
interface Produto   {
  id: number;
  nome: string;
  preco: number;
  categoriaId: number | null;   // igual ao backend
  categoria?: string;           // nome da categoria (JOIN)
}
interface ApiErro { mensagem: string }

/* ---------- util erro ---------- */
const paraErro = (res: Response): Promise<never> =>
  res.json().then((j: ApiErro) => { throw new Error(j.mensagem); });

export default function PaginaProdutos() {
  const [produtos,   setProdutos]   = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [msg,        setMsg]        = useState("");

  /* ---------- forms ---------- */
  const [form,   setForm]   = useState({ nome: "", preco: "", categoriaId: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [edit,   setEdit]   = useState({ nome: "", preco: "", categoriaId: "" });

  /* ---------- carregar ---------- */
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:8000/produtos");
        if (!r.ok) await paraErro(r);
        setProdutos(await r.json());
      } catch (e) { setMsg((e as Error).message); }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:8000/categorias");
        if (!r.ok) await paraErro(r);
        setCategorias(await r.json());
      } catch (e) { setMsg((e as Error).message); }
    })();
  }, []);

  /* ---------- cadastrar ---------- */
  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    const { nome, preco, categoriaId } = form;
    if (!nome || !preco || !categoriaId)
      return setMsg("Preencha todos os campos.");

    try {
      const r = await fetch("http://localhost:8000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco: Number(preco), categoriaId: Number(categoriaId) }),
      });
      if (!r.ok) await paraErro(r);
      const salvo: Produto = await r.json();
      setProdutos(p => [...p, salvo]);
      setForm({ nome: "", preco: "", categoriaId: "" });
      setMsg("Produto cadastrado!");
    } catch (e) { setMsg((e as Error).message); }
  }

  /* ---------- edição ---------- */
  const iniciarEdicao = (p: Produto) => {
    setEditId(p.id);
    setEdit({ nome: p.nome, preco: String(p.preco), categoriaId: String(p.categoriaId ?? "") });
    setMsg("");
  };
  const cancelar = () => {
    setEditId(null);
    setEdit({ nome: "", preco: "", categoriaId: "" });
  };
  const salvar = async () => {
    if (editId === null) return;
    const { nome, preco, categoriaId } = edit;
    if (!nome || !preco || !categoriaId) return setMsg("Preencha todos os campos.");

    try {
      const r = await fetch(`http://localhost:8000/produtos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco: Number(preco), categoriaId: Number(categoriaId) }),
      });
      if (!r.ok) await paraErro(r);
      const salvo: Produto = await r.json();
      setProdutos(p => p.map(pr => (pr.id === editId ? salvo : pr)));
      cancelar();
    } catch (e) { setMsg((e as Error).message); }
  };

  /* ---------- deletar ---------- */
  const deletar = async (id: number) => {
    if (!confirm("Excluir este produto?")) return;
    try {
      const r = await fetch(`http://localhost:8000/produtos/${id}`, { method: "DELETE" });
      if (!r.ok) await paraErro(r);
      setProdutos(p => p.filter(pr => pr.id !== id));
    } catch (e) { setMsg((e as Error).message); }
  };

  /* ---------- helper ---------- */
  const nomeCat = (id: number | null) =>
    categorias.find(c => c.id === id)?.nome ?? "—";

  /* ---------- UI ---------- */
  return (
    <div>
      <h1>Produtos</h1>
      {msg && <div className="mensagem">{msg}</div>}

      <section className="container-listagem">
        {produtos.map(p =>
          editId === p.id ? (
            <div key={p.id} className="produto-container editando">
              <input value={edit.nome} onChange={e => setEdit(s => ({ ...s, nome: e.target.value }))} />
              <input type="number" step="0.01" value={edit.preco}
                     onChange={e => setEdit(s => ({ ...s, preco: e.target.value }))} />
              <select value={edit.categoriaId}
                      onChange={e => setEdit(s => ({ ...s, categoriaId: e.target.value }))}>
                <option value="">Categoria</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <button onClick={salvar}>Salvar</button>
              <button onClick={cancelar}>Cancelar</button>
            </div>
          ) : (
            <div key={p.id} className="produto-container">
              <div><strong>Nome:</strong> {p.nome}</div>
              <div><strong>Preço:</strong> {new Intl.NumberFormat("pt-BR",
                    { style: "currency", currency: "BRL" }).format(p.preco)}</div>
              <div><strong>Categoria:</strong> {nomeCat(p.categoriaId)}</div>
              <div className="acoes">
                <button onClick={() => iniciarEdicao(p)}>Editar</button>
                <button onClick={() => deletar(p.id)}>Excluir</button>
              </div>
            </div>
          )
        )}
      </section>

      <section className="container-produtos">
        <h2>Cadastrar Produto</h2>
        <form onSubmit={cadastrar}>
          <input placeholder="Nome" value={form.nome}
                 onChange={e => setForm({ ...form, nome: e.target.value })} />
          <input type="number" step="0.01" placeholder="Preço" value={form.preco}
                 onChange={e => setForm({ ...form, preco: e.target.value })} />
          <select value={form.categoriaId}
                  onChange={e => setForm({ ...form, categoriaId: e.target.value })}>
            <option value="">Categoria</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <input type="submit" value="Cadastrar" />
        </form>
      </section>
    </div>
  );
}
