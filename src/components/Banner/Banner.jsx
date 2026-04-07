import React, { useState } from 'react';
import estilo from './Banner.module.css';

export default function Banner() {
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
        <section className={estilo.bannerContainer}>
            <div
                className={estilo.slide}
                style={{ backgroundImage: `url(${imagens[indiceAtual].url})` }}
            >
                <div className={estilo.overlay}>
                    <div className={estilo.conteudo}>
                        <h2 className={estilo.status}>EM CARTAZ</h2>
                        <h1 className={estilo.tituloPrincipal}>{imagens[indiceAtual].titulo}</h1>
                        <p className={estilo.subtitulo}>{imagens[indiceAtual].legenda}</p>
                    </div>
                </div>

                {/* Indicadores (Bolinhas) */}
                <div className={estilo.indicadores}>
                    {imagens.map((_, index) => (
                        <span
                            key={index}
                            className={`${estilo.ponto} ${index === indiceAtual ? estilo.pontoAtivo : ''}`}
                            onClick={() => setIndiceAtual(index)}
                        ></span>
                    ))}
                </div>

                {/* Controles de Navegação */}
                <div className={estilo.navegacao}>
                    <button onClick={slideAnterior} className={estilo.botaoNav}>&#10094;</button>
                    <button onClick={proximoSlide} className={estilo.botaoNav}>&#10095;</button>
                </div>
            </div>
        </section>
    );
}