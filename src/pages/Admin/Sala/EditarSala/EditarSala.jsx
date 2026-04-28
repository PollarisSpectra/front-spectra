import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import css from "./EditarSala.module.css";

export default function EditarSala() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sala, setSala] = useState({
        nome: "",
        fileiras: 0,
        colunas: 0,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        buscarSala();
    }, [id]);

    const buscarSala = async () => {
        try {
            const response = await fetch(`http://localhost:5000/salas/listar_sala?id_sala=${id}`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                const salaEncontrada = data.salas[0];

                setSala({
                    nome: salaEncontrada.nome,
                    fileiras: salaEncontrada.qtd_fileiras,
                    colunas: salaEncontrada.qtd_colunas
                });
            } else {
                setMessage({ text: data.error || "Erro ao buscar sala", type: "error" });
            }

        } catch (error) {
            setMessage({ text: "Erro de conexão com o servidor", type: "error" });
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "nome") {
            setSala({ ...sala, nome: value });
            return;
        }

        let val = parseInt(value);

        if (isNaN(val) || val < 0) {
            val = 0;
        }

        if (name === "fileiras" && val > 26) val = 26;
        if (name === "colunas" && val > 28) val = 28;

        setSala({ ...sala, [name]: val });
    };

    // Função para transformar número em letra (1 -> A, 2 -> B...)
    const getLetra = (index) => String.fromCharCode(65 + index);

    // Gera o array de fileiras e colunas para o preview
    const renderCadeiras = () => {
        const totalFileiras = Math.max(0, parseInt(sala.fileiras) || 0);
        const totalColunas = Math.max(0, parseInt(sala.colunas) || 0);

        return Array.from({ length: totalFileiras }).map((_, fIndex) => (
            <div key={fIndex} className={css.fila}>
                <span className={css.letraFila}>{getLetra(fIndex)}</span>
                <div className={css.assentosContainer}>
                    {Array.from({ length: totalColunas }).map((_, cIndex) => (
                        <div key={cIndex} className={css.assento}>
                            {cIndex + 1}
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    const handleSalvar = async () => {
        if (!sala.nome.trim() || sala.fileiras === 0 || sala.colunas === 0) {
            setMessage({ text: "Todos os campos são obrigatórios!", type: "error" });
            return;
        }

        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const response = await fetch(`http://localhost:5000/salas/editar_sala/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    nome: sala.nome.trim(),
                    qtd_fileiras: sala.fileiras,
                    qtd_colunas: sala.colunas
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.message || "Sala editada com sucesso!", type: "success" });
            } else {
                setMessage({ text: data.error || "Erro ao editar sala", type: "error" });
            }

        } catch (error) {
            setMessage({ text: "Erro de conexão com o servidor", type: "error" });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExcluir = async () => {
            try {
                const response = await fetch(`http://localhost:5000/salas/excluir_sala/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage({ text: data.message || "Sala excluída com sucesso!", type: "success" });

                    setTimeout(() => {
                        navigate("/app/salas");
                    }, 1500);
                } else {
                    setMessage({ text: data.error || "Erro ao excluir sala", type: "error" });
                }

            } catch (error) {
                setMessage({ text: "Erro de conexão com o servidor", type: "error" });
                console.error(error);
            }
        };

    return (

        <div className={css.mainContainer}>

            <div className={css.cardCadastro}>
                <h1 className={css.titulo}>EDIÇÃO DE SALA</h1>

                <div className={css.formulario}>
                    {message.text && (
                        <div className={`${css.messageBox} ${css[message.type]}`}>
                            {message.text}
                        </div>
                    )}

                    <div className={css.inputBox}>
                        <label>Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={sala.nome}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={css.inputBox}>
                        <label>Quantidade de Fileiras (Max: 26 - Z)</label>
                        <input
                            type="number"
                            min="0"
                            name="fileiras"
                            max="26"
                            value={sala.fileiras}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={css.inputBox}>
                        <label>Quantidade de Colunas (Max: 28)</label>
                        <input
                            type="number"
                            name="colunas"
                            min="0"
                            max="28"
                            value={sala.colunas}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Área do Mapa de Assentos */}
                    <div className={css.mapaAssentos}>
                        {sala.fileiras > 0 && sala.colunas > 0 ? (
                            renderCadeiras()
                        ) : (
                            <p className={css.placeholder}>Defina o tamanho da sala para ver o mapa</p>
                        )}
                    </div>

                    <div className={css.botoes}>
                        <button
                            className={css.btnCadastrar}
                            onClick={handleSalvar}
                            disabled={loading}
                        >
                            {loading ? "Salvando..." : "Salvar edições"}
                        </button>

                        <button
                            className={css.btnExcluir}
                            onClick={handleExcluir}
                        >
                            Excluir sala
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}