import { useState } from "react";
import css from "./CadastroSessao.module.css";

export default function CadastroSessao() {
    const [sessao, setSessao] = useState({
        filme: "",
        sala: "",
        horario: "",
        data: "",
        status: "",
        preco_assento: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSessao({ ...sessao, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(sessao);
    };

    return (
        <div className={css.containerMain + " " + css.darkMode}>
            <div className={css.formCard + " " + css.formDark}>

                <div className={css.header}>
                    <button className={css.btnVoltar}>←</button>
                    <h1 className={css.formTitulo}>CADASTRO DE SESSÃO</h1>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className={css.inputBox}>
                        <label>Filme:</label>
                        <input type="text" name="filme" onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Sala</label>
                        <input type="text" name="sala" onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Horário</label>
                        <input type="time" name="horario" onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Data</label>
                        <input type="date" name="data" onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Status</label>
                        <select name="status" onChange={handleChange} className={css.selectStyle}>
                            <option value="">Selecione</option>
                            <option value="Ativa">Ativa</option>
                            <option value="Inativa">Inativa</option>
                            <option value="Cancelada">Cancelada</option>
                        </select>
                    </div>

                    <div className={css.inputBox}>
                        <label>Preço por assentos</label>
                        <input type="number" name="preco_assento" onChange={handleChange} />
                    </div>

                    <button type="submit" className={css.btnCadastrar}>
                        CADASTRAR
                    </button>

                </form>
            </div>
        </div>
    );
}