import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card/Card.jsx";
import Banner from "../components/Banner/Banner.jsx";
import styles from "./Home.module.css";

export default function Home() {
    const navigate = useNavigate();

    const [filmes, setFilmes] = useState([]);
    const [sessoes, setSessoes] = useState([]);
    const [filmeSelecionado, setFilmeSelecionado] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const resFilmes = await fetch("http://localhost:5000/filmes/filme");
            const dadosFilmes = await resFilmes.json();

            const resSessoes = await fetch("http://localhost:5000/sessao/listar_sessao");
            const dadosSessoes = await resSessoes.json();

            setFilmes(dadosFilmes.filmes || []);
            setSessoes(dadosSessoes.sessao || []);
        } catch (erro) {
            console.log("Erro ao carregar dados:", erro);
        }
    }

    function pegarHorarioDoFilme(id_filme) {
        const sessoesFilme = sessoes.filter(
            (sessao) => Number(sessao.id_filme) === Number(id_filme)
        );

        if (sessoesFilme.length === 0) {
            return "Sem sessões";
        }

        return sessoesFilme
            .map((sessao) => sessao.horario)
            .slice(0, 2)
            .join(" | ");
    }

    function abrirModal(filme) {
        setFilmeSelecionado(filme);
        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setFilmeSelecionado(null);
    }

    function sessoesDoFilme() {
        return sessoes.filter(
            (sessao) => Number(sessao.id_filme) === Number(filmeSelecionado?.id_filme)
        );
    }

    function comprarIngresso(idSessao) {
        navigate(`/sessao/${idSessao}/assentos`);
    }

    return (
        <>
            <Banner />

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <span className={styles.headerLine}></span>
                    <span className={styles.headerLabel}>Filmes em Destaque</span>
                </div>

                <div className={styles.grid}>
                    {filmes.map((filme) => (
                        <Card
                            key={filme.id_filme}
                            imagem={
                                filme.imagem_url
                                    ? `http://localhost:5000/filmes/${filme.imagem_url}`
                                    : "/sem-imagem.png"
                            }
                            classificacao={filme.classificacao}
                            titulo={filme.titulo}
                            estrelas={5}
                            horario={pegarHorarioDoFilme(filme.id_filme)}
                            onDetalhes={() => abrirModal(filme)}
                        />
                    ))}
                </div>
            </div>
            {modalAberto && filmeSelecionado && (
                <div className={styles.modalFundo}>
                    <div className={styles.modalCard}>
                        <button
                            className={styles.fecharModal}
                            onClick={fecharModal}
                        >
                            ×
                        </button>

                        <div className={styles.modalImagemArea}>
                            <img
                                src={
                                    filmeSelecionado.imagem_url
                                        ? `http://localhost:5000/filmes${filmeSelecionado.imagem_url}`
                                        : "/sem-imagem.png"
                                }
                                alt={filmeSelecionado.titulo}
                                className={styles.modalImagem}
                            />

                            <span className={styles.modalClassificacao}>
                    {filmeSelecionado.classificacao}
                </span>
                        </div>

                        <h2 className={styles.modalTitulo}>
                            {filmeSelecionado.titulo}
                        </h2>

                        <div className={styles.infoLinha}>
                            <div>
                                <strong>Gênero</strong>
                                <p>{filmeSelecionado.genero}</p>
                            </div>

                            <div>
                                <strong>Duração</strong>
                                <p>{filmeSelecionado.duracao}</p>
                            </div>
                        </div>

                        <h3 className={styles.subtituloModal}>SINOPSE</h3>

                        <p className={styles.sinopse}>
                            {filmeSelecionado.sinopse}
                        </p>

                        <h3 className={styles.subtituloModal}>
                            Sessões disponíveis
                        </h3>

                        <div className={styles.sessoesModal}>
                            {sessoesDoFilme().length === 0 ? (
                                <p className={styles.semSessao}>
                                    Não há sessões disponíveis.
                                </p>
                            ) : (
                                sessoesDoFilme().map((sessao) => (
                                    <button
                                        key={sessao.id_sessao}
                                        className={styles.btnSessao}
                                        onClick={() =>
                                            comprarIngresso(sessao.id_sessao)
                                        }
                                    >
                                        {sessao.data} - {sessao.horario} | {sessao.sala}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}