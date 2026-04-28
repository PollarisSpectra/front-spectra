import { useState, useRef } from "react";
import css from './EditarFilme.module.css';

export default function EditarFilme() {
    const [filme, setFilme] = useState({
        titulo: "",
        genero: "",
        duracao: "",
        classificacao: "",
        sinopse: "",
        data_lancamento: "",
        trailer: ""
    });

    const [previewCapa, setPreviewCapa] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilme({ ...filme, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewCapa(URL.createObjectURL(file));
        }
    };

    const getBadgeColor = (classificacao) => {
        switch (classificacao) {
            case "L": return "#00a650";
            case "10": return "#00adef";
            case "12": return "#f9e500";
            case "14": return "#f58220";
            case "16": return "#ed1c24";
            case "18": return "#000000";
            default: return "#ff1a1a";
        }
    };

    return (
        <div className={css.containerMain}>
            <div className={css.previewContainer}>
                <div className={css.cardPreview}>
                    <div className={css.capaArea} onClick={() => fileInputRef.current.click()}>
                        {previewCapa ? (
                            <img src={previewCapa} alt="Preview" className={css.imgPreview} />
                        ) : (
                            <div className={css.uploadPlaceholder}>
                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v8M8 12l4 4 4-4" />
                                </svg>
                            </div>
                        )}

                        {filme.classificacao && (
                            <div
                                className={css.classificacaoBadge}
                                style={{
                                    backgroundColor: getBadgeColor(filme.classificacao),
                                    color: filme.classificacao === "12" ? "black" : "white"
                                }}
                            >
                                {filme.classificacao}
                            </div>
                        )}
                    </div>

                    <div className={css.infoPreview}>
                        <div className={css.tituloRow}>
                            <h3>{filme.titulo || "TÍTULO DO FILME"}</h3>
                            <span className={css.estrelas}>★★★★★</span>
                        </div>
                        <div className={css.detalhesRow}>
                            <span><strong>Gênero:</strong> {filme.genero || "..."}</span>
                            <span><strong>Duração:</strong> {filme.duracao || "..."}</span>
                        </div>
                    </div>
                </div>

                <p className={css.sinopseTexto}>
                    <strong>Sinopse:</strong> {filme.sinopse || "..."}
                </p>
            </div>

            <div className={css.formCard}>
                <h1 className={css.formTitulo}>EDIÇÃO DE FILME</h1>

                <form className={css.formulario}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />

                    <div className={css.inputBox}>
                        <label>Gênero</label>
                        <input type="text" name="genero" value={filme.genero} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Título do filme</label>
                        <input type="text" name="titulo" value={filme.titulo} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Duração</label>
                        <input type="text" name="duracao" value={filme.duracao} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Idade Indicativa</label>
                        <select
                            name="classificacao"
                            value={filme.classificacao}
                            onChange={handleChange}
                            className={css.selectStyle}
                        >
                            <option value="">Selecione a idade</option>
                            <option value="L">Livre</option>
                            <option value="10">10</option>
                            <option value="12">12</option>
                            <option value="14">14</option>
                            <option value="16">16</option>
                            <option value="18">18</option>
                        </select>
                    </div>

                    <div className={css.inputBox}>
                        <label>Sinopse</label>
                        <input type="text" name="sinopse" value={filme.sinopse} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Data de Lançamento</label>
                        <input type="date" name="data_lancamento" value={filme.data_lancamento} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Link do trailer</label>
                        <input type="text" name="trailer" value={filme.trailer} onChange={handleChange} />
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                        <button type="button" className={css.btnCadastrar} style={{ marginTop: 0 }}>
                            SALVAR
                        </button>

                        <button type="button" className={css.btnExcluir} style={{ marginTop: 0 }}>
                            EXCLUIR FILME
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}