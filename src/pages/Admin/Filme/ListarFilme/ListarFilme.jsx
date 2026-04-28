import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarFilme.module.css";
import ModalDecisao from "../../../../components/ModalDecisao/ModalDecisao";

export default function ListarFilme() {
    const navigate = useNavigate();
    const [filmes, setFilmes] = useState([]);
    const [filmeAberto, setFilmeAberto] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("titulo");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [menuFiltroAtivo, setMenuFiltroAtivo] = useState(false);

    const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);

    const gatilhoExcluir = (id) => {
        setIdParaExcluir(id);
        setExibirModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        try {
            const response = await fetch(`http://localhost:5000/filmes/excluir_filme/${idParaExcluir}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setFilmeAberto(null);

                // verifica antes de atualizar lista
                const paginaVaiFicarVazia = filmes.length === 1 && paginaAtual > 1;

                if (paginaVaiFicarVazia) {
                    setPaginaAtual(p => p - 1);
                } else {
                    await buscarFilmes(paginaAtual);
                }
            } else {
                const data = await response.json();
                alert(data.error || "Erro ao excluir filme.");
            }
        } catch (err) {
            alert("Erro de conexão com o servidor.");
        } finally {
            setExibirModalExcluir(false);
            setIdParaExcluir(null);
        }
    };

    const buscarFilmes = async (pagina = 1) => {
        setCarregando(true);
        try {
            let queryParams = `page_number=${pagina}&page_size=10`;
            if (buscaTexto) {
                queryParams += `&${filtroTipo}=${encodeURIComponent(buscaTexto)}`;
            }

            const response = await fetch(`http://localhost:5000/filmes/filme?${queryParams}`);
            const data = await response.json();

            if (response.ok) {
                setFilmes(data.filmes);
                setTotalPaginas(data.total_pages);
                setPaginaAtual(pagina);
            } else {
                setFilmes([]);
            }
        } catch (error) {
            console.error("Erro ao buscar filmes:", error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarFilmes(paginaAtual);
    }, [paginaAtual]);

    const conversaoCheck = {
        titulo: 'Título',
        classificacao: 'Classificação',
        genero: 'Gênero'
    };

    const dispararBusca = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        buscarFilmes(1);
    };

    const toggleAccordion = (id) => {
        setFilmeAberto(filmeAberto === id ? null : id);
    };

    const getBadgeClass = (classificacao) => {
        const badges = { 'L': css.badgeL, '10': css.badge10, '12': css.badge12, '14': css.badge14 };
        return badges[classificacao] || css.badge18;
    };

    return (
        <main className={css.container}>
            {exibirModalExcluir && (
                <ModalDecisao 
                    titulo="Tem certeza que deseja excluir este filme?"
                    textoConfirmar="Sim, excluir"
                    textoCancelar="Cancelar"
                    tipoAcao="perigo"
                    aoConfirmar={confirmarExclusao}
                    aoCancelar={() => setExibirModalExcluir(false)}
                />
            )}

            <section className={css.header}>
                <button className={css.voltar} onClick={() => navigate(-1)}>←</button>
                <h1 className={css.formTitulo}>FILMES</h1>
            </section>

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
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("titulo"); setMenuFiltroAtivo(false); }}>Título</li>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("genero"); setMenuFiltroAtivo(false); }}>Gênero</li>
                                <li className="m-1 p-2 rounded-2" onClick={() => { setFiltroTipo("classificacao"); setMenuFiltroAtivo(false); }}>Classificação</li>
                            </ul>
                        )}
                    </div>
                </div>
            </section>

            <section className={css.lista}>
                {carregando ? (
                    <p className={css.mensagem}>Carregando...</p>
                ) : filmes.length > 0 ? (
                    filmes.map((filme) => (
                        <div key={filme.id_filme} className={css.filmeCard}>
                            <div className={css.filmeHeader} onClick={() => toggleAccordion(filme.id_filme)}>
                                <div className={css.filmeLabel}>
                                    FILME <span>Id: {filme.id_filme}</span>
                                </div>
                                <span className={css.seta}>{filmeAberto === filme.id_filme ? "▲" : "▼"}</span>
                            </div>

                            {filmeAberto === filme.id_filme && (
                                <div className={css.filmeDetalhes}>
                                    <div className={css.posterContainer}>
                                        <img
                                            src={
                                                filme?.imagem_url
                                                    ? `http://localhost:5000/filmes${filme.imagem_url}`
                                                    : "https://via.placeholder.com/150"
                                            }
                                            alt={filme.titulo}
                                            className={css.poster}
                                        />
                                    </div>

                                    <div className={css.infoGrid}>
                                        <div className={css.colEsquerda}>
                                            <h3 className={css.filmeTitulo}>{filme.titulo}</h3>
                                            <p><strong>Gênero:</strong> {filme.genero}</p>
                                            <p><strong>Duração:</strong> {filme.duracao} min</p>
                                            <div className={`${css.classifBadge} ${getBadgeClass(filme.classificacao)}`}>
                                                {filme.classificacao}
                                            </div>
                                        </div>

                                        <div className={css.colDireita}>
                                            <p><strong>Lançamento:</strong> {new Date(filme.data_lancamento).toLocaleDateString('pt-BR')}</p>
                                            <p className={css.sinopse}><strong>Sinopse:</strong> {filme.sinopse}</p>
                                        </div>

                                        <div className={css.acoes}>
                                            <button className={css.btnEdit} onClick={() => navigate(`/app/filmes/${filme.id_filme}/editar`, { state: { filme } })}>✎</button>
                                            <button
                                                className={css.btnDelete + " px-2 py-1 rounded-3 fw-semibold"}
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    gatilhoExcluir(filme.id_filme); 
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
                ) : (
                    <p className={css.mensagem}>Nenhum filme encontrado.</p>
                )}
            </section>

            {totalPaginas > 1 && (
                <section className={css.paginacao + " d-flex justify-content-center align-items-center gap-3 mt-5"}>
                    <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(p => p - 1)}>Anterior</button>
                    <span>{paginaAtual} / {totalPaginas}</span>
                    <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(p => p + 1)}>Próxima</button>
                </section>
            )}

            <button className={css.btnAdd} onClick={() => navigate("/app/filmes/criar")}>
                ADICIONAR FILME <span className={css.plusIcon}>+</span>
            </button>
        </main>
    );
}