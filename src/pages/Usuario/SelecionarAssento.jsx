import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import css from "./SelecionarAssento.module.css";

export default function SelecionarAssento() {
    const { id } = useParams();

    const [filme, setFilme] = useState(null);
    const [sala, setSala] = useState(null);
    const [assentos, setAssentos] = useState([]);
    const [assentosSelecionados, setAssentosSelecionados] = useState([]);
    const [mensagem, setMensagem] = useState("");


    useEffect(() => {
        carregarSalaSessao();
    }, [id]);

    async function carregarSalaSessao() {
        try {
            const resposta = await fetch(`http://localhost:5000/sessao/sala_sessao/${id}`);
            const dados = await resposta.json();

            if (resposta.ok) {
                setFilme(dados.filme);
                setSala(dados.sala);
                setAssentos(dados.assentos || []);
            } else {
                setMensagem(dados.error || "Erro ao carregar sala");
            }
        } catch (erro) {
            setMensagem("Erro ao conectar com a API");
        }
    }

    function escolherAssento(codigo, reservado) {
        if (reservado) return;

        if (assentosSelecionados.includes(codigo)) {
            setAssentosSelecionados(
                assentosSelecionados.filter((item) => item !== codigo)
            );
        } else {
            setAssentosSelecionados([...assentosSelecionados, codigo]);
        }
    }

    if (mensagem) {
        return <p>{mensagem}</p>;
    }

    if (!filme || !sala) {
        return <p>Carregando sessão...</p>;
    }

    return (
        <main className={css.container}>
            <section className={css.cardFilme}>
                <img
                    src={
                        filme.imagem_url
                            ? `http://localhost:5000/filmes${filme.imagem_url}`
                            : "/sem-imagem.png"
                    }
                    alt={filme.titulo}
                    className={css.poster}
                />

                <div className={css.infoFilme}>
                    <div className={css.linhaTitulo}>
                        <h2>{filme.titulo}</h2>
                        <span>★★★★★</span>
                    </div>

                    <div className={css.detalhes}>
                        <div>
                            <h3>Gênero</h3>
                            <p>{filme.genero}</p>
                        </div>

                        <div>
                            <h3>Duração</h3>
                            <p>{filme.duracao}</p>
                        </div>
                    </div>
                </div>

                <div className={css.sinopse}>
                    <h2>SINOPSE</h2>
                    <p>{filme.sinopse}</p>
                </div>
            </section>

            <section className={css.areaReserva}>
                <h2>{sala.nome}</h2>

                <p>
                    Sessão: {filme.data} - {filme.horario}
                </p>

                <div className={css.tela}>TELA</div>

                <div className={css.mapaAssentos}>
                    {Array.from({ length: sala.qtd_fileiras }).map((_, index) => {
                        const fileira = String.fromCharCode(65 + index);

                        const assentosDaFileira = assentos.filter(
                            (assento) => assento.fileira === fileira
                        );

                        return (
                            <div className={css.fileira} key={fileira}>
                                <span className={css.letra}>{fileira}</span>

                                {assentosDaFileira.map((assento) => {
                                    const selecionado = assentosSelecionados.includes(assento.codigo);

                                    return (
                                        <button
                                            key={assento.codigo}
                                            onClick={() =>
                                                escolherAssento(assento.codigo, assento.reservado)
                                            }
                                            className={`
                                                ${css.assento}
                                                ${assento.reservado ? css.ocupado : ""}
                                                ${selecionado ? css.selecionado : ""}
                                            `}
                                        >
                                            {assento.numero}
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                <div className={css.legenda}>
                    <div><span className={css.boxOcupado}></span>OCUPADO</div>
                    <div><span className={css.boxDisponivel}></span>DISPONÍVEL</div>
                    <div><span className={css.boxSelecionado}></span>SELECIONADO</div>
                </div>

                <button
                    className={`${css.confirmar} ${assentosSelecionados.length > 0 ? css.confirmarAtivo : ""}`}
                >
                    CONFIRMAR
                </button>
            </section>
        </main>
    );
}