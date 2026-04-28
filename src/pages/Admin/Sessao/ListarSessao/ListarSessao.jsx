import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarSessao.module.css";
import ModalDecisao from "../../../../components/ModalDecisao/ModalDecisao";
import FlashMessage from "../../../../components/FlashMessage/FlashMessage.jsx"; // Importe o componente

export default function ListarSessao() {
    const [aberta, setAberta] = useState(null);
    const [sessoes, setSessoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Estados para a FlashMessage
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    // Modal de exclusão
    const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);

    const buscarSessoes = async () => {
        try {
            const response = await fetch("http://localhost:5000/sessao/listar_sessao");
            const data = await response.json();

            if (response.ok) {
                setSessoes(data.sessao);
            }
        } catch (error) {
            setMensagem("Erro ao carregar a lista de sessões.");
            setTipoMensagem("erro");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarSessoes();
    }, []);

    const gatilhoExcluir = (id) => {
        setIdParaExcluir(id);
        setExibirModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        setMensagem(""); // Limpa mensagens anteriores
        try {
            const response = await fetch(`http://localhost:5000/sessao/excluir_sessao/${idParaExcluir}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem("Sessão excluída com sucesso!");
                setTipoMensagem("sucesso");
                buscarSessoes(); // Atualiza lista
            } else {
                setMensagem(data.error || "Erro ao excluir sessão.");
                setTipoMensagem("erro");
            }
        } catch (error) {
            setMensagem("Erro de conexão com o servidor.");
            setTipoMensagem("erro");
        } finally {
            setExibirModalExcluir(false);
            setIdParaExcluir(null);
        }
    };

    return (
        <main className={css.container}>
            {/* Componente FlashMessage */}
            <FlashMessage 
                mensagem={mensagem} 
                tipo={tipoMensagem} 
                onClose={() => {
                    setMensagem("");
                    setTipoMensagem("");
                }} 
            />

            {/* Modal de confirmação */}
            {exibirModalExcluir && (
                <ModalDecisao 
                    titulo="Tem certeza que deseja excluir esta sessão?"
                    textoConfirmar="Sim, excluir"
                    textoCancelar="Cancelar"
                    tipoAcao="perigo"
                    aoConfirmar={confirmarExclusao}
                    aoCancelar={() => setExibirModalExcluir(false)}
                />
            )}

            <section className={css.header}>
                <button className={css.voltar} onClick={() => navigate(-1)}>←</button>
                <h1 className={css.formTitulo}>SESSÕES</h1>
            </section>

            <section className={css.lista}>
                {loading ? (
                    <p className={css.mensagem}>Carregando...</p>
                ) : sessoes.length === 0 ? (
                    <p className={css.mensagem}>Nenhuma sessão encontrada.</p>
                ) : (
                    sessoes.map((sessao) => (
                        <div key={sessao.id_sessao} className={css.sessaoCard}>
                            <div
                                className={css.sessaoHeader}
                                onClick={() => setAberta(aberta === sessao.id_sessao ? null : sessao.id_sessao)}
                            >
                                <div className={css.sessaoLabel}>
                                    SESSÃO <span>Filme: {sessao.filme}</span>
                                </div>
                                <span className={css.horarioSessao}>{sessao.horario}</span>
                                <span className={css.seta}>
                                    {aberta === sessao.id_sessao ? "▲" : "▼"}
                                </span>
                            </div>

                            {aberta === sessao.id_sessao && (
                                <div className={css.sessaoDetalhes}>
                                    <img
                                        className={css.poster}
                                        src={`http://localhost:5000/sessao/imagem_filme/${sessao.id_filme}.jpg`}
                                        alt={sessao.filme}
                                    />
                                    <div className={css.infoGrid}>
                                        <div className={css.colEsquerda}>
                                            <p>
                                                <strong>Valor:</strong>{" "}
                                            </p>
                                            <h3 className={css.sessaoTitulo}>{sessao.filme}</h3>
                                            <p><strong>Sala:</strong> {sessao.sala}</p>
                                            <p><strong>Data:</strong> {sessao.data}</p>
                                            R$ {Number(sessao.valor_assento || 0).toFixed(2)}
                                        </div>

                                        <div className={css.acoes}>
                                            <button
                                                className="px-2 py-1 rounded-3 fw-semibold"
                                                onClick={() => navigate(`/app/sessoes/${sessao.id_sessao}/editar`)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className={" px-2 py-1 rounded-3 fw-semibold"}
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    gatilhoExcluir(sessao.id_sessao); 
                                                }}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </section>

            <button
                className={css.btnAdd}
                onClick={() => navigate("/app/sessoes/criar")}
            >
                ADICIONAR SESSÃO <span className={css.plusIcon}>+</span>
            </button>
        </main>
    );
}