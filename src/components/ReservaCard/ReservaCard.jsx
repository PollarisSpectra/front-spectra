import styles from './ReservaCard.module.css';

const STATUS_MAP = {
    "1": { label: "Confirmada", classe: styles.confirmada },
    "2": { label: "Cancelada",  classe: styles.cancelada },
    "3": { label: "Pendente",   classe: styles.pendente },
};

const formatarData = (dataStr) => new Date(dataStr).toLocaleDateString("pt-BR");

export function ReservaCard({ reserva }) {
    const status = STATUS_MAP[reserva.status] ?? { label: "Desconhecido", classe: styles.pendente };

    return (
        <div className={styles.card}>
            <img
                className={styles.poster}
                src={`http://localhost:5000/filmes/imagem_filme/${reserva.id_filme}.jpg`}
                alt={`Capa de ${reserva.titulo}`}
            />
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.titleRow}>
                        <h3 className={styles.titulo}>{reserva.titulo}</h3>
                        <span className={styles.classificacao}>{reserva.classificacao}+</span>
                    </div>
                    <div className={styles.tags}>
                        <span className={`${styles.tag}`}>{reserva.genero}</span>
                        <span className={`${styles.tag} ${styles.tagDuracao}`}>{reserva.duracao} min</span>
                    </div>
                    <div className={styles.infos}>
                        <span className={styles.infoItem}>
                            <i className="ti ti-calendar" aria-hidden="true" />
                            {formatarData(reserva.datareserva)}
                        </span>
                        <span className={styles.infoItem}>
                            <i className="ti ti-ticket" aria-hidden="true" />
                            Sessão #{reserva.id_sessao}
                        </span>
                    </div>
                </div>
                <div className={styles.footer}>
                    <span className={`${styles.status} ${status.classe}`}>{status.label}</span>
                    <p className={styles.valor}>
                        <small className={styles.moeda}>R$</small>
                        {parseFloat(reserva.valortotal).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}