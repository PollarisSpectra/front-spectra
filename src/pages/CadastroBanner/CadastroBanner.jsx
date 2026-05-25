import { useState } from "react";
import css from "./CadastroBanner.module.css";

export default function CadastroBanner() {
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState("");

    const handleImagem = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("titulo", titulo);
        formData.append("texto", texto);
        formData.append("ativo", ativo);
        formData.append("imagem", imagem);

        console.log("Banner cadastrado");
    };

    return (
        <div className={css["container-banner"]}>

            {/* FORMULÁRIO */}
            <form
                className={css["card-banner"]}
                onSubmit={handleSubmit}
            >
                <h1>CADASTRO DE BANNER</h1>

                {/* IMAGEM */}
                <label className={css["upload-imagem"]}>
                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                        />
                    ) : (
                        <span>Selecionar imagem</span>
                    )}

                    <input
                        type="file"
                        hidden
                        onChange={handleImagem}
                    />
                </label>

                {/* TÍTULO */}
                <div className={css["campo"]}>
                    <label>Título</label>

                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) =>
                            setTitulo(e.target.value)
                        }
                    />
                </div>

                {/* TEXTO */}
                <div className={css["campo"]}>
                    <label>Texto</label>

                    <input
                        type="text"
                        value={texto}
                        onChange={(e) =>
                            setTexto(e.target.value)
                        }
                    />
                </div>

                {/* ATIVO */}
                <div className={css["campo-checkbox"]}>
                    <label>Ativo</label>

                    <input
                        type="checkbox"
                        checked={ativo}
                        onChange={() =>
                            setAtivo(!ativo)
                        }
                    />
                </div>

                {/* BOTÕES */}
                <div className={css["botoes"]}>
                    <button type="submit">
                        SALVAR
                    </button>

                    <button type="button">
                        APLICAR
                    </button>

                    <button
                        type="button"
                        className={css["cancelar"]}
                    >
                        CANCELAR
                    </button>
                </div>
            </form>

            {/* PREVIEW */}
            <div className={css["preview-banner"]}>

                {preview && (
                    <img
                        src={preview}
                        alt="banner"
                    />
                )}

                <div className={css["preview-conteudo"]}>
                    <h3>
                        {titulo || "Título do Banner"}
                    </h3>

                    <p>
                        {texto || "Texto do banner aparecendo em tempo real..."}
                    </p>

                    <span>
                        {ativo ? "ATIVO" : "INATIVO"}
                    </span>
                </div>
            </div>
        </div>
    );
}