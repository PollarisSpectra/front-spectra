import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarSala.module.css";

export default function ListarSala() {
    const navigate = useNavigate();
    const [salas, setSalas] = useState([]);
    const [salaAberta, setSalaAberta] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const [buscaTexto, setBuscaTexto] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [message, setMessage] = useState({ text: "", type: "" });

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

    const excluirSala = async (id) => {
        if (!window.confirm("Deseja realmente excluir esta sala?")) return;
        try {
            const response = await fetch(`http://localhost:5000/salas/excluir_sala/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setMessage({ text: data.message, type: "success" });
                buscarSalas(paginaAtual);
            } else {
                setMessage({ text: data.error, type: "error" });
            }
        } catch (error) {
            alert("Erro de conexão com o servidor");
        }
    };

    return (
        <main className={css.container}>
            {message.text && (
                <div className={`${css.messageBox} ${css[message.type]}`}>
                    {message.text}
                </div>
            )}

            <section className={css.header}>
                <button className={css.voltar} onClick={() => navigate(-1)}>←</button>
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
                    salas.map((sala, index) => (
                        <div key={sala.id_sala} className={css.filmeCard}>
                            <div className={css.filmeHeader} onClick={() => toggleAccordion(sala.id_sala)}>
                                <div className={css.filmeLabel}>
                                    SALA <span>Id: {sala.id_sala}</span>
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
                                            <button className={css.btnEdit} onClick={() => navigate(`/app/salas/${sala.id_sala}/editar`)}>✎</button>
                                            <button className={css.btnDelete} onClick={() => excluirSala(sala.id_sala)}>Excluir</button>
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
                ADICIONAR SALA <span className={css.plusCircle}>+</span>
            </button>
        </main>
    );
}