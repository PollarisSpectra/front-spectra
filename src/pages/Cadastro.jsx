import FormCadastro from "../components/FormCadastro/FormCadastro.jsx";
import Modal from "../components/Modal/Modal.jsx";
import {useState} from "react";

export default function Cadastro() {
    const [cadastro, setCadastro] = useState(false);

    return (
        <div>
            <FormCadastro cadastro={cadastro} setCadastro={setCadastro} />

            {cadastro === true && (
                <Modal titulo={"CADASTRO REALIZADO COM SUCESSO"}/>
            )}
        </div>
    )
}