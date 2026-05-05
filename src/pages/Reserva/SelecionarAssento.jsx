import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import css from "./SelecionarAssento.module.css";

export default function SelecionarAssento() {
    const { id } = useParams();

    const [sessao, setSessao] = useState(null);
    const [assentosSelecionados, setAssentosSelecionados] = useState([]);
    const [ocupados, setOcupados] = useState([]);

    const fileiras = ["A", "B", "C", "D", "E"];
    const numeros = [1,2,3,4,5,6,7,8,9,10,11,12];

        useEffect(() => {
            async function buscarSessao() {
                try {
                    const res = await fetch(`http://localhost:5000/sessao/listar_sessao?id_sessao=${id}`);
                    console.log("STATUS:", res.status);

                    const text = await res.text();
                    console.log("RESPOSTA:", text);

                    const data = JSON.parse(text);

                    setSessao(data.sessao[0]);

                } catch (err) {
                    console.error("ERRO:", err);
                }
            }

            buscarSessao();
        }, [id]);

    useEffect(() => {
        async function buscarOcupados() {
            const res = await fetch(`http://localhost:5000/reserva/assentos_ocupados/${id}`);
            const data = await res.json();
            setOcupados(data.assentos || []);
        }

        buscarOcupados();
    }, [id]);

    function escolherAssento(codigo) {
        if (ocupados.includes(codigo)) return;

        if (assentosSelecionados.includes(codigo)) {
            setAssentosSelecionados(
                assentosSelecionados.filter(a => a !== codigo)
            );
        } else {
            setAssentosSelecionados([...assentosSelecionados, codigo]);
        }
    }

    async function confirmarReserva() {
        try {
            const res = await fetch("http://localhost:5000/reservas/selecionar_assentos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_sessao: id,
                    assentos: assentosSelecionados
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error);
                return;
            }

            navigate(`/reserva/${data.id_reserva}/resumo`);
        } catch (err) {
            console.error(err);
        }
    }

    if (!sessao) return <p>Carregando...</p>;

    return (
        <main className={css.container}>
            <section className={css.cardFilme}>
                <h2>{sessao.filme}</h2>

                <div className={css.detalhes}>
                    <p><strong>Sala:</strong> {sessao.sala}</p>
                    <p><strong>Data:</strong> {sessao.data}</p>
                    <p><strong>Horário:</strong> {sessao.horario}</p>
                    <p><strong>Valor:</strong> R$ {sessao.valor_assento}</p>
                </div>
            </section>

            <section className={css.areaReserva}>
                <div className={css.tela}>TELA</div>

                <div className={css.mapaAssentos}>
                    {fileiras.map(fileira => (
                        <div key={fileira} className={css.fileira}>
                            <span className={css.letra}>{fileira}</span>

                            {numeros.map(num => {
                                const codigo = `${fileira}${num}`;
                                const ocupado = ocupados.includes(codigo);
                                const selecionado = assentosSelecionados.includes(codigo);
                                return (
                                    <button
                                        key={codigo}
                                        onClick={() => escolherAssento(codigo)}
                                        className={`
                                            ${css.assento}
                                            ${ocupado ? css.ocupado : ""}
                                            ${selecionado ? css.selecionado : ""}
                                        `}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className={css.legenda}>
                    <div><span className={css.boxOcupado}></span> Ocupado</div>
                    <div><span className={css.boxDisponivel}></span> Disponível</div>
                    <div><span className={css.boxSelecionado}></span> Selecionado</div>
                </div>

                <div className={css.total}>
                    Total: R$ {(assentosSelecionados.length * sessao.valor_assento).toFixed(2)}
                </div>

                <button onClick={confirmarReserva}>
                    CONFIRMAR
                </button>
            </section>
        </main>
    );
}