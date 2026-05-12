import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import estilo from './ModalPix.module.css';

export default function ModalPix({ chavePix = "41317641809", valor, aoFechar }) {
    const [confirmando, setConfirmando] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [carregandoQr, setCarregandoQr] = useState(true);
    const navigate = useNavigate();
    const [payload, setPayload] = useState(null);

    useEffect(() => {
        async function buscarQrCode() {
            try {
                const res = await fetch("http://localhost:5000/pix/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chave: chavePix,
                        nome: "PAULO HENRIQUE SOUZA CAVALLINI",
                        cidade: "BIRIGUI",
                        valor: valor
                    })
                });

                const data = await res.json();
                setQrCodeUrl(`data:image/png;base64,${data.qrcode}`);
                setPayload(data.payload); // opcional, se quiser exibir
            } catch (err) {
                console.error("Erro ao gerar QR Code:", err);
            } finally {
                setCarregandoQr(false);
            }
        }

        buscarQrCode();
    }, [chavePix, valor]);

    function handleConfirmar() {
        setConfirmando(true);
        setTimeout(() => {
            aoFechar();
            navigate('/');
        }, 2000);
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
                                    style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                                />
                            ) : (
                                <p style={{ color: "white", textAlign: "center" }}>Erro ao gerar QR Code</p>
                            )}
                        </div>

                        {payload && (
                            <div className={estilo.pixInfo}>
                                <span className={estilo.pixLabel}>Copia e Cola</span>
                                <span
                                    className={estilo.pixChave}
                                    style={{ cursor: "pointer", wordBreak: "break-all" }}
                                    onClick={() => navigator.clipboard.writeText(payload)}
                                    title="Clique para copiar"
                                >
                                    {payload}
                                </span>
                            </div>
                        )}

                        {valor !== undefined && (
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
                    </div>
                </div>
            </div>
        </>
    );
}