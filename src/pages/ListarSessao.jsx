import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarSessao.module.css";

export default function ListarSessao() {
    const [aberta, setAberta] = useState(null);
    const [sessoes, setSessoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Função para buscar as sessões do backend
    const buscarSessoes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sessao/listar_sessao");
            const data = await response.json();
            if (response.ok) {
                setSessoes(data.sessao);
            }
        } catch (error) {
            console.error("Erro ao buscar sessões:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarSessoes();
    }, []);

    const handleExcluir = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta sessão?")) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/sessao/excluir_sessao/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (response.ok) {
                alert("Sessão excluída!");
                buscarSessoes(); // Atualiza a lista
            } else {
                alert(data.error || "Erro ao excluir");
            }
        } catch (error) {
            alert("Erro na requisição");
        }
    };

    return (
        <main className={css.main}>
            <div className={css.tituloArea}>
                <button className={css.voltar} onClick={() => navigate("/dashboard")}>←</button>
                <h1>SESSÕES</h1>
            </div>

            <section className={css.lista}>
                {loading ? <p className="text-white">Carregando...</p> :
                    sessoes.length === 0 ? <p className="text-white">Nenhuma sessão encontrada.</p> :
                        sessoes.map((sessao) => (
                            <div key={sessao.id_sessao} className={css.cardSessao}>
                                <div
                                    className={css.topoSessao}
                                    onClick={() => setAberta(aberta === sessao.id_sessao ? null : sessao.id_sessao)}
                                >
                                    <div>
                                        <span>SESSÃO</span>
                                        <strong>{sessao.id_sessao}</strong>
                                        <p>{sessao.horario}</p>
                                    </div>
                                    <button className={css.seta + " bg-transparent text-white"}>
                                        {aberta === sessao.id_sessao ? "⌃" : "⌄"}
                                    </button>
                                </div>

                                {aberta === sessao.id_sessao && (
                                    <div className={css.conteudoSessao}>
                                        <div className={css.infoFilme}>
                                            {/* Caso não tenha imagem no banco, usamos um placeholder */}
                                            <img src={sessao.imagem || "/missaofilme.png"} alt={sessao.filme} />
                                            <div>
                                                <h3>{sessao.filme}</h3>
                                                <p>Sala: {sessao.sala}</p>
                                                <p>Data: {sessao.data}</p>
                                                <p>Valor: R$ {sessao.valor_assento.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className={css.acoes}>
                                            <button
                                                className={css.btnEditar}
                                                onClick={() => navigate(`/sessoes/${sessao.id_sessao}/editar`)}
                                            >
                                                ✎
                                            </button>
                                            <button
                                                className={css.btnExcluir}
                                                onClick={() => handleExcluir(sessao.id_sessao)}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
            </section>

            <div className={css.adicionarArea}>
                <button className={css.adicionarTexto + " px-3 py-1 rounded-3 fw-semibold"} onClick={() => navigate("/sessoes/criar")}>
                    ADICIONAR SESSÃO
                </button>
                <button className={css.adicionarBtn} onClick={() => navigate("/sessoes/criar")}>+</button>
            </div>
        </main>
    );
}