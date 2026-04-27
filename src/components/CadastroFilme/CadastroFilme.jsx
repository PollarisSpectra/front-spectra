import { useState, useRef } from "react";
import css from './CadastroFilme.module.css';

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

    const [previewCapa, setPreviewCapa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilme({ ...filme, [name]: value });
        // Limpa mensagem ao digitar
        if (message.text) setMessage({ text: '', type: '' });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        // Validação frontend
        if (!filme.titulo.trim() || !filme.sinopse.trim()) {
            setMessage({ text: 'Título e sinopse são obrigatórios!', type: 'error' });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('titulo', filme.titulo.trim().toLowerCase());
        formData.append('sinopse', filme.sinopse.trim().toLowerCase());
        formData.append('genero', filme.genero || '');
        formData.append('duracao', filme.duracao || '');
        formData.append('classificacao', filme.classificacao || '');
        formData.append('data_lancamento', filme.data_lancamento || '');
        formData.append('trailer', filme.trailer || '');

        try {
            const response = await fetch('http://localhost:5000/filmes/cadastro_filme', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Mantém cookies (token)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: data.message, type: 'success' });
                setFilme({ titulo: "", genero: "", duracao: "", classificacao: "", sinopse: "", data_lancamento: "", trailer: "" });
                setPreviewCapa(null);
                fileInputRef.current.value = '';
            } else {
                console.log(data.error)
                setMessage({ text: data.error || 'Erro no cadastro!', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Erro de conexão!', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={css.containerMain}>
            {/* PREVIEW */}
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
                            <h3>{filme.titulo || "TITULO DO FILME"}</h3>
                            <span className={css.estrelas}>★★★★★</span>
                        </div>
                        <div className={css.detalhesRow}>
                            <span><strong>Gênero:</strong> {filme.genero || "..."}</span>
                            <span><strong>Duração:</strong> {filme.duracao || "...."}</span>
                        </div>
                    </div>
                </div>
                <p className={css.sinopseTexto}
                    style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word', 
                        whiteSpace: 'normal'
                    }}>
                    <strong>Sinopse:</strong> {filme.sinopse || "..."}
                </p>
            </div>

            {/* FORMULÁRIO */}
            <div className={css.formCard}>
                <h1 className={css.formTitulo}>CADASTRO DE FILME</h1>

                <form className={css.formulario} onSubmit={handleSubmit}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />

                    {message.text && (
                        <div className={css.message} style={{
                            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: message.type === 'success' ? '#155724' : '#721c24'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div className={css.inputBox}>
                        <label>Gênero</label>
                        <input type="text" name="genero" value={filme.genero} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Título do filme *</label>
                        <input type="text" name="titulo" value={filme.titulo} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Duração</label>
                        <input type="text" name="duracao" value={filme.duracao} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Classificação</label>
                        <select name="classificacao" value={filme.classificacao} onChange={handleChange} className={css.selectStyle}>
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
                        <label>Sinopse *</label>
                        <input 
                            type="text" 
                            name="sinopse" 
                            value={filme.sinopse} 
                            onChange={handleChange}
                            placeholder="Digite a sinopse do filme..."
                        />
                    </div>

                    <div className={css.inputBox}>
                        <label>Data de Lançamento</label>
                        <input type="date" name="data_lancamento" value={filme.data_lancamento} onChange={handleChange} />
                    </div>

                    <div className={css.inputBox}>
                        <label>Link do trailer</label>
                        <input type="text" name="trailer" value={filme.trailer} onChange={handleChange} />
                    </div>

                    <button 
                        type="submit" 
                        className={css.btnCadastrar}
                        disabled={loading}
                    >
                        {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
                    </button>
                </form>
            </div>
        </div>
    );
}