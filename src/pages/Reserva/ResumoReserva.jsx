import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ResumoReserva() {
    const { id } = useParams();
    const [reserva, setReserva] = useState(null);

    useEffect(() => {
        async function buscar() {
            const res = await fetch(`http://localhost:5000/reserva/${id}`);
            const data = await res.json();
            setReserva(data);
        }

        buscar();
    }, [id]);

    if (!reserva) return <p>Carregando...</p>;

    return (
        <div>
            <h1>Resumo da Reserva</h1>
            <p>Filme: {reserva.filme}</p>
            <p>Sala: {reserva.sala}</p>
            <p>Data: {reserva.data}</p>
            <p>Horário: {reserva.horario}</p>
            <p>Assentos: {reserva.assentos.join(", ")}</p>

            <button>Pagar com Pix</button>
        </div>
    );
}