import estilo from './ModalDecisao.module.css';

export default function ModalDecisao({ 
    titulo = "Tem certeza de tal ação?", 
    textoConfirmar = "Confirmar", 
    textoCancelar = "Cancelar", 
    tipoAcao = "sucesso", // Opções: 'perigo', 'aviso', 'sucesso'
    aoConfirmar, 
    aoCancelar 
}) {
    
    // Mapeia o estilo do botão de confirmação com base na gravidade
    const classeBotaoConfirmar = {
        perigo: estilo.btnPerigo,
        aviso: estilo.btnAviso,
        sucesso: estilo.btnSucesso
    }[tipoAcao] || estilo.btnSucesso;

    return (
        <>
            <div className={estilo.fundoOpaco} onClick={aoCancelar}></div>
            <div className={estilo.modalContainer}>
                <div className={estilo.modal + " rounded-4"}>
                    <h1 className={estilo.textoModal}>{titulo}</h1>
                    
                    <div className={estilo.containerBotoes}>

                        <button 
                            className={`${estilo.btnBase} ${classeBotaoConfirmar}`} 
                            onClick={aoConfirmar}
                        >
                            {textoConfirmar}
                        </button>
                        
                        <button
                            className={`${estilo.btnBase} ${estilo.btnSecundario}`} 
                            onClick={aoCancelar}
                        >
                            {textoCancelar}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}