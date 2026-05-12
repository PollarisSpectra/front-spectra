import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import css from "./SelecionarAssento.module.css";
import ModalPix from "../../components/ModalPix/ModalPix";
import FlashMessage from "../../components/FlashMessage/FlashMessage";

export default function SelecionarAssento() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sessao, setSessao] = useState(null);
    const [sala, setSala] = useState(null);
    const [mapaAssentos, setMapaAssentos] = useState({});
    const [assentosSelecionados, setAssentosSelecionados] = useState([]);
    const [ocupados, setOcupados] = useState([]);
    const [mostrarModalPix, setMostrarModalPix] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    useEffect(() => {
        async function buscarSessao() {
            try {
                const res = await fetch(`http://localhost:5000/sessao/listar_sessao?id_sessao=${id}`);
                const data = await res.json();
                const idSala = data?.sessao[0].id_sala;

                const salaRes = await fetch(`http://localhost:5000/salas/${idSala}`, {
                    credentials: "include"
                });
                const salaData = await salaRes.json();
                setSala(salaData);

                const assentosRes = await fetch(`http://localhost:5000/salas/${idSala}/assentos`, {
                    credentials: "include"
                });
                const assentosData = await assentosRes.json();

                const mapa = {};
                assentosData.assentos.forEach(a => {
                    mapa[a.codigo] = a.id_assento_sala;
                });
                setMapaAssentos(mapa);

                setSessao(data.sessao[0]);

            } catch (err) {
                console.error("ERRO:", err);
                setMensagem("Erro ao carregar a sessão. Tente novamente.");
                setTipoMensagem("error");
            }
        }

        buscarSessao();
    }, [id]);

    useEffect(() => {
        async function buscarOcupados() {
            const res = await fetch(`http://localhost:5000/reservas/${id}/assentos_ocupados`);
            const data = await res.json();
            setOcupados(data.assentos || []);
        }

        buscarOcupados();
    }, [id]);

    function escolherAssento(codigo) {
        if (ocupados.includes(codigo)) return;

        if (assentosSelecionados.includes(codigo)) {
            setAssentosSelecionados(assentosSelecionados.filter(a => a !== codigo));
        } else {
            setAssentosSelecionados([...assentosSelecionados, codigo]);
        }
    }

    async function efetivarReserva() {
        const idsAssentos = assentosSelecionados.map(codigo => mapaAssentos[codigo]);

        const res = await fetch("http://localhost:5000/reservas/", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_sessao: id,
                assentos: idsAssentos
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Erro ao confirmar reserva.");
        }
    }

    function abrirModalPix() {
        if (assentosSelecionados.length < 1) return;
        setMostrarModalPix(true);
    }

    const totalReserva = sessao
        ? (assentosSelecionados.length * sessao.valor_assento).toFixed(2)
        : "0.00";

    if (!sessao || !sala) return <p>Carregando...</p>;

    const letras = Array.from({ length: sala.qtd_fileiras }, (_, i) =>
        String.fromCharCode(65 + i)
    );
    const numeros = Array.from({ length: sala.qtd_colunas }, (_, i) => i + 1);

    return (
        <main className={css.container}>
            <FlashMessage
                mensagem={mensagem}
                tipo={tipoMensagem}
                onClose={() => {
                    setMensagem("");
                    setTipoMensagem("");
                }}
            />

            {mostrarModalPix && (
                <ModalPix
                    valor={totalReserva}
                    aoFechar={() => setMostrarModalPix(false)}
                    aoConfirmarPagamento={efetivarReserva}
                    onErro={(msg) => {
                        setMensagem(msg);
                        setTipoMensagem("error");
                    }}
                />
            )}

            <section className={css.cardFilme}>
                <h2>{sessao.filme}</h2>

                <div className={css.detalhes + " d-flex flex-column gap-2"}>
                    <p><strong>Sala:</strong> {sessao.sala}</p>
                    <p><strong>Data:</strong> {sessao.data}</p>
                    <p><strong>Horário:</strong> {sessao.horario}</p>
                    <p><strong>Valor (unidade):</strong> R${sessao.valor_assento}</p>
                </div>
            </section>

            <section className={css.areaReserva}>
                <div className={css.tela}>TELA</div>

                <div className={css.mapaAssentos}>
                    {letras.map(fileira => (
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
                    Total: R$ {totalReserva}
                </div>
                <button
                    disabled={assentosSelecionados.length < 1}
                    onClick={abrirModalPix}
                    className="px-2 py-1 rounded fw-semibold"
                >
                    CONFIRMAR
                </button>
            </section>
        </main>
    );
}