import { useState, useEffect } from "react";
import css from "./EditarSessao.module.css";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarSessao() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [listaFilmes, setListaFilmes] = useState([]);
    const [listaSalas, setListaSalas] = useState([]);

    const [sessao, setSessao] = useState({
        id_filme: "",
        id_sala: "",
        horario: "",
        data: "",
        valor_assento: ""
    });

    const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const options = {
                    method: "GET",
                    credentials: "include"
                };

                const resFilmes = await fetch("http://localhost:5000/filmes/listar_filme", options);
                const dadosFilmes = await resFilmes.json();

                const resSalas = await fetch("http://localhost:5000/salas/listar_sala", options);
                const dadosSalas = await resSalas.json();

                const resSessoes = await fetch("http://localhost:5000/sessao/listar_sessao", options);
                const dadosSessoes = await resSessoes.json();

                if (resFilmes.ok) {
                    setListaFilmes(dadosFilmes.filmes.map(f => ({
                        id: f[0],
                        titulo: f[1]
                    })));
                }

                if (resSalas.ok) {
                    setListaSalas(dadosSalas.salas.map(s => ({
                        id: s[0],
                        nome: s[1]
                    })));
                }

                if (resSessoes.ok) {
                    const sessaoEncontrada = dadosSessoes.sessao.find(
                        item => item.id_sessao == id
                    );

                    if (sessaoEncontrada) {
                        setSessao({
                            id_filme: sessaoEncontrada.id_filme || "",
                            id_sala: sessaoEncontrada.id_sala || "",
                            horario: sessaoEncontrada.horario || "",
                            data: sessaoEncontrada.data || "",
                            valor_assento: sessaoEncontrada.valor_assento || ""
                        });
                    }
                }

            } catch (error) {
                setMensagem({ texto: "Erro ao carregar dados.", tipo: "erro" });
            }
        };

        carregarDados();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSessao({ ...sessao, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/sessao/editar_sessao/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessao)
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({ texto: "Sessão editada com sucesso!", tipo: "sucesso" });
                setTimeout(() => navigate("/app/sessoes"), 1500);
            } else {
                setMensagem({ texto: data.error || "Erro ao editar sessão.", tipo: "erro" });
            }
        } catch (error) {
            setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
        }
    };

    const handleExcluir = async () => {
        if (!window.confirm("Tem certeza que deseja excluir esta sessão?")) return;

        try {
            const response = await fetch(`http://localhost:5000/sessao/excluir_sessao/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({ texto: "Sessão excluída com sucesso!", tipo: "sucesso" });

                setTimeout(() => {
                    navigate("/app/sessoes");
                }, 1500);
            } else {
                setMensagem({ texto: data.error || "Erro ao excluir sessão.", tipo: "erro" });
            }
        } catch (error) {
            setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
        }
    };

    return (
        <div className={`${css.containerMain} ${css.darkMode}`}>
            <div className={`${css.formCard} ${css.formDark}`}>

                <div className={css.header}>
                    <button type="button" className={css.btnVoltar} onClick={() => navigate(-1)}>←</button>
                    <h1 className={css.formTitulo}>EDIÇÃO DE SESSÃO</h1>
                </div>

                {mensagem.texto && (
                    <div className={`${css.statusMsg} ${css[mensagem.tipo]}`}>
                        {mensagem.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={css.inputBox}>
                        <label>Filme:</label>
                        <select
                            name="id_filme"
                            value={sessao.id_filme}
                            onChange={handleChange}
                            required
                            className={css.selectStyle}
                        >
                            <option value="">Selecione o Filme</option>
                            {listaFilmes.map(f => (
                                <option key={f.id} value={f.id}>
                                    {f.titulo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={css.inputBox}>
                        <label>Sala:</label>
                        <select
                            name="id_sala"
                            value={sessao.id_sala}
                            onChange={handleChange}
                            required
                            className={css.selectStyle}
                        >
                            <option value="">Selecione a Sala</option>
                            {listaSalas.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={css.inputBox}>
                        <label>Horário:</label>
                        <input
                            type="time"
                            name="horario"
                            value={sessao.horario}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={css.inputBox}>
                        <label>Data:</label>
                        <input
                            type="date"
                            name="data"
                            value={sessao.data}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={css.inputBox}>
                        <label>Preço por assento:</label>
                        <input
                            type="text"
                            name="valor_assento"
                            value={sessao.valor_assento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={css.botoes}>
                        <button type="submit" className={css.btnCadastrar}>
                            Salvar edições
                        </button>

                        <button
                            type="button"
                            className={css.btnExcluir}
                            onClick={handleExcluir}
                        >
                            Excluir sessão
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}