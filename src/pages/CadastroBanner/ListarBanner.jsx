import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import css from "./ListarBanner.module.css";


export default function ListarBanner() {

    const navigate = useNavigate();

    const [banners, setBanners] = useState([]);

    const [aberto, setAberto] = useState(null);

    useEffect(() => {
        buscarBanners();
    }, []);

    async function buscarBanners() {

        try {

            const response = await fetch(
                "http://localhost:5000/banner/listar"
            );

            const data = await response.json();

            setBanners(data.banners || []);

        } catch (error) {

            console.log(error);

        }
    }

    function toggleBanner(id) {

        if (aberto === id) {
            setAberto(null);
        } else {
            setAberto(id);
        }
    }


    return (

        <div className={css["container-banner"]}>

            <div className={css["topo"]}>

                <button
                    className={css["voltar"]}
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1>BANNER</h1>

            </div>

            <div className={css["lista-banner"]}>

                {banners.map((banner, index) => (

                    <div
                        key={banner.id_banner}
                        className={css["banner-item"]}
                    >

                        {/* HEADER */}
                        <div
                            className={css["banner-header"]}
                            onClick={() =>
                                toggleBanner(banner.id_banner)
                            }
                        >

                            <span>
                                BANNER {index + 1}
                            </span>

                            {aberto === banner.id_banner ? (
                                <ChevronUp size={18} />
                            ) : (
                                <ChevronDown size={18} />
                            )}

                        </div>

                        {/* CONTEÚDO */}
                        {aberto === banner.id_banner && (

                            <div className={css["banner-conteudo"]}>

                                {/* IMAGEM */}
                                <div className={css["banner-imagem"]}>

                                    <img
                                        src={`http://localhost:5000/banner/imagem_banner/${banner.id_banner}.jpg`}
                                        alt="banner"
                                    />

                                </div>

                                {/* INFO */}
                                <div className={css["banner-info"]}>

                                    <p>
                                        <strong>Título:</strong> {banner.titulo}
                                    </p>

                                    <p>
                                        <strong>Texto:</strong> {banner.texto}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {banner.situacao === "1"
                                            ? "ATIVO"
                                            : "INATIVO"}
                                    </p>

                                </div>

                                {/* BOTÕES */}
                                <div className={css["banner-botoes"]}>

                                    <button>
                                        APLICAR
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/banner/editar/${banner.id_banner}`
                                            )
                                        }
                                    >
                                        EDITAR
                                    </button>


                                </div>

                            </div>

                        )}

                    </div>

                ))}

            </div>

            {/* ADICIONAR */}
            <div className={css["adicionar-area"]}>

                <button
                    className={css["btn-add"]}
                    onClick={() =>
                        navigate("/banner/Cadastro")
                    }
                >

                    ADICIONAR BANNER

                    <Plus size={18} />

                </button>

            </div>

        </div>
    );
}