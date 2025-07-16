import { useEffect, useState } from "react";

interface Categoria { id: number; nome: string }
interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoriaId: number | null;
  imagem?: string; // URL ou base64 da imagem
}
interface ApiErro { mensagem: string }
const paraErro = (res: Response): Promise<never> =>
  res.json().then((j: ApiErro) => { throw new Error(j.mensagem); });

export default function PaginaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [msg, setMsg] = useState("");

  // Form para criar produto
  const [formP, setFormP] = useState({ nome: "", preco: "", categoriaId: "", imagemFile: null as File | null, imagemPreview: "" });

  // Estado edição produto
  const [editProdId, setEditProdId] = useState<number | null>(null);
  const [editProdData, setEditProdData] = useState({ nome: "", preco: "", categoriaId: "", imagemFile: null as File | null, imagemPreview: "" });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [rp, rc] = await Promise.all([
        fetch("http://localhost:8000/produtos"),
        fetch("http://localhost:8000/categorias"),
      ]);
      if (!rp.ok) await paraErro(rp);
      if (!rc.ok) await paraErro(rc);
      const produtosData: Produto[] = await rp.json();
      setProdutos(produtosData);
      setCategorias(await rc.json());
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  // Função para converter File em base64
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // CADASTRO
  async function cadastrarProduto(e: React.FormEvent) {
    e.preventDefault();
    const { nome, preco, categoriaId, imagemFile } = formP;
    if (!nome || !preco) return setMsg("Preencha nome e preço.");

    try {
      let imagemBase64 = "";
      if (imagemFile) {
        imagemBase64 = await fileToBase64(imagemFile);
      }

      const r = await fetch("http://localhost:8000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          preco: parseFloat(preco),
          categoriaId: categoriaId ? parseInt(categoriaId) : null,
          imagem: imagemBase64 || undefined,
        }),
      });
      if (!r.ok) await paraErro(r);
      setFormP({ nome: "", preco: "", categoriaId: "", imagemFile: null, imagemPreview: "" });
      await fetchData();
      setMsg("Produto cadastrado!");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  // SALVAR EDIÇÃO
  async function salvarEdicaoProduto(id: number) {
    if (!editProdData.nome || !editProdData.preco) {
      return setMsg("Nome e preço são obrigatórios.");
    }
    try {
      let imagemBase64 = "";
      if (editProdData.imagemFile) {
        imagemBase64 = await fileToBase64(editProdData.imagemFile);
      }

      const r = await fetch(`http://localhost:8000/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editProdData.nome,
          preco: parseFloat(editProdData.preco),
          categoriaId: editProdData.categoriaId ? parseInt(editProdData.categoriaId) : null,
          imagem: imagemBase64 || undefined,
        }),
      });
      if (!r.ok) await paraErro(r);
      setEditProdId(null);
      await fetchData();
      setMsg("Produto editado!");
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  async function deletarProduto(id: number) {
    if (!confirm("Excluir produto?")) return;
    try {
      const r = await fetch(`http://localhost:8000/produtos/${id}`, { method: "DELETE" });
      if (!r.ok) await paraErro(r);
      setProdutos(p => p.filter(pr => pr.id !== id));
    } catch (e) {
      setMsg((e as Error).message);
    }
  }

  // Manipulação do input de arquivo (imagem) no cadastro
  function handleImagemChangeCadastro(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFormP((f) => ({
      ...f,
      imagemFile: file,
      imagemPreview: file ? URL.createObjectURL(file) : "",
    }));
  }

  // Manipulação do input de arquivo (imagem) na edição
  function handleImagemChangeEdicao(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setEditProdData((f) => ({
      ...f,
      imagemFile: file,
      imagemPreview: file ? URL.createObjectURL(file) : "",
    }));
  }

  return (
    <div>
      <h1>Produtos</h1>
      {msg && <div className="mensagem">{msg}</div>}

      <div className="container-listagem">
        {produtos.map(p => (
          <div key={p.id} className="produto-container" style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
            {editProdId === p.id ? (
              <>
                <input
                  value={editProdData.nome}
                  onChange={e => setEditProdData({ ...editProdData, nome: e.target.value })}
                  placeholder="Nome"
                />
                <input
                  type="number"
                  step="0.01"
                  value={editProdData.preco}
                  onChange={e => setEditProdData({ ...editProdData, preco: e.target.value })}
                  placeholder="Preço"
                />
                <select
                  value={editProdData.categoriaId}
                  onChange={e => setEditProdData({ ...editProdData, categoriaId: e.target.value })}
                >
                  <option value="">Categoria</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>

                {/* Input para imagem na edição */}
                <input type="file" accept="image/*" onChange={handleImagemChangeEdicao} />
                {editProdData.imagemPreview && (
                  <img src={editProdData.imagemPreview} alt="Preview" style={{ width: 100, marginTop: 5 }} />
                )}

                <button onClick={() => salvarEdicaoProduto(p.id)}>Salvar</button>
                <button onClick={() => setEditProdId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <div><strong>{p.nome}</strong></div>
                <div>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(p.preco)}
                </div>
                <div>{categorias.find(c => c.id === p.categoriaId)?.nome ?? "—"}</div>
                {p.imagem && (
                  <img src={p.imagem} alt={p.nome} style={{ width: 100, marginTop: 5 }} />
                )}
                <button onClick={() => {
                  setEditProdId(p.id);
                  setEditProdData({
                    nome: p.nome,
                    preco: String(p.preco),
                    categoriaId: p.categoriaId ? String(p.categoriaId) : "",
                    imagemFile: null,
                    imagemPreview: p.imagem || "",
                  });
                }}>Editar</button>
                <button onClick={() => deletarProduto(p.id)}>Excluir</button>
              </>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={cadastrarProduto} className="container-cadastro" style={{ borderTop: "1px solid #ddd", paddingTop: 10, marginTop: 20 }}>
        <h3>Cadastro de Produto</h3>
        <input
          placeholder="Nome"
          value={formP.nome}
          onChange={e => setFormP({ ...formP, nome: e.target.value })}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={formP.preco}
          onChange={e => setFormP({ ...formP, preco: e.target.value })}
        />
        <select
          value={formP.categoriaId}
          onChange={e => setFormP({ ...formP, categoriaId: e.target.value })}
        >
          <option value="">Categoria</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        {/* Input para imagem no cadastro */}
        <input type="file" accept="image/*" onChange={handleImagemChangeCadastro} />
        {formP.imagemPreview && (
          <img src={formP.imagemPreview} alt="Preview" style={{ width: 100, marginTop: 5 }} />
        )}

        <button type="submit">Cadastrar Produto</button>
      </form>
    </div>
  );
}
