import { useEffect, useState } from "react";
import styles from "./EditarEmpresa.module.css";

export default function EditarEmpresa() {

    const [empresa, setEmpresa] = useState({
        id_empresa: "",
        nome_fantasia: "",
        razao_social: "",
        cnpj: "",
        bairro: "",
        rua: "",
        numero: "",
        cidade: "",
        chave_pix: "",
        cor: "",
        telefone: ""

    });

    useEffect(() => {
        buscarEmpresa();
    }, []);

    async function buscarEmpresa() {

        try {

            const response = await fetch(
                "http://localhost:5000/empresa/buscar_empresa"
            );

            const data = await response.json();

            console.log(data);

            setEmpresa(data);

        } catch (error) {

            console.log(error);
        }
    }

    function alterarInput(e) {

        const { name, value } = e.target;

        setEmpresa({
            ...empresa,
            [name]: value
        });
    }

    async function salvar(e) {

        e.preventDefault();

        const formData = new FormData();

        Object.keys(empresa).forEach((campo) => {
            formData.append(campo, empresa[campo]);
        });

        try {

            const response = await fetch(
                `http://localhost:5000/empresa/editar_empresa/${empresa.id_empresa}`,
                {
                    method: "PUT",
                    body: formData,
                    credentials: "include"
                }
            );

            const data = await response.json();

            alert(data.message);

        } catch (error) {

            console.log(error);
        }
    }

    return (

        <div className={styles.container}>

            <h1 className={styles.titulo}>
                EDITAR EMPRESA
            </h1>

            <form
                onSubmit={salvar}
                className={styles.formulario}
            >

                <div className={styles.inputGroup}>
                    <label>NOME FANTASIA</label>

                    <input
                        type="text"
                        name="nome_fantasia"
                        value={empresa.nome_fantasia}
                        onChange={alterarInput}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>RAZÃO SOCIAL</label>

                    <input
                        type="text"
                        name="razao_social"
                        value={empresa.razao_social}
                        onChange={alterarInput}
                    />
                </div>

                <div className={styles.dupla}>

                    <div className={styles.inputGroup}>
                        <label>CNPJ</label>

                        <input
                            type="text"
                            name="cnpj"
                            value={empresa.cnpj}
                            onChange={alterarInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>TELEFONE</label>

                        <input
                            type="text"
                            name="telefone"
                            value={empresa.telefone}
                            onChange={alterarInput}
                        />
                    </div>

                </div>

                <div className={styles.dupla}>

                    <div className={styles.inputGroup}>
                        <label>CIDADE</label>

                        <input
                            type="text"
                            name="cidade"
                            value={empresa.cidade}
                            onChange={alterarInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>BAIRRO</label>

                        <input
                            type="text"
                            name="bairro"
                            value={empresa.bairro}
                            onChange={alterarInput}
                        />
                    </div>

                </div>

                <div className={styles.dupla}>

                    <div className={styles.inputGroup}>
                        <label>RUA</label>

                        <input
                            type="text"
                            name="rua"
                            value={empresa.rua}
                            onChange={alterarInput}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>N°</label>

                        <input
                            type="text"
                            name="numero"
                            value={empresa.numero}
                            onChange={alterarInput}
                        />
                    </div>

                </div>

                <div className={styles.inputGroup}>
                    <label>CHAVE PIX</label>

                    <input
                        type="text"
                        name="chave_pix"
                        value={empresa.chave_pix}
                        onChange={alterarInput}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.botao}
                >
                    SALVAR ALTERAÇÕES
                </button>

            </form>

        </div>
    );
}