import { useState } from "react";
import styles from './TestingBanner.module.css';

export default function TestingBanner() {
    const [indiceAtual, setIndiceAtual] = useState(0);
    
    const imagens = [
        {
            url: '/banner-interstellar.png',
            titulo: 'INTERSTELLAR',
            legenda: 'FILMES NOVOS IMPERDÍVEIS'
        },
        {
            url: '/Scarface-Banner.jpg',
            titulo: 'SCARFACE',
            legenda: 'CLÁSSICOS REVISITADOS'
        }
    ];

    const proximoSlide = () => {
        setIndiceAtual((prev) => (prev === imagens.length - 1 ? 0 : prev + 1));
    };

    const slideAnterior = () => {
        setIndiceAtual((prev) => (prev === 0 ? imagens.length - 1 : prev - 1));
    };

    return (
        <div
            className={styles.banner + " container-fluid"}
            style={{backgroundImage: `url(${imagens[indiceAtual].url})`}}
            >
            <div className="container text-white d-flex flex-column align-items-start">
                <div className="d-flex flex-column py-5">
                    <span className="fs-responsive-4 fw-semibold text-white text-opacity-75">Em cartaz</span>
                    <h1 className="fw-bold fs-responsive-1">{imagens[indiceAtual].titulo}</h1>
                    <span className="fs-responsive-5 text-white text-opacity-50">{imagens[indiceAtual].legenda}</span>
                </div>
                <div className="w-100 d-flex gap-2 justify-content-between">
                    <div className="d-flex gap-2 align-items-center">
                        {imagens.map((_, index) => (
                            <span
                                key={index} 
                                className={`${styles.ponto} bg-white ${(indiceAtual === index) ? "bg-opacity-1" : "bg-opacity-25"}`}
                                onClick={() => setIndiceAtual(index)}
                                >
                            </span>
                        ))}
                    </div>
                    <div className="d-flex gap-2">
                        <button className={"btn px-3 py-2 border " + styles.setaButton} onClick={slideAnterior}>&#10094;</button>
                        <button className={"btn px-3 py-2 border " + styles.setaButton} onClick={proximoSlide}>&#10095;</button>
                    </div>
                </div>
            </div>
        </div>
    )
}