import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import css from './EditarFilme.module.css';
import FlashMessage from "../../../../components/FlashMessage/FlashMessage.jsx";

export default function EditarFilme() {
    const { id } = useParams();
    const navigate = useNavigate();

    const formatarData = (dataStr) => {
        if (!dataStr) return "";
        const d = new Date(dataStr);
        if (isNaN(d)) return "";
        return d.toISOString().split('T')[0];
    };

    const estadoVazio = {
        titulo: "", genero: "", duracao: "", classificacao: "",
        sinopse: "", data_lancamento: "", trailer: ""
    };

    const [filme, setFilme] = useState(estadoVazio);
    const [estadoInicial, setEstadoInicial] = useState(estadoVazio);
    const [capaOriginal, setCapaOriginal] = useState(null);
    const [previewCapa, setPreviewCapa] = useState(null);
    const [imagemFile, setImagemFile] = useState(null);
    const [imagemAlterada, setImagemAlterada] = useState(false);
    const [loading, setLoading] = useState(false);
    const [carregando, setCarregando] = useState(true);
    
    // Estados para a FlashMessage unificados
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        const buscarFilme = async () => {
            setCarregando(true);
            try {
                const response = await fetch(`http://localhost:5000/filmes/${id}`, {
                    credentials: 'include'
                });

                const data = await response.json();

                if (!response.ok) {
                    setMensagem(data.error || "Erro ao carregar filme.");
                    setTipoMensagem("erro");
                    return;
                }

                const f = data.filme;
                const estado = {
                    titulo: f.titulo || "",
                    genero: f.genero || "",
                    duracao: f.duracao || "",
                    classificacao: f.classificacao || "",
                    sinopse: f.sinopse || "",
                    data_lancamento: formatarData(f.data_lancamento),
                    trailer: f.trailer || ""
                };
                const capa = f.imagem_url || null;

                setFilme(estado);
                setEstadoInicial(estado);
                setCapaOriginal(capa);
                setPreviewCapa(capa ? `http://localhost:5000/filmes${capa}` : null);
            } catch (err) {
                setMensagem("Erro de conexão com o servidor.");
                setTipoMensagem("erro");
            } finally {
                setCarregando(false);
            }
        };

        buscarFilme();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilme({ ...filme, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagemFile(file);
            setPreviewCapa(URL.createObjectURL(file));
            setImagemAlterada(true);
        }
    };

    const handleCancelarImagem = () => {
        setImagemFile(null);
        setPreviewCapa(capaOriginal ? `http://localhost:5000/filmes${capaOriginal}` : null);
        setImagemAlterada(false);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSalvar = async () => {
        setLoading(true);
        setMensagem("");

        try {
            const formData = new FormData();
            formData.append('titulo', filme.titulo);
            formData.append('sinopse', filme.sinopse);
            formData.append('genero', filme.genero);
            formData.append('duracao', filme.duracao);
            formData.append('classificacao', filme.classificacao);
            formData.append('data_lancamento', filme.data_lancamento);
            formData.append('trailer', filme.trailer);

            if (imagemFile) {
                formData.append('imagem', imagemFile);
            }

            const response = await fetch(`http://localhost:5000/filmes/editar_filme/${id}`, {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                setMensagem(data.error || "Erro ao salvar filme.");
                setTipoMensagem("erro");
            } else {
                setEstadoInicial(filme);
                setImagemAlterada(false);
                setImagemFile(null);
                setMensagem(data.message || "Filme atualizado com sucesso!");
                setTipoMensagem("sucesso");
            }
        } catch (error) {
            setMensagem("Erro de conexão com o servidor.");
            setTipoMensagem("erro");
        } finally {
            setLoading(false);
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

    if (carregando) return <div className={css.carregando}>Carregando...</div>;

    return (
        <div className={css.containerMain}>
            <FlashMessage 
                mensagem={mensagem} 
                tipo={tipoMensagem} 
                onClose={() => {
                    setMensagem("");
                    setTipoMensagem("");
                }} 
            />

            <header className={css.header}>
                <button className={css.voltar} onClick={() => navigate(-1)}>←</button>
                <h1 className={css.formTituloPrincipal}>EDIÇÃO DE FILME</h1>
            </header>

            <div className={css.conteudoFlex}>
                <div className={css.previewContainer}>
                    <div className={css.cardPreview}>
                        <div className={css.capaArea} onClick={() => fileInputRef.current.click()}>
                            {previewCapa ? (
                                <img src={previewCapa} alt="Preview" className={css.imgPreview} />
                            ) : (
                                <div className={css.uploadPlaceholder}>
                                    <span>CLIQUE PARA UPLOAD DA CAPA</span>
                                </div>
                            )}

                            <div className={css.capaOverlay}>
                                {imagemAlterada ? (
                                    <button type="button" className={css.btnCancelarImagem} onClick={(e) => { e.stopPropagation(); handleCancelarImagem(); }}>
                                        ✕ Cancelar
                                    </button>
                                ) : (
                                    <button type="button" className={css.btnTrocarImagem}>
                                       
                                    </button>
                                )}
                            </div>

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
                    <form className={css.formulario}>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />

                        <div className={css.inputBox}>
                            <label>Título do filme</label>
                            <input type="text" name="titulo" value={filme.titulo} onChange={handleChange} />
                        </div>

                        <div className={css.inputBox}>
                            <label>Gênero</label>
                            <input type="text" name="genero" value={filme.genero} onChange={handleChange} />
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
                            <label>Sinopse</label>
                            <textarea name="sinopse" value={filme.sinopse} onChange={handleChange} />
                        </div>

                        <div className={css.inputBox}>
                            <label>Data de Lançamento</label>
                            <input type="date" name="data_lancamento" value={filme.data_lancamento} onChange={handleChange} />
                        </div>

                        <div className={css.inputBox}>
                            <label>Link do trailer</label>
                            <input type="text" name="trailer" value={filme.trailer} onChange={handleChange} />
                        </div>

                        <div className={css.acoesForm}>
                            <button type="button" className={css.btnSalvar} onClick={handleSalvar} disabled={loading}>
                                {loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}