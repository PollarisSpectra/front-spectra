import { useState } from "react";
import { useNavigate } from "react-router-dom";
import css from "./CadastroBanner.module.css";
import FlashMessage from "../../components/FlashMessage/FlashMessage";

export default function CadastroBanner() {
    const navigate = useNavigate();

    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState("");

    const [mensagem, setMensagem] = useState("");
    const [tipo, setTipo] = useState("");

    const handleImagem = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("titulo", titulo);
            formData.append("texto", texto);
            formData.append("situacao", ativo ? "1" : "0");

            if (imagem) {
                formData.append("imagem", imagem);
            }

            const response = await fetch("http://localhost:5000/banner/cadastro", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setMensagem(data.message || "Banner cadastrado com sucesso!");
                setTipo("sucesso");
                setTimeout(() => {
                    navigate("/banners");
                }, 1500);
            } else {
                setMensagem(data.error || "Erro ao cadastrar banner");
                setTipo("erro");
            }
        } catch (error) {
            setMensagem("Erro ao conectar com o servidor");
            setTipo("erro");
        }
    };

    return (
        <section className={css.header}>
            <div className={css["container-banner"]}>
                <FlashMessage
                    mensagem={mensagem}
                    tipo={tipo}
                    onClose={() => {
                        setMensagem("");
                        setTipo("");
                    }}
                />

                {/* FORMULÁRIO */}
                <form className={css["card-banner"]} onSubmit={handleSubmit}>
                    {/* A SETA AGORA FICA AQUI DENTRO */}
                    <button type="button" className={css.voltar} onClick={() => navigate("/app/banners")}>
                        ←
                    </button>

                    <h1>CADASTRO DE BANNER</h1>

                    {/* IMAGEM */}
                    <label className={css["upload-imagem"]}>
                        {preview ? <img src={preview} alt="preview" /> : <span>Selecionar imagem</span>}
                        <input type="file" hidden onChange={handleImagem} />
                    </label>

                    {/* TÍTULO */}
                    <div className={css["campo"]}>
                        <label>Título</label>
                        <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                    </div>

                    {/* TEXTO */}
                    <div className={css["campo"]}>
                        <label>Texto</label>
                        <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} />
                    </div>

                    {/* BOTÕES */}
                    <div className={css["botoes"]}>
                        <button type="submit">SALVAR</button>
                        <button type="button" className={css["cancelar"]} onClick={() => navigate("/banners")}>
                            CANCELAR
                        </button>
                    </div>
                </form>

                {/* PREVIEW */}
                <div className={css["preview-banner"]}>
                    {preview && <img src={preview} alt="banner" />}
                    <div className={css["preview-conteudo"]}>
                        <h3>{titulo || "Título do Banner"}</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}