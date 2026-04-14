import estilo from './Modal.module.css';

export default function Modal({ titulo }) {
    return (
        <>
            <div className={estilo.fundoOpaco}></div>

            <div className={estilo.modalContainer}>
                <div className={estilo.modal}>
                    <h1 className={estilo.textoModal}> {titulo} </h1>
                    <img src={"/Icone-Sucesso.png"} alt="Ícone de Sucesso" />
                </div>
            </div>
        </>
    )
}