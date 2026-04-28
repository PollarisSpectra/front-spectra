import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./CadastroSessao.module.css";

export default function CadastroSessao() {
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
                // Opções do fetch para incluir cookies (Token)
                const fetchOptions = {
                    method: "GET",
                    credentials: "include"
                };

                // Busca Filmes
                const resFilmes = await fetch("http://localhost:5000/filmes/listar_filme", fetchOptions);
                const dadosFilmes = await resFilmes.json();

                // Busca Salas (Usando sua rota nova)
                const resSalas = await fetch("http://localhost:5000/salas/listar_sala", fetchOptions);
                const dadosSalas = await resSalas.json();

                if (resFilmes.ok) {
                    // Mapeia Filme: [0]=ID, [1]=Titulo
                    setListaFilmes(dadosFilmes.filmes.map(f => ({ id: f[0], titulo: f[1] })));
                }

                if (resSalas.ok) {
                    // Mapeia Sala: [0]=ID, [1]=Nome
                    setListaSalas(dadosSalas.salas.map(s => ({ id: s[0], nome: s[1] })));
                } else if (resSalas.status === 403) {
                    setMensagem({ texto: "Acesso negado: Apenas administradores podem carregar salas.", tipo: "erro" });
                }

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setMensagem({ texto: "Erro de conexão com o servidor.", tipo: "erro" });
            }
        };

        carregarDados();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSessao({ ...sessao, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ texto: "Cadastrando...", tipo: "info" });

        try {
            const response = await fetch("http://localhost:5000/sessao/cadastro_sessao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(sessao)
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem({ texto: "Sessão cadastrada com sucesso!", tipo: "sucesso" });
                setTimeout(() => navigate("/app/sessoes"), 2000);
            } else {
                setMensagem({ texto: data.error || "Erro ao cadastrar", tipo: "erro" });
            }
        } catch (error) {
            setMensagem({ texto: "Erro de rede.", tipo: "erro" });
        }
    };

    return (
        <div className={`${css.containerMain} ${css.darkMode}`}>
            <div className={`${css.formCard} ${css.formDark}`}>

                <div className={css.header}>
                    <button className={css.btnVoltar} onClick={() => navigate(-1)}>←</button>
                    <h1 className={css.formTitulo}>CADASTRO DE SESSÃO</h1>
                </div>

                {mensagem.texto && (
                    <div className={`${css.statusMsg} ${css[mensagem.tipo]}`}>
                        {mensagem.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* SELECT DE FILMES */}
                    <div className={css.inputBox}>
                        <label>Filme:</label>
                        <select name="id_filme" value={sessao.id_filme} onChange={handleChange} required className={css.selectStyle}>
                            <option value="">Selecione o Filme</option>
                            {listaFilmes.map(f => (
                                <option key={f.id} value={f.id}>{f.titulo}</option>
                            ))}
                        </select>
                    </div>

                    {/* SELECT DE SALAS (ADAPTADO) */}
                    <div className={css.inputBox}>
                        <label>Sala:</label>
                        <select name="id_sala" value={sessao.id_sala} onChange={handleChange} required className={css.selectStyle}>
                            <option value="">Selecione a Sala</option>
                            {listaSalas.map(s => (
                                <option key={s.id} value={s.id}>{s.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className={css.inputBox}>
                        <label>Horário:</label>
                        <input type="time" name="horario" value={sessao.horario} onChange={handleChange} required />
                    </div>

                    <div className={css.inputBox}>
                        <label>Data:</label>
                        <input type="date" name="data" value={sessao.data} onChange={handleChange} required />
                    </div>

                    <div className={css.inputBox}>
                        <label>Preço por assento (R$):</label>
                        <input
                            type="text"
                            name="valor_assento"
                            placeholder="00,00"
                            value={sessao.valor_assento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className={css.btnCadastrar}>
                        SALVAR SESSÃO
                    </button>
                </form>
            </div>
        </div>
    );
}