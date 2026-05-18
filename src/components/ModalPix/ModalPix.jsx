import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import estilo from './ModalPix.module.css';

export default function ModalPix({ idReserva, aoFechar, aoConfirmarPagamento, onErro }) {
    const [confirmando, setConfirmando] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [carregandoQr, setCarregandoQr] = useState(true);
    const [payload, setPayload] = useState(null);
    const [valor, setValor] = useState(null);
    const [textoCopiar, setTextoCopiar] = useState("Copiar");
    const navigate = useNavigate();

    useEffect(() => {
        async function buscarQrCode() {
            try {
                const res = await fetch(`http://localhost:5000/reservas/gerar_qrcode/${idReserva}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Erro ao gerar QR Code");
                }

                setQrCodeUrl(`data:image/png;base64,${data.qrcode}`);
                setPayload(data.payload);
                setValor(data.valor);

            } catch (err) {
                console.error("Erro ao gerar QR Code:", err);
                onErro?.(err.message || "Erro ao gerar QR Code");
            } finally {
                setCarregandoQr(false);
            }
        }

        if (idReserva) buscarQrCode();
    }, [idReserva, onErro]);

    async function handleConfirmar() {
        setConfirmando(true);
        try {
            if (aoConfirmarPagamento) {
                await aoConfirmarPagamento();
            }
            setTimeout(() => {
                aoFechar();
                navigate('/');
            }, 2000);
        } catch (err) {
            setConfirmando(false);
            aoFechar();
            onErro?.(err.message || "Erro ao confirmar reserva. Tente novamente.");
        }
    }

    return (
        <>
            <div className={estilo.fundoOpaco} onClick={!confirmando ? aoFechar : undefined}></div>
            <div className={estilo.modalContainer}>
                <div className={`${estilo.modal} rounded-4`}>
                    <h1 className={estilo.textoModal}>Pagamento via PIX</h1>

                    <div className={estilo.pixContent}>
                        <div className={estilo.qrCode}>
                            {carregandoQr ? (
                                <p style={{ color: "white", textAlign: "center" }}>Gerando QR Code...</p>
                            ) : qrCodeUrl ? (
                                <img
                                    src={qrCodeUrl}
                                    alt="QR Code PIX"
                                    className="col-8 rounded-4"
                                />
                            ) : (
                                <p style={{ color: "white", textAlign: "center" }}>Erro ao gerar QR Code</p>
                            )}
                        </div>

                        {payload && (
                            <div className={estilo.pixInfo}>
                                <span className={estilo.pixLabel}>Copia e Cola</span>
                                <div className="d-flex flex-column gap-2">
                                    <span
                                        className={estilo.pixChave + " rounded-3"}
                                        style={{ cursor: "pointer", wordBreak: "break-all" }}
                                        onClick={() => navigator.clipboard.writeText(payload)}
                                        title="Clique para copiar"
                                    >
                                        {payload}
                                    </span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(payload);
                                            setTextoCopiar("Copiado!");
                                            setTimeout(() => setTextoCopiar("Copiar"), 500);
                                        }}
                                        className="rounded-3 px-2 fw-semibold"
                                    >
                                        {textoCopiar}
                                    </button>
                                </div>
                            </div>
                        )}

                        {valor !== null && (
                            <div className={estilo.pixValor}>
                                R$ {Number(valor).toFixed(2)}
                            </div>
                        )}
                    </div>

                    <div className={estilo.containerBotoes}>
                        <button
                            className={`${estilo.btnBase} ${estilo.btnSucesso}`}
                            onClick={handleConfirmar}
                            disabled={confirmando}
                        >
                            {confirmando ? 'Confirmando...' : 'Confirmar Pagamento'}
                        </button>
                        <button
                            className={`${estilo.btnBase}`}
                            onClick={aoFechar}
                            disabled={confirmando}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}