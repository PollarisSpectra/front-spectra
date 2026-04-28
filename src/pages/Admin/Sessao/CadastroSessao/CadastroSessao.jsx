import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import css from "./CadastroSessao.module.css";
import FlashMessage from "../../../../components/FlashMessage/FlashMessage.jsx"; // Importe o componente

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

    // Estados para a FlashMessage
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const fetchOptions = {
                    method: "GET",
                    credentials: "include"
                };

                const resFilmes = await fetch("http://localhost:5000/filmes/listar_filme", fetchOptions);
                const dadosFilmes = await resFilmes.json();

                const resSalas = await fetch("http://localhost:5000/salas/listar_sala", fetchOptions);
                const dadosSalas = await resSalas.json();

                if (resFilmes.ok) {
                    setListaFilmes(dadosFilmes.filmes.map(f => ({ id: f[0], titulo: f[1] })));
                }

                if (resSalas.ok) {
                    setListaSalas(dadosSalas.salas.map(s => ({ id: s.id_sala, nome: s.nome })));
                } else if (resSalas.status === 403) {
                    setMensagem("Acesso negado: Apenas administradores podem carregar salas.");
                    setTipoMensagem("erro");
                }

            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setMensagem("Erro de conexão com o servidor.");
                setTipoMensagem("erro");
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
        setMensagem(""); // Limpa mensagens anteriores

        try {
            const response = await fetch("http://localhost:5000/sessao/cadastro_sessao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(sessao)
            });

            const data = await response.json();

            if (response.ok) {
                setMensagem("Sessão cadastrada com sucesso!");
                setTipoMensagem("sucesso");
                // Aguarda um pouco para o usuário ver a mensagem antes de redirecionar
                setTimeout(() => navigate("/app/sessoes"), 2000);
            } else {
                setMensagem(data.error || "Erro ao cadastrar sessão.");
                setTipoMensagem("erro");
            }
        } catch (error) {
            setMensagem("Erro de rede/servidor.");
            setTipoMensagem("erro");
        }
    };

    return (
        <div className={`${css.containerMain} ${css.darkMode}`}>
            {/* Componente de Mensagem Flash */}
            <FlashMessage 
                mensagem={mensagem} 
                tipo={tipoMensagem} 
                onClose={() => {
                    setMensagem("");
                    setTipoMensagem("");
                }} 
            />

            <div className={`${css.formCard} ${css.formDark}`}>

                <div className={css.header}>
                    <button className={css.btnVoltar} onClick={() => navigate(-1)}>←</button>
                    <h1 className={css.formTitulo}>CADASTRO DE SESSÃO</h1>
                </div>

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

                    {/* SELECT DE SALAS */}
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