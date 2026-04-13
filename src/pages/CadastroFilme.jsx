import { useState } from "react";
import { Link } from "react-router-dom";
import css from './FormCadastroFilme.module.css'; // Crie este arquivo com o CSS abaixo
import FlashMessage from '../FlashMessage/FlashMessage';

export default function CadastroFilme() {
    const [filme, setFilme] = useState({
        titulo: "",
        genero: "",
        duracao: "",
        classificacao: "",
        sinopse: "",
        data_lancamento: "",
        trailer: ""
    });

    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    // Função para atualizar os campos do estado
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilme(prev => ({ ...prev, [name]: value }));
    };

    async function cadastrarFilme(e) {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(filme).forEach(key => formData.append(key, filme[key]));

        try {
            const resposta = await fetch("http://localhost:5000/filmes/cadastro_filme", {
                method: "POST",
                body: formData // O Flask recebe via request.form
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setMensagem("FILME CADASTRADO COM SUCESSO!");
                setTipoMensagem("sucesso");
                // Limpa o formulário após sucesso
                setFilme({ titulo: "", genero: "", duracao: "", classificacao: "", sinopse: "", data_lancamento: "", trailer: "" });
            } else {
                setMensagem(dados.error || "ERRO AO CADASTRAR");
                setTipoMensagem("erro");
            }
        } catch (error) {
            setMensagem("ERRO AO CONECTAR COM A API");
            setTipoMensagem("erro");
        }
    }

    return (
        <div className={css.containerMain}>
            <FlashMessage
                mensagem={mensagem}
                tipo={tipoMensagem}
                onClose={() => setMensagem("")}
            />

            <div className={css.cardCadastro}>
                <h1 className={css.tituloPagina}>CADASTRO DE FILME</h1>

                <form onSubmit={cadastrarFilme} className={css.formFilme}>
                    <div className={css.inputGroup}>
                        <label>Gênero</label>
                        <input type="text" name="genero" value={filme.genero} onChange={handleChange} required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Título do filme</label>
                        <input type="text" name="titulo" value={filme.titulo} onChange={handleChange} required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Duração</label>
                        <input type="text" name="duracao" placeholder="Ex: 120 min" value={filme.duracao} onChange={handleChange} required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Classificação</label>
                        <input type="text" name="classificacao" value={filme.classificacao} onChange={handleChange} required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Sinopse</label>
                        <textarea name="sinopse" value={filme.sinopse} onChange={handleChange} required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Data de Lançamento</label>
                        <input type="date" name="data_lancamento" value={filme.data_lancamento} onChange={handleChange} required />
                    </div>

                    <div className={css.inputGroup}>
                        <label>Link do trailer</label>
                        <input type="url" name="trailer" value={filme.trailer} onChange={handleChange} />
                    </div>

                    <button type="submit" className={css.btnCadastrar}>CADASTRAR</button>
                </form>
            </div>
        </div>
    );
}