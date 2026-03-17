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
            style={{backgroundImage: `url(${imagens[indiceAtual].url})`, height: 400}}
            >
            <div className="container text-white">
                <div className="d-flex flex-column py-5">
                    <span className="fs-2 text-uppercase">Em cartaz</span>
                    <span className="fw-bold" style={{fontSize: 80}}>{imagens[indiceAtual].titulo}</span>
                    <span className="fs-5">{imagens[indiceAtual].legenda}</span>
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