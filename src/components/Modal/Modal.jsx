import css from './Modal.module.css';

export default function Modal({ titulo }) {
    return (
        <>
            <div className={css.fundoOpaco}></div>

            <div className={css.modalContainer}>
                <div className={css.modal}>
                    <h1 className={css.textoModal}> {titulo} </h1>
                    <img src={"/Icone-Sucesso.png"} alt="Ícone de Sucesso" />
                </div>
            </div>

        </>
    )
}