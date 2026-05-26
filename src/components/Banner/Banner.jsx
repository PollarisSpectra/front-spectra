import { useEffect, useState } from "react";
import styles from './Banner.module.css';

export default function Banner() {
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        buscarBanners();
    }, []);

    async function buscarBanners() {
        try {
            const res = await fetch("http://localhost:5000/banner/listar");
            const data = await res.json();

            console.log("BANNERS:", data);

            setBanners(data.banners || []);
        } catch (erro) {
            console.log("Erro ao buscar banners:", erro);
        }
    }

    const proximoSlide = () => {
        setIndiceAtual((prev) =>
            prev === banners.length - 1 ? 0 : prev + 1
        );
    };

    const slideAnterior = () => {
        setIndiceAtual((prev) =>
            prev === 0 ? banners.length - 1 : prev - 1
        );
    };

    if (banners.length === 0) {
        return null;
    }

    const bannerAtual = banners[indiceAtual];

    return (
        <div
            className={styles.banner + " container-fluid"}
            style={{
                backgroundImage: `url("http://localhost:5000/banner/imagem_banner/${bannerAtual.id_banner}.jpg")`,
                height: 260
            }}
        >
            <div className="container text-white d-flex flex-column align-items-start">
                <div className="d-flex flex-column py-5">
                    <span className="fs-responsive-4 fw-semibold text-white text-opacity-75">
                        Em cartaz
                    </span>

                    <h1 className="fw-bold fs-responsive-1">
                        {bannerAtual.titulo}
                    </h1>

                    <span className="fs-responsive-5 text-white text-opacity-50">
                        {bannerAtual.texto}
                    </span>
                </div>

                <div className="w-100 d-flex gap-2 justify-content-between">
                    <div className="d-flex gap-2 align-items-center">
                        {banners.map((_, index) => (
                            <span
                                key={index}
                                className={`${styles.ponto} bg-white ${
                                    indiceAtual === index ? "bg-opacity-1" : "bg-opacity-25"
                                }`}
                                onClick={() => setIndiceAtual(index)}
                            ></span>
                        ))}
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className={"btn px-3 py-2 border " + styles.setaButton}
                            onClick={slideAnterior}
                        >
                            &#10094;
                        </button>

                        <button
                            className={"btn px-3 py-2 border " + styles.setaButton}
                            onClick={proximoSlide}
                        >
                            &#10095;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}