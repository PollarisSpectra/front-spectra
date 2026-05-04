import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarSessao.module.css";
import ModalDecisao from "../../../../components/ModalDecisao/ModalDecisao";
import FlashMessage from "../../../../components/FlashMessage/FlashMessage.jsx";

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

    // ==========================================
    // ESTADOS DO FILTRO / BUSCA
    // ==========================================
    const [buscaTexto, setBuscaTexto] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("filme");
    const [menuFiltroAtivo, setMenuFiltroAtivo] = useState(false);

    // Nomes de exibição no layout
    const conversaoCheck = {
        filme: 'Filme',
        sala: 'Sala',
        data: 'Mais Recente'
    };

    // ==========================================
    // FUNÇÕES DE COMUNICAÇÃO (API)
    // ==========================================
    const buscarSessoes = async () => {
        setLoading(true);
        try {
            let url = "http://localhost:5000/sessao/listar_sessao";

            // Adiciona a query na URL se houver texto na busca
            if (buscaTexto) {
                // Exemplo: ?filme=Batman ou ?sala=1
                url += `?${filtroTipo}=${encodeURIComponent(buscaTexto)}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setSessoes(data.sessao);
            } else {
                setSessoes([]);
                if (buscaTexto) {
                    setMensagem("Nenhuma sessão encontrada para essa busca.");
                    setTipoMensagem("erro");
                }
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

    // Dispara quando clica no botão "Aplicar filtros"
    const dispararBusca = (e) => {
        e.preventDefault();
        setMensagem(""); // Limpa avisos antes de nova busca
        buscarSessoes();
    };

    const gatilhoExcluir = (id) => {
        setIdParaExcluir(id);
        setExibirModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        setMensagem("");
        try {
            const response = await fetch(`http://localhost:5000/sessao/excluir_sessao/${idParaExcluir}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem("Sessão excluída com sucesso!");
                setTipoMensagem("sucesso");
                buscarSessoes();
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
            <FlashMessage
                mensagem={mensagem}
                tipo={tipoMensagem}
                onClose={() => {
                    setMensagem("");
                    setTipoMensagem("");
                }}
            />

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
                <button className={css.voltar} onClick={() => navigate("/app")}>←</button>
                <h1 className={css.formTitulo}>SESSÕES</h1>
            </section>

            {/* ==========================================
                BARRA DE FILTRO E ORDENAÇÃO
            ========================================== */}
            <section className={`${css.filtroBarra} d-flex align-items-center justify-content-between w-100 gap-3`}>
                <form className="d-flex align-items-center gap-2" onSubmit={dispararBusca}>
                    <input
                        type="text"
                        placeholder={
                            filtroTipo === 'data'
                                ? "Buscar por data (ex: 2024-10-15)..."
                                : `Buscar por ${conversaoCheck[filtroTipo].toLowerCase()}...`
                        }
                        value={buscaTexto}
                        onChange={(e) => setBuscaTexto(e.target.value)}
                        className={`${css.inputBusca} bg-dark bg-opacity-25 px-2 py-1 rounded-3 border-1 border-white border-opacity-50 text-white`}
                    />
                    <button type="submit" className={`${css.btnLupa} px-2 py-1 bg-white rounded-3 border-1 border-white text-dark fw-bold`}>
                        Aplicar filtros
                    </button>
                </form>

                <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small">Filtrar por:</span>
                    <div className={css.ordenarWrapper}>
                        <div
                            className={`${css.ordenarHeader} bg-dark bg-opacity-25 rounded-3 px-2 py-1 border border-white border-opacity-25`}
                            onClick={() => setMenuFiltroAtivo(!menuFiltroAtivo)}
                        >
                            <span className={css.filtroDestaque}>{conversaoCheck[filtroTipo]}</span>
                            <span className="ms-2 small opacity-50">{menuFiltroAtivo ? "▲" : "▼"}</span>
                        </div>

                        {menuFiltroAtivo && (
                            <ul className={`${css.ordenarOpcoes} rounded-3 shadow-lg`}>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("filme"); setMenuFiltroAtivo(false); }}>
                                    Filme
                                </li>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("sala"); setMenuFiltroAtivo(false); }}>
                                    Sala
                                </li>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("data"); setMenuFiltroAtivo(false); }}>
                                    Mais Recente
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
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
                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                                    />
                                    <div className={css.infoGrid}>
                                        <div className={css.colEsquerda}>
                                            <p><strong>Valor:</strong> R$ {Number(sessao.valor_assento || 0).toFixed(2)}</p>
                                            <h3 className={css.sessaoTitulo}>{sessao.filme}</h3>
                                            <p><strong>Sala:</strong> {sessao.sala}</p>
                                            <p><strong>Data:</strong> {sessao.data}</p>
                                        </div>

                                        <div className={css.acoes}>
                                            <button
                                                className="px-2 py-1 rounded-3 fw-semibold"
                                                onClick={() => navigate(`/app/sessoes/${sessao.id_sessao}/editar`)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="px-2 py-1 rounded-3 fw-semibold"
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