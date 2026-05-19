import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditarEmpresa.module.css";

export default function EditarEmpresa() {

    const navigate = useNavigate();

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
        telefone: "",
        imagem: null,

        COR_BOTAO: "",
        COR_PRINCIPAL: "",
        COR_ALERTA: "",
        COR_FUNDO: "",
        COR_SECUNDARIA: "",
        COR_TEXTO: "",
        COR_DESTAQUE_TEXTO: "",
        COR_HOVER: "",
        COR_TEXTO_DESTAQUE: "",
        COR_CARD: "",
        COR_FORMULARIO: "",
        COR_LINHA: "",
        COR_MODAL: "",
        COR_ICONE: "",
        COR_TEXTO_FORMULARIO: ""
    });

    useEffect(() => {
        buscarEmpresa();
        buscarCores();
    }, []);

    async function buscarEmpresa() {

        try {

            const response = await fetch(
                "http://localhost:5000/empresa/buscar_empresa"
            );

            const data = await response.json();

            setEmpresa((prev) => ({
                ...prev,
                ...data,
                imagem: null
            }));

        } catch (error) {

            console.log(error);

        }
    }

    async function buscarCores() {

        try {

            const response = await fetch(
                "http://localhost:5000/empresa/buscar_cores"
            );

            const data = await response.json();

            setEmpresa((prev) => ({
                ...prev,
                ...data
            }));

        } catch (error) {

            console.log(error);

        }
    }

    function alterarInput(e) {

        const { name, value, files } = e.target;

        if (files) {

            setEmpresa({
                ...empresa,
                [name]: files[0]
            });

        } else {

            setEmpresa({
                ...empresa,
                [name]: value
            });

        }
    }

    function alterarCor(nome, valor) {

        setEmpresa({
            ...empresa,
            [nome]: valor
        });
    }

    async function salvar(e) {

        e.preventDefault();

        try {

            const empresaData = new FormData();

            empresaData.append("nome_fantasia", empresa.nome_fantasia);
            empresaData.append("razao_social", empresa.razao_social);
            empresaData.append("cnpj", empresa.cnpj);
            empresaData.append("bairro", empresa.bairro);
            empresaData.append("rua", empresa.rua);
            empresaData.append("numero", empresa.numero);
            empresaData.append("cidade", empresa.cidade);
            empresaData.append("chave_pix", empresa.chave_pix);
            empresaData.append("cor", empresa.cor);
            empresaData.append("telefone", empresa.telefone);

            if (empresa.imagem) {

                empresaData.append(
                    "imagem",
                    empresa.imagem
                );
            }

            const responseEmpresa = await fetch(
                `http://localhost:5000/empresa/editar_empresa/${empresa.id_empresa}`,
                {
                    method: "PUT",
                    body: empresaData,
                    credentials: "include"
                }
            );

            const dadosEmpresa = await responseEmpresa.json();

            if (!responseEmpresa.ok) {

                alert(
                    dadosEmpresa.error ||
                    "Erro ao editar empresa"
                );

                return;
            }

            const coresData = new FormData();

            coresData.append("COR_BOTAO", empresa.COR_BOTAO);
            coresData.append("COR_PRINCIPAL", empresa.COR_PRINCIPAL);
            coresData.append("COR_ALERTA", empresa.COR_ALERTA);
            coresData.append("COR_FUNDO", empresa.COR_FUNDO);
            coresData.append("COR_SECUNDARIA", empresa.COR_SECUNDARIA);
            coresData.append("COR_TEXTO", empresa.COR_TEXTO);
            coresData.append("COR_DESTAQUE_TEXTO", empresa.COR_DESTAQUE_TEXTO);
            coresData.append("COR_HOVER", empresa.COR_HOVER);
            coresData.append("COR_TEXTO_DESTAQUE", empresa.COR_TEXTO_DESTAQUE);
            coresData.append("COR_CARD", empresa.COR_CARD);
            coresData.append("COR_FORMULARIO", empresa.COR_FORMULARIO);
            coresData.append("COR_LINHA", empresa.COR_LINHA);
            coresData.append("COR_MODAL", empresa.COR_MODAL);
            coresData.append("COR_ICONE", empresa.COR_ICONE);
            coresData.append(
                "COR_TEXTO_FORMULARIO",
                empresa.COR_TEXTO_FORMULARIO
            );

            const responseCores = await fetch(
                `http://localhost:5000/empresa/editar_cores/${empresa.id_empresa}`,
                {
                    method: "PUT",
                    body: coresData,
                    credentials: "include"
                }
            );

            const dadosCores = await responseCores.json();

            if (!responseCores.ok) {

                alert(
                    dadosCores.error ||
                    "Erro ao editar cores"
                );

                return;
            }

            alert(
                "Empresa e cores atualizadas com sucesso!"
            );

        } catch (error) {

            console.log(error);

            alert(
                "Erro ao salvar alterações"
            );

        }
    }

    const camposCores = [
        "COR_BOTAO",
        "COR_PRINCIPAL",
        "COR_ALERTA",
        "COR_FUNDO",
        "COR_SECUNDARIA",
        "COR_TEXTO",
        "COR_DESTAQUE_TEXTO",
        "COR_HOVER",
        "COR_TEXTO_DESTAQUE",
        "COR_CARD",
        "COR_FORMULARIO",
        "COR_LINHA",
        "COR_MODAL",
        "COR_ICONE",
        "COR_TEXTO_FORMULARIO"
    ];

    return (
        <div className={styles.container}>



            <h1 className={styles.titulo}>
                EDITAR EMPRESA
            </h1>

            <button
                type="button"
                className={styles.btnVoltar}
                onClick={() => navigate("/app")}
            >
                ←
            </button>
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

                <div className={styles.inputGroup}>
                    <label>LOGO DA EMPRESA</label>

                    <input
                        type="file"
                        name="imagem"
                        accept="image/*"
                        onChange={alterarInput}
                    />
                </div>

                <h2 className={styles.subtitulo}>
                    EDITAR CORES
                </h2>

                <div className={styles.gridCores}>

                    {camposCores.map((nome) => (

                        <div
                            className={styles.cardCor}
                            key={nome}
                        >

                            <label>
                                {nome.replaceAll("_", " ")}
                            </label>

                            <div className={styles.inputAreaCor}>

                                <input
                                    type="color"
                                    value={
                                        empresa[nome] ||
                                        "#000000"
                                    }
                                    onChange={(e) =>
                                        alterarCor(
                                            nome,
                                            e.target.value
                                        )
                                    }
                                    className={styles.colorPicker}
                                />

                                <input
                                    type="text"
                                    value={
                                        empresa[nome] || ""
                                    }
                                    onChange={(e) =>
                                        alterarCor(
                                            nome,
                                            e.target.value
                                        )
                                    }
                                    className={styles.textInputCor}
                                />

                            </div>

                        </div>

                    ))}

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