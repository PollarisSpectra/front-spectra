import { useState } from "react";
import styles from "./VariaveisCores.module.css";

export default function VariaveisCores() {
    const [cores, setCores] = useState({
        COR_BOTAO: "#2563eb",
        COR_PRINCIPAL: "#0f172a",
        COR_ALERTA: "#ef4444",
        COR_FUNDO: "#f3f4f6",
        COR_SECUNDARIA: "#64748b",
        COR_TEXTO: "#111827",
        COR_DESTAQUE_TEXTO: "#f59e0b",
        COR_HOVER: "#1d4ed8",
        COR_TEXTO_DESTAQUE: "#ffffff",
        COR_CARD: "#ffffff",
        COR_BOTAO_SECUNDARIO: "#e5e7eb",
        COR_FORMULARIO: "#f9fafb",
        COR_LINHA: "#d1d5db",
        COR_MODAL: "#ffffff",
        COR_ICONE: "#374151",
    });

    function alterarCor(nome, valor) {
        setCores({
            ...cores,
            [nome]: valor,
        });
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Variáveis de Cor </h1>

            <div className={styles.grid}>
                {Object.entries(cores).map(([nome, valor]) => (
                    <div className={styles.card} key={nome}>
                        <label className={styles.label}>
                            {nome.replaceAll("_", " ")}
                        </label>

                        <div className={styles.inputArea}>
                            <input
                                type="color"
                                value={valor}
                                onChange={(e) =>
                                    alterarCor(nome, e.target.value)
                                }
                                className={styles.colorInput}
                            />

                            <input
                                type="text"
                                value={valor}
                                onChange={(e) =>
                                    alterarCor(nome, e.target.value)
                                }
                                className={styles.textInput}
                                placeholder="Digite a cor"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button className={styles.botao}>
                Salvar
            </button>
        </div>
    );
}