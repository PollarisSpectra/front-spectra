import css from "./ModalFilme.module.css";

export default function ModalFilme({ aberto, fechar }) {
    if (!aberto) return null;

    return (
        <div className={css.overlay}>
            <div className={css.modal}>
                <button className={css.fechar} onClick={fechar}>
                    ✕
                </button>

                <img src="/scarface.png" className={css.banner} />

                <h2>Scarface Trailer HD (1983) ★★★★★</h2>

                <div className={css.info}>
                    <div>
                        <h4>Gênero</h4>
                        <p>Crime / Drama</p>
                    </div>

                    <div>
                        <h4>Duração</h4>
                        <p>170min;</p>
                    </div>
                </div>

                <div className={css.sinopse}>
                    <h3>SINOPSE</h3>
                    <p>
                        Após receber residência permanente nos Estados Unidos...
                    </p>
                </div>

                <button
                    className={css.botao}
                    onClick={() => navigate("/SelecionarAcento")}
                >
                    COMPRAR INGRESSO
                </button>
            </div>
        </div>
    );
}