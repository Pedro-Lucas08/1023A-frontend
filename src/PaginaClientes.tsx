import { useEffect, useState } from "react";
import "./PaginaClientes.css";


interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export default function PaginaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({ nome: "", email: "" });
  const [mensagem, setMensagem] = useState("");

  /* --- estado para edição --- */
  const [editId, setEditId] = useState<number | 0>(0);
  const [editForm, setEditForm] = useState({ nome: "", email: "" });

  /* ------------------------------------------------------------------ */
  // FETCH inicial
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:8000/clientes");
        if (!r.ok) throw await r.json();
        setClientes(await r.json());
      } catch (e: any) {
        setMensagem(e?.mensagem ?? "Erro ao carregar clientes.");
      }
    })();
  }, []);

  /* ------------------------------------------------------------------ */
  // CADASTRAR
  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    const { nome, email } = form;
    if (!nome || !email) return setMensagem("Nome e e‑mail são obrigatórios.");

    try {
      const r = await fetch("http://localhost:8000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw await r.json();
      const salvo = await r.json();
      setClientes((c) => [...c, salvo]);
      setForm({ nome: "", email: "" });
      setMensagem("Cliente cadastrado!");
    } catch (e: any) {
      setMensagem(e?.mensagem ?? "Erro ao cadastrar.");
    }
  }

  /* ------------------------------------------------------------------ */
  // ATIVAR EDIÇÃO
  function iniciarEdicao(cl: Cliente) {
    setEditId(cl.id);
    setEditForm({ nome: cl.nome, email: cl.email });
    setMensagem("");
  }
  function cancelarEdicao() {
    setEditId(0);
    setEditForm({ nome: "", email: "" });
  }

  /* ------------------------------------------------------------------ */
  // SALVAR EDIÇÃO
  async function salvarEdicao() {
    const { nome, email } = editForm;
    if (!nome || !email) return setMensagem("Preencha ambos os campos.");

    try {
      const r = await fetch(`http://localhost:8000/clientes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!r.ok) throw await r.json();
      const salvo = await r.json();
      setClientes((c) =>
        c.map((cli) => (cli.id === editId ? salvo : cli))
      );
      cancelarEdicao();
    } catch (e: any) {
      setMensagem(e?.mensagem ?? "Erro ao atualizar.");
    }
  }

  /* ------------------------------------------------------------------ */
  // DELETAR
  async function deletar(id: number) {
    if (!confirm("Excluir este cliente?")) return;
    try {
      const r = await fetch(`http://localhost:8000/clientes/${id}`, {
        method: "DELETE",
      });
      if (!r.ok) throw await r.json();
      setClientes((c) => c.filter((cli) => cli.id !== id));
    } catch (e: any) {
      setMensagem(e?.mensagem ?? "Erro ao excluir.");
    }
  }

  /* ------------------------------------------------------------------ */
  return (
    <div>
      <header>
        <h1>Clientes</h1>
      </header>

      {mensagem && <div className="mensagem">{mensagem}</div>}

      {/* LISTAGEM */}
      <section className="container-listagem">
        {clientes.map((cl) =>
          editId === cl.id ? (
            /* MODO EDIÇÃO */
            <div key={cl.id} className="cliente-container editando">
              <input
                value={editForm.nome}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, nome: e.target.value }))
                }
              />
              <input
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, email: e.target.value }))
                }
              />
              <button onClick={salvarEdicao}>Salvar</button>
              <button onClick={cancelarEdicao}>Cancelar</button>
            </div>
          ) : (
            /* VISUALIZAÇÃO NORMAL */
            <div key={cl.id} className="cliente-container">
              <div>
                <strong>Nome:</strong> {cl.nome}
              </div>
              <div>
                <strong>Email:</strong> {cl.email}
              </div>

              <div className="acoes">
                <button onClick={() => iniciarEdicao(cl)}>Editar</button>
                <button onClick={() => deletar(cl.id)}>Excluir</button>
              </div>
            </div>
          )
        )}
      </section>

      {/* FORM CADASTRO */}
      <section className="container-clientes">
        <h2>Cadastrar Cliente</h2>
        <form onSubmit={cadastrar}>
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input type="submit" value="Cadastrar" />
        </form>
      </section>
    </div>
  );
}
