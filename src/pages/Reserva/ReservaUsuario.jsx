import { useEffect, useState } from "react";
import styles from "./ReservaUsuario.module.css";

export default function ReservaUsuario() {

    const [reservas, setReservas] = useState([]);
    const [filtro, setFiltro] = useState("0");

    useEffect(() => {
        buscarReservas();
    }, []);

    async function buscarReservas() {

        try {

            const response = await fetch(
                "http://localhost:5000/reservas",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (response.ok) {
                setReservas(data.reservas);
            }
            else {
                console.log(data.error);
            }

        }
        catch (error) {
            console.log(error);
        }

    }

    async function cancelarReserva(id) {

        try {

            const response = await fetch(
                `http://localhost:5000/reservas/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (response.ok) {
                buscarReservas();
            }
            else {
                alert(data.error);
            }

        }
        catch (error) {
            console.log(error);
        }

    }

    const reservasFiltradas = reservas.filter((reserva) => {
        return reserva.status.toString() === filtro;
    });

    return (

        <div className={styles.pagina}>

            <main className={styles.conteudo}>

                <div className={styles.tituloFiltro}>

                    <h1 className={styles.titulo}>
                        MINHAS RESERVAS
                    </h1>

                    <div className={styles.filtros}>

                        <span>Filtrar &gt;</span>

                        <button
                            className={filtro === "0" ? styles.ativo : ""}
                            onClick={() => setFiltro("0")}
                        >
                            Pagos
                        </button>

                        <button
                            className={filtro === "1" ? styles.ativo : ""}
                            onClick={() => setFiltro("1")}
                        >
                            Cancelados
                        </button>

                        <button
                            className={filtro === "3" ? styles.ativo : ""}
                            onClick={() => setFiltro("3")}
                        >
                            Pendentes
                        </button>

                    </div>

                </div>

                <div className={styles.listaReservas}>

                    {reservasFiltradas.length > 0 ? (

                        reservasFiltradas.map((reserva) => (

                            <div
                                className={styles.cardReserva}
                                key={reserva.id_reserva}
                            >

                                <img
                                    className={styles.poster}
                                    src={reserva.poster}
                                    alt={reserva.filme}
                                />

                                <div className={styles.info}>

                                    <h2 className={styles.nomeFilme}>
                                        {reserva.filme}
                                    </h2>

                                    <p className={styles.data}>
                                        {reserva.data} às {reserva.horario}
                                    </p>

                                    <div className={styles.dados}>
                                        <p>Sala: {reserva.sala}</p>
                                        <p>Total: R${reserva.valortotal}</p>
                                    </div>

                                    <div className={styles.statusSessao}>

                                        <p>

                                            Status:

                                            <span
                                                className={`
                                                    ${styles.status}
                                                    ${reserva.status === 0 ? styles.pago : ""}
                                                    ${reserva.status === 1 ? styles.cancelado : ""}
                                                    ${reserva.status === 3 ? styles.pendente : ""}
                                                `}
                                            >

                                                {reserva.status === 0 && "Pago"}
                                                {reserva.status === 1 && "Cancelado"}
                                                {reserva.status === 3 && "Pendente"}

                                            </span>

                                        </p>

                                        <p>

                                            Sessão:

                                            <span className={styles.sessao}>
                                                {reserva.id_sessao}
                                            </span>

                                        </p>

                                    </div>

                                    {reserva.status !== 1 && (

                                        <button
                                            className={styles.cancelar}
                                            onClick={() =>
                                                cancelarReserva(reserva.id_reserva)
                                            }
                                        >
                                            Cancelar Reserva
                                        </button>

                                    )}

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className={styles.semReservas}>
                            <p>Nenhuma reserva encontrada.</p>
                        </div>

                    )}

                </div>

            </main>

        </div>

    );

}