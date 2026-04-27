import { useState } from "react";
import css from "./ListarSessao.module.css";

export default function ListarSessao() {
    const [aberta, setAberta] = useState(1);

    const sessoes = [
        {
            id: 1,
            horario: "19:30",
            filme: "Missão: Impossível - O Acerto Final",
            hoje: "19:30",
            total: "R$57,99",
            imagem: "/missaofilme.png"
        },
        {
            id: 2,
            horario: "19:30",
            filme: "Missão: Impossível - O Acerto Final",
            hoje: "19:30",
            total: "R$57,99",
            imagem: "/missaofilme.png"
        },
        {
            id: 3,
            horario: "19:30",
            filme: "Missão: Impossível - O Acerto Final",
            hoje: "19:30",
            total: "R$57,99",
            imagem: "/missaofilme.png"
        },
        {
            id: 4,
            horario: "19:30",
            filme: "Missão: Impossível - O Acerto Final",
            hoje: "19:30",
            total: "R$57,99",
            imagem: "/missaofilme.png"
        }
    ];

    return (
            <main className={css.main}>
                <div className={css.tituloArea}>
                    <button className={css.voltar}>←</button>
                    <h1>SESSÕES</h1>
                </div>

                <section className={css.lista}>
                    {sessoes.map((sessao) => (
                        <div key={sessao.id} className={css.cardSessao}>
                            <div
                                className={css.topoSessao}
                                onClick={() =>
                                    setAberta(aberta === sessao.id ? null : sessao.id)
                                }
                            >
                                <div>
                                    <span>SESSÃO</span>
                                    <strong>{sessao.id}</strong>
                                    <p>{sessao.horario}</p>
                                </div>

                                <button>
                                    {aberta === sessao.id ? "⌃" : "⌄"}
                                </button>
                            </div>

                            {aberta === sessao.id && sessao.filme && (
                                <div className={css.conteudoSessao}>
                                    <div className={css.infoFilme}>
                                        <img src={sessao.imagem} alt={sessao.filme} />

                                        <div>
                                            <h3>{sessao.filme}</h3>
                                            <p>Hoje às {sessao.hoje}</p>
                                            <p>Total: {sessao.total}</p>
                                        </div>
                                    </div>

                                    <div className={css.acoes}>
                                        <button>✎</button>
                                        <button>🗑</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                <div className={css.adicionarArea}>
                    <button className={css.adicionarTexto}>ADICIONAR SESSÃO</button>
                    <button className={css.adicionarBtn}>+</button>
                </div>
            </main>
    );
}