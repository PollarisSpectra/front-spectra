import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./ListarUsuario.module.css";
import ModalDecisao from "../../../../components/ModalDecisao/ModalDecisao";
import FlashMessage from "../../../../components/FlashMessage/FlashMessage.jsx";

export default function ListarUsuario() {
    const navigate = useNavigate();

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioAberto, setUsuarioAberto] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const [buscaTexto, setBuscaTexto] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("nome");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [menuFiltroAtivo, setMenuFiltroAtivo] = useState(false);

    const [exibirModalExcluir, setExibirModalExcluir] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);

    const conversaoCheck = {
        nome: "Nome",
        email: "Email",
        tipo: "Tipo"
    };

    const buscarUsuarios = async (pagina = 1) => {
        setCarregando(true);

        try {
            let queryParams = `page_number=${pagina}&page_size=10`;

            if (buscaTexto) {
                queryParams += `&${filtroTipo}=${encodeURIComponent(buscaTexto)}`;
            }

            const response = await fetch(`http://localhost:5000/usuarios/?${queryParams}`, {
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setUsuarios(data.usuarios);
                setTotalPaginas(data.total_pages);
                setPaginaAtual(pagina);
            } else {
                setUsuarios([]);
                setMensagem(data.error || "Nenhum usuário encontrado.");
                setTipoMensagem("erro");
            }
        } catch (error) {
            setMensagem("Erro ao carregar usuários.");
            setTipoMensagem("erro");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarUsuarios(paginaAtual);
    }, [paginaAtual]);

    const dispararBusca = (e) => {
        e.preventDefault();
        setMensagem("");
        setPaginaAtual(1);
        buscarUsuarios(1);
    };

    const toggleAccordion = (id) => {
        setUsuarioAberto(usuarioAberto === id ? null : id);
    };

    const gatilhoExcluir = (id) => {
        setIdParaExcluir(id);
        setExibirModalExcluir(true);
    };

    const confirmarExclusao = async () => {
        setMensagem("");

        try {
            const response = await fetch(`http://localhost:5000/usuarios/${idParaExcluir}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem("Usuário inativado com sucesso!");
                setTipoMensagem("sucesso");
                setUsuarioAberto(null);
                await buscarUsuarios();
            } else {
                setMensagem(data.error || data.message || "Erro ao inativar usuário.");
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

    const mostrarTipo = (tipo) => {
        if (tipo === 0 || tipo === "0") {
            return "Administrador";
        }

        return "Cliente";
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
                    titulo="Tem certeza que deseja inativar este usuário?"
                    textoConfirmar="Sim, inativar"
                    textoCancelar="Cancelar"
                    tipoAcao="perigo"
                    aoConfirmar={confirmarExclusao}
                    aoCancelar={() => setExibirModalExcluir(false)}
                />
            )}

            <section className={css.header}>
                <button className={css.voltar} onClick={() => navigate("/app")}>
                    ←
                </button>

                <h1 className={css.formTitulo}>USUÁRIOS</h1>
            </section>

            <section className={css.filtroBarra}>
                <form className={css.formBusca} onSubmit={dispararBusca}>
                    <input
                        type="text"
                        placeholder={`Buscar por ${conversaoCheck[filtroTipo].toLowerCase()}...`}
                        value={buscaTexto}
                        onChange={(e) => setBuscaTexto(e.target.value)}
                        className={css.inputBusca}
                    />

                    <button type="submit" className={css.btnFiltro}>
                        Aplicar filtros
                    </button>
                </form>

                <div className={css.areaFiltro}>
                    <span className={css.textoFiltro}>Filtrar por:</span>

                    <div className={css.ordenarWrapper}>
                        <div
                            className={css.ordenarHeader}
                            onClick={() => setMenuFiltroAtivo(!menuFiltroAtivo)}
                        >
                            <span>{conversaoCheck[filtroTipo]}</span>
                            <span>{menuFiltroAtivo ? "▲" : "▼"}</span>
                        </div>

                        {menuFiltroAtivo && (
                            <ul className={css.ordenarOpcoes}>
                                <li onClick={() => {
                                    setFiltroTipo("nome");
                                    setMenuFiltroAtivo(false);
                                }}>
                                    Nome
                                </li>

                                <li onClick={() => {
                                    setFiltroTipo("email");
                                    setMenuFiltroAtivo(false);
                                }}>
                                    Email
                                </li>

                                <li onClick={() => {
                                    setFiltroTipo("tipo");
                                    setMenuFiltroAtivo(false);
                                }}>
                                    Tipo
                                </li>


                            </ul>
                        )}
                    </div>
                </div>
            </section>

            <section className={css.lista}>
                {carregando ? (
                    <p className={css.mensagem}>Carregando...</p>
                ) : usuarios.length > 0 ? (
                    usuarios.map((usuario) => (
                        <div key={usuario.id_usuario} className={css.usuarioCard}>
                            <div
                                className={css.usuarioHeader}
                                onClick={() => toggleAccordion(usuario.id_usuario)}
                            >
                                <div className={css.usuarioLabel}>
                                    USUÁRIO <span>{usuario.nome}</span>
                                </div>

                                <span className={css.seta}>
                                    {usuarioAberto === usuario.id_usuario ? "▲" : "▼"}
                                </span>
                            </div>

                            {usuarioAberto === usuario.id_usuario && (
                                <div className={css.usuarioDetalhes}>
                                    <div className={css.infoGrid}>
                                        <div>
                                            <h3>{usuario.nome}</h3>
                                            <p><strong>Email:</strong> {usuario.email}</p>
                                            <p><strong>Tipo:</strong> {mostrarTipo(usuario.tipo)}</p>
                                            <p><strong>Situação:</strong>{" "}
                                                {usuario.situacao === 0 ? "Ativo" : "Inativo"}
                                            </p>
                                        </div>

                                        <div className={css.acoes}>

                                            <button
                                                onClick={() =>
                                                    navigate(`/app/usuarios/${usuario.id_usuario}/editar`, {
                                                        state: { usuario }
                                                    })
                                                }
                                            >
                                                Editar
                                            </button>

                                            {usuario.tipo === 1 && usuario.situacao === 0 && (
                                                <button
                                                    className={css.btnDelete}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        gatilhoExcluir(usuario.id_usuario);
                                                    }}
                                                >
                                                    Inativar
                                                </button>
                                            )}

                                            {usuario.tipo === 1 && usuario.situacao === 1 && (
                                                <button
                                                    className={css.btnReativar}
                                                    onClick={async (e) => {

                                                        e.stopPropagation();

                                                        try {

                                                            const response = await fetch(
                                                                `http://localhost:5000/usuarios/desbloquear_usuario/${usuario.id_usuario}`,
                                                                {
                                                                    method: "PUT",
                                                                    credentials: "include"
                                                                }
                                                            );

                                                            const data = await response.json();

                                                            if (response.ok) {

                                                                setMensagem("Usuário reativado com sucesso!");
                                                                setTipoMensagem("sucesso");

                                                                await buscarUsuarios();

                                                            } else {

                                                                setMensagem(data.error || "Erro ao reativar usuário.");
                                                                setTipoMensagem("erro");
                                                            }

                                                        } catch (error) {

                                                            setMensagem("Erro de conexão com o servidor.");
                                                            setTipoMensagem("erro");
                                                        }
                                                    }}
                                                >
                                                    Reativar
                                                </button>
                                            )}


                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={css.mensagem}>Nenhum usuário encontrado.</p>
                )}
            </section>

            {totalPaginas > 1 && (
                <section className={css.paginacao}>
                    <button
                        disabled={paginaAtual === 1}
                        onClick={() => setPaginaAtual(p => p - 1)}
                    >
                        Anterior
                    </button>

                    <span>{paginaAtual} / {totalPaginas}</span>

                    <button
                        disabled={paginaAtual === totalPaginas}
                        onClick={() => setPaginaAtual(p => p + 1)}
                    >
                        Próxima
                    </button>
                </section>
            )}

            <button
                className={css.btnAdd}
                onClick={() => navigate("/cadastro")}
            >
                ADICIONAR USUÁRIO <span>+</span>
            </button>
        </main>
    );
}