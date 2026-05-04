import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarSala.module.css";
import ModalDecisao from "../../../../components/ModalDecisao/ModalDecisao";

export default function ListarSala() {
    const navigate = useNavigate();
    const [salas, setSalas] = useState([]);
    const [salaAberta, setSalaAberta] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [message, setMessage] = useState({ text: "", type: "" });

    // Modal states
    const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);

    const gatilhoExcluir = (id) => {
        setIdParaExcluir(id);
        setExibirModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        try {
            const response = await fetch(`http://localhost:5000/salas/excluir_sala/${idParaExcluir}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setMessage({ text: data.message, type: "success" });

                // Verifica se página vai ficar vazia
                const paginaVaiFicarVazia = salas.length === 1 && paginaAtual > 1;
                if (paginaVaiFicarVazia) {
                    setPaginaAtual(p => p - 1);
                } else {
                    buscarSalas(paginaAtual);
                }
            } else {
                const data = await response.json();
                setMessage({ text: data.error || "Erro ao excluir sala.", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Erro de conexão com o servidor.", type: "error" });
        } finally {
            setExibirModalExcluir(false);
            setIdParaExcluir(null);
        }
    };

    const buscarSalas = async (pagina = 1) => {
        setCarregando(true);
        try {
            let queryParams = `page_number=${pagina}&page_size=10`;
            if (buscaTexto) {
                queryParams += `&nome=${encodeURIComponent(buscaTexto)}`;
            }

            const response = await fetch(`http://localhost:5000/salas/listar_sala?${queryParams}`, {
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok) {
                setSalas(data.salas);
                setTotalPaginas(data.total_pages);
                setPaginaAtual(pagina);
            } else {
                setSalas([]);
            }
        } catch (error) {
            console.error("Erro ao buscar salas:", error);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarSalas(paginaAtual);
    }, [paginaAtual]);

    const dispararBusca = (e) => {
        e.preventDefault();
        setPaginaAtual(1);
        buscarSalas(1);
    };

    const toggleAccordion = (id) => {
        setSalaAberta(salaAberta === id ? null : id);
    };

    return (
        <main className={css.container}>
            {exibirModalExcluir && (
                <ModalDecisao 
                    titulo="Tem certeza que deseja excluir esta sala?"
                    textoConfirmar="Sim, excluir"
                    textoCancelar="Cancelar"
                    tipoAcao="perigo"
                    aoConfirmar={confirmarExclusao}
                    aoCancelar={() => setExibirModalExcluir(false)}
                />
            )}

            {message.text && (
                <div className={`${css.messageBox} ${css[message.type]}`}>
                    {message.text}
                </div>
            )}

            <section className={css.header}>
                <button className={css.voltar} onClick={() => navigate("/app")}>←</button>
                <h1 className={css.formTitulo}>SALAS</h1>
            </section>

            <section className={css.filtroBarra}>
                <form onSubmit={dispararBusca} className="d-flex align-items-center gap-2">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={buscaTexto}
                        onChange={(e) => setBuscaTexto(e.target.value)}
                        className={css.inputBusca}
                    />
                    <button type="submit" className={css.btnLupa}>
                        Aplicar filtros
                    </button>
                </form>
            </section>

            <section className={css.lista}>
                {carregando ? (
                    <p className={css.mensagem}>Carregando...</p>
                ) : salas.length > 0 ? (
                    salas.map((sala) => (
                        <div key={sala.id_sala} className={css.filmeCard}>
                            <div className={css.filmeHeader} onClick={() => toggleAccordion(sala.id_sala)}>
                                <div className={css.filmeLabel}>
                                    SALA <span>{sala.nome}</span>
                                </div>
                                <span className={css.seta}>{salaAberta === sala.id_sala ? "▲" : "▼"}</span>
                            </div>

                            {salaAberta === sala.id_sala && (
                                <div className={css.filmeDetalhes}>
                                    <div className={css.infoGrid}>
                                        <div className={css.colEsquerda}>
                                            <h3 className={css.filmeTitulo}>{sala.nome}</h3>
                                            <p><strong>Quantidade de Fileiras:</strong> {sala.qtd_fileiras}</p>
                                            <p><strong>Quantidade de Colunas:</strong> {sala.qtd_colunas}</p>
                                        </div>

                                        <div className={css.acoes}>
                                            <button 
                                                className="px-2 py-1 rounded-3 fw-semibold" 
                                                onClick={() => navigate(`/app/salas/${sala.id_sala}/editar`)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className={css.btnDelete + " bg-white px-2 py-1 rounded-3 fw-semibold"}
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    gatilhoExcluir(sala.id_sala); 
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
                    <p className={css.mensagem}>Nenhuma sala encontrada.</p>
                )}
            </section>

            {totalPaginas > 1 && (
                <section className={css.paginacao}>
                    <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(p => p - 1)}>Anterior</button>
                    <span>{paginaAtual} / {totalPaginas}</span>
                    <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(p => p + 1)}>Próxima</button>
                </section>
            )}

            <button className={css.btnAdd} onClick={() => navigate("/app/salas/criar")}>
                ADICIONAR SALA <span className={css.plusIcon}>+</span>
            </button>
        </main>
    );
}