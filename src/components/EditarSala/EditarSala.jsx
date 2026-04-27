import { useState } from "react";
import css from "./EditarSala.module.css";

export default function EditarSala() {
    const [sala, setSala] = useState({
        nome: "",
        fileiras: 0,
        colunas: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Converte para número para validar
        let val = parseInt(value);

        // Se o campo estiver vazio, define como 0 para não quebrar a lógica
        if (isNaN(val) || val < 0) {
            val = 0;
        }

        // Mantém os limites máximos que você pediu
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

    return (
        <div className={css.mainContainer}>
            <div className={css.cardCadastro}>
                <h1 className={css.titulo}>EDIÇÃO DE SALA</h1>

                <div className={css.formulario}>
                    <div className={css.inputBox}>
                        <label>Nome</label>
                        <input
                            type="text"
                            name="fileiras"
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
                        <button className={css.btnCadastrar}>Salvar edições</button>
                        <button className={css.btnExcluir}>Excluir sala</button>
                    </div>
                </div>
            </div>
        </div>
    );
}