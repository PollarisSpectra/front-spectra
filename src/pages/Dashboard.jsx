import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardAdm from "./DashboardAdm";
import css from "../pages/Admin/Filme/ListarFilme/ListarFilme.module.css"; // Reaproveitando a folha de estilos de filmes
import FlashMessage from "../components/FlashMessage/FlashMessage.jsx";

export function Dashboard({ usuario, setUsuario }) {
    const navigate = useNavigate();

    const [reservas, setReservas] = useState([]);
    const [reservaAberta, setReservaAberta] = useState(null);
    const [carregando, setCarregando] = useState(false);

    // Estados para Mensagens de Alerta
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    // Filtros de busca (Idêntico ao ListarFilme)
    const [buscaTexto, setBuscaTexto] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("id_reserva"); 
    const [menuFiltroAtivo, setMenuFiltroAtivo] = useState(false);
    
    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    useEffect(() => {
        const usuarioSessao = localStorage.getItem("usuario");

        if (!usuarioSessao) {
            navigate("/login");
            return;
        }

        setUsuario(JSON.parse(usuarioSessao));
    }, [navigate, setUsuario]);

    const buscarReservas = async (pagina = 1) => {
        if (!usuario?.id_usuario) return;
        setCarregando(true);
        try {
            let queryParams = `page_number=${pagina}&page_size=10`;
            
            if (buscaTexto) {
                queryParams += `&${filtroTipo}=${encodeURIComponent(buscaTexto)}`;
            }

            const res = await fetch(`http://localhost:5000/reservas/${usuario.id_usuario}/usuario?${queryParams}`);
            const dados = await res.json();

            if (res.ok) {
                setReservas(dados.reservas || []);
                setTotalPaginas(dados.total_pages || 1);
                setPaginaAtual(pagina);
            } else {
                setReservas([]);
                if (buscaTexto) {
                    setMensagem("Nenhuma reserva encontrada para essa busca.");
                    setTipoMensagem("erro");
                }
            }
        } catch (error) {
            setMensagem("Erro ao carregar reservas.");
            setTipoMensagem("erro");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        if (usuario?.id_usuario) {
            buscarReservas(paginaAtual);
        }
    }, [usuario, paginaAtual]);

    const conversaoCheck = {
        id_reserva: 'Código Reserva',
        id_sessao: 'Código Sessão',
        status: 'Status (1-Pend, 2-Canc, 3-Conf)'
    };

    const dispararBusca = (e) => {
        e.preventDefault();
        setMensagem(""); 
        setPaginaAtual(1);
        buscarReservas(1);
    };

    async function handleLogout() {
        const resposta = await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
        });

        if (resposta.ok) {
            localStorage.removeItem("usuario");
            setUsuario(null);
            navigate("/");
        }
    }

    const toggleAccordion = (id) => {
        setReservaAberta(reservaAberta === id ? null : id);
    };

    // Retorna as configurações de texto e cor com base no status solicitado
    const getStatusConfig = (status) => {
        const statusMap = {
            3: { texto: "Pendente", cor: "#ffc107", textoCor: "#000000" },  // Amarelo
            2: { texto: "Cancelado", cor: "#dc3545", textoCor: "#ffffff" }, // Vermelho
            1: { texto: "Confirmado", cor: "#007bff", textoCor: "#ffffff" } // Azul
        };
        return statusMap[status] || { texto: "Desconhecido", cor: "#6c757d", textoCor: "#ffffff" };
    };

    if (usuario?.tipo === 0) {
        return <DashboardAdm />;
    }

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

            <section className={css.header}>
                <h1 className={css.formTitulo}>MINHAS RESERVAS</h1>
            </section>

            <div className="d-flex align-items-center justify-content-between mb-4 text-white">
                <h2 className="fs-4 m-0">Olá, {usuario?.nome}</h2>
                <button className="btn btn-outline-light btn-sm fw-semibold px-3 rounded-3" onClick={handleLogout}>
                    Sair
                </button>
            </div>

            {/* BARRA DE FILTROS */}
            <section className={css.filtroBarra + " d-flex align-items-center justify-content-between w-100 gap-3"}>
                <form className="d-flex align-items-center gap-2" onSubmit={dispararBusca}>
                    <input
                        type="text" 
                        placeholder={`Buscar por ${conversaoCheck[filtroTipo].toLowerCase()}...`} 
                        value={buscaTexto}
                        onChange={(e) => setBuscaTexto(e.target.value)}
                        className={css.inputBusca + " bg-dark bg-opacity-25 px-2 py-1 rounded-3 border-1 border-white border-opacity-50 text-white"}
                    />
                    <button type="submit" className={css.btnLupa + " px-2 py-1 bg-white rounded-3 border-1 border-white text-dark fw-bold"}>
                        Aplicar filtros
                    </button>
                </form>

                <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary small">Filtrar por:</span>
                    <div className={css.ordenarWrapper}>
                        <div className={css.ordenarHeader + " bg-dark bg-opacity-25 rounded-3 px-2 py-1 border border-white border-opacity-25"} onClick={() => setMenuFiltroAtivo(!menuFiltroAtivo)}>
                            <span className={css.filtroDestaque}>{conversaoCheck[filtroTipo]}</span>
                            <span className="ms-2 small opacity-50">{menuFiltroAtivo ? "▲" : "▼"}</span>
                        </div>
                        
                        {menuFiltroAtivo && (
                            <ul className={css.ordenarOpcoes + " rounded-3 shadow-lg"}>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("id_reserva"); setMenuFiltroAtivo(false); }}>Código Reserva</li>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("id_sessao"); setMenuFiltroAtivo(false); }}>Código Sessão</li>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("status"); setMenuFiltroAtivo(false); }}>Status</li>
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            {/* LISTAGEM DE CARDS COM IMAGEM DO POSTER E CORES DE STATUS */}
            <section className={css.lista}>
                {carregando ? (
                    <p className={css.mensagem}>Carregando...</p>
                ) : reservas.length > 0 ? (
                    reservas.map((reserva) => {
                        const statusConfig = getStatusConfig(reserva.status);
                        
                        return (
                            <div key={reserva.id_reserva} className={css.filmeCard}>
                                <div className={css.filmeHeader} onClick={() => toggleAccordion(reserva.id_reserva)}>
                                    <div className={css.filmeLabel}>
                                        RESERVA <span>#{reserva.id_reserva}</span>
                                    </div>
                                    <span className={css.seta}>{reservaAberta === reserva.id_reserva ? "▲" : "▼"}</span>
                                </div>

                                {reservaAberta === reserva.id_reserva && (
                                    <div className={css.filmeDetalhes}>
                                        <div className={css.posterContainer}>
                                            <img
                                                src={
                                                    reserva?.imagem_url
                                                        ? `http://localhost:5000/filmes${reserva.imagem_url}`
                                                        : "https://via.placeholder.com/150"
                                                }
                                                alt={reserva.filme_titulo || "Poster do Filme"}
                                                className={css.poster}
                                            />
                                        </div>

                                        <div className={css.infoGrid}>
                                            <div className={css.colEsquerda}>
                                                <h3 className={css.filmeTitulo}>{reserva.filme_titulo || `Reserva #${reserva.id_reserva}`}</h3>
                                                <p><strong>Sessão ID:</strong> {reserva.id_sessao}</p>
                                                <p><strong>Data da Reserva:</strong> {reserva.datareserva ? new Date(reserva.datareserva).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                                
                                                {/* Aplicando a estilização dinâmica de cor solicitada */}
                                                <div 
                                                    className={css.classifBadge} 
                                                    style={{ 
                                                        backgroundColor: statusConfig.cor, 
                                                        color: statusConfig.textoCor,
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {statusConfig.texto.toUpperCase()}
                                                </div>
                                            </div>

                                            <div className={css.colDireita}>
                                                <p><strong>Valor Total:</strong> R$ {Number(reserva.valortotal).toFixed(2).replace('.', ',')}</p>
                                                <p><strong>Desconto:</strong> R$ {Number(reserva.desconto).toFixed(2).replace('.', ',')}</p>
                                                <p><strong>Promoção ID:</strong> {reserva.id_promocao || "Nenhuma"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className={css.mensagem}>Nenhuma reserva encontrada.</p>
                )}
            </section>

            {/* PAGINAÇÃO */}
            {totalPaginas > 1 && (
                <section className={css.paginacao + " d-flex justify-content-center align-items-center gap-3 mt-5"}>
                    <button className="px-2 py-1 rounded-3" disabled={paginaAtual === 1} onClick={() => setPaginaAtual(p => p - 1)}>Anterior</button>
                    <span>{paginaAtual} / {totalPaginas}</span>
                    <button className="px-2 py-1 rounded-3" disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(p => p + 1)}>Próxima</button>
                </section>
            )}

            {/* BOTÃO FLUTUANTE INFERIOR */}
            <button className={css.btnAdd} onClick={() => navigate("/app/reservas/criar")}>
                NOVA RESERVA <span className={css.plusIcon}>+</span>
            </button>
        </main>
    );
}