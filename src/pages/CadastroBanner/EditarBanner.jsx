import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import css from "./CadastroBanner.module.css";
import ModalDecisao from "../../components/ModalDecisao/ModalDecisao";

export default function EditarBanner() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState("");
    const [modalExcluir, setModalExcluir] = useState(false);

    useEffect(() => {

        buscarBanner();

    }, []);

    async function buscarBanner() {

        try {

            const response = await fetch(
                `http://localhost:5000/banner/${id}`
            );

            const data = await response.json();

            console.log(data);

            setTitulo(data.titulo || "");

            setTexto(data.texto || "");

            setAtivo(
                data.situacao === "1"
            );

            if (data.imagem) {
                setPreview(`http://localhost:5000/${data.imagem}`);
            }

        } catch (error) {

            console.log(error);

        }
    }

    // TROCAR IMAGEM
    const handleImagem = (e) => {

        const file = e.target.files[0];

        if (file) {

            setImagem(file);

            setPreview(
                URL.createObjectURL(file)
            );
        }
    };

    // EDITAR
    async function handleEditar(e) {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append(
                "titulo",
                titulo
            );

            formData.append(
                "texto",
                texto
            );

            formData.append(
                "situacao",
                ativo ? "1" : "0"
            );

            if (imagem) {

                formData.append(
                    "imagem",
                    imagem
                );
            }

            const response = await fetch(
                `http://localhost:5000/banner/editar/${id}`,
                {
                    method: "PUT",
                    body: formData,
                    credentials: "include",
                }
            );

            const data = await response.json();

            alert(data.message);

            navigate("/banners");

        } catch (error) {

            console.log(error);

        }
    }

    // EXCLUIR
    async function handleExcluir() {

        try {

            const response = await fetch(
                `http://localhost:5000/banner/excluir/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            alert(data.message);

            navigate("/banners");

        } catch (error) {

            console.log(error);

        }
    }

    return (

        <div className={css["container-banner"]}>

            {/* FORMULÁRIO */}
            <form
                className={css["card-banner"]}
                onSubmit={handleEditar}
            >

                <h1>
                    EDITAR BANNER
                </h1>

                {/* IMAGEM */}
                <label className={css["upload-imagem"]}>

                    {preview ? (

                        <img
                            src={preview}
                            alt="preview"
                        />

                    ) : (

                        <span>
                            Selecionar imagem
                        </span>

                    )}

                    <input
                        type="file"
                        hidden
                        onChange={handleImagem}
                    />

                </label>

                {/* TÍTULO */}
                <div className={css["campo"]}>

                    <label>
                        Título
                    </label>

                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) =>
                            setTitulo(
                                e.target.value
                            )
                        }
                    />

                </div>

                {/* TEXTO */}
                <div className={css["campo"]}>

                    <label>
                        Texto
                    </label>

                    <input
                        type="text"
                        value={texto}
                        onChange={(e) =>
                            setTexto(
                                e.target.value
                            )
                        }
                    />

                </div>

                {/* CHECKBOX */}
                <div className={css["campo-checkbox"]}>

                    <label>
                        Ativo
                    </label>

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

                    <button
                        type="button"
                        className={css["excluir"]}
                        onClick={() =>
                            setModalExcluir(true)
                        }
                    >
                        EXCLUIR
                    </button>

                </div>

            </form>

            {/* PREVIEW */}
            <div className={css["preview-banner"]}>

                <div className={css["banner-real"]}>

                    {preview && (

                        <img
                            src={preview}
                            alt="banner"
                            className={css["banner-imagem"]}
                        />

                    )}

                    <div className={css["preview-conteudo"]}>

                        <h3>

                            {titulo ||
                                "Título do Banner"}

                        </h3>

                        <p>

                            {texto ||
                                "Texto do banner aparecendo em tempo real..."}

                        </p>

                        <span
                            className={
                                ativo
                                    ? css["ativo"]
                                    : css["inativo"]
                            }
                        >

                            {ativo
                                ? "ATIVO"
                                : "INATIVO"}

                        </span>

                    </div>

                </div>

            </div>

            {/* MODAL */}
            {modalExcluir && (

                <ModalDecisao
                    titulo="Deseja realmente excluir este banner?"
                    textoConfirmar="EXCLUIR"
                    textoCancelar="CANCELAR"
                    tipoAcao="perigo"
                    aoConfirmar={handleExcluir}
                    aoCancelar={() =>
                        setModalExcluir(false)
                    }
                />

            )}

        </div>
    );
}