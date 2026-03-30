import FormLogin from "../components/FormLogin/FormLogin.jsx";
import Modal from "../components/Modal/Modal.jsx";
import {useState} from "react";

export default function Login() {
    const [cadastro, setCadastro] = useState(false);

    return (
        <div>
            <FormLogin cadastro={cadastro} setCadastro={setCadastro}/>

            {cadastro === true && (
                <Modal titulo={"LOGIN REALIZADO COM SUCESSO"}/>
            )}
        </div>
    )
}