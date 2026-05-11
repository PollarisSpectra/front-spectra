// ListarEmpresas.jsx

import { useEffect, useState } from "react";
import css from "./ListarEmpresa.module.css";
import { useNavigate } from "react-router-dom";

export default function ListarEmpresa() {

    const [empresas, setEmpresas] = useState([]);
    const [empresaAberta, setEmpresaAberta] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        buscarEmpresas();
    }, []);

    async function buscarEmpresas() {

        try {

            const response = await fetch(
                "http://localhost:5000/empresa/listar_empresas",
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            setEmpresas(data.empresas);

        } catch (erro) {
            console.error(erro);
        }

    }

    function toggleEmpresa(id) {

        if (empresaAberta === id) {
            setEmpresaAberta(null);
        } else {
            setEmpresaAberta(id);
        }

    }

    return (

        <div className={css.container}>

            <div className={css.topo}>

                <button
                    className={css.voltar}
                    onClick={() => navigate(-1)}
                >
                    ←
                </button>

                <h1>EMPRESAS</h1>

            </div>

            <div className={css.lista}>

                {
                    empresas.map((empresa) => (

                        <div
                            key={empresa.id_empresa}
                            className={css.card}
                        >

                            <div
                                className={css.header}
                                onClick={() =>
                                    toggleEmpresa(empresa.id_empresa)
                                }
                            >

                                <div className={css.nomeArea}>

                                    <span className={css.label}>
                                        EMPRESA
                                    </span>

                                    <span className={css.nome}>
                                        {empresa.nome_fantasia}
                                    </span>

                                </div>

                                <span className={css.seta}>
                                    {
                                        empresaAberta === empresa.id_empresa
                                            ? "▲"
                                            : "▼"
                                    }
                                </span>

                            </div>

                            {
                                empresaAberta === empresa.id_empresa && (

                                    <div className={css.conteudo}>

                                        <div className={css.imagemArea}>

                                            <img
                                                src={`http://localhost:5000/uploads/Empresas/${empresa.id_empresa}.jpg`}
                                                alt=""
                                            />

                                        </div>

                                        <div className={css.info}>

                                            <h2>
                                                {empresa.nome_fantasia}
                                            </h2>

                                            <p>
                                                <strong>Razão Social:</strong>
                                                {" "}
                                                {empresa.razao_social}
                                            </p>

                                            <p>
                                                <strong>CNPJ:</strong>
                                                {" "}
                                                {empresa.cnpj}
                                            </p>

                                            <p>
                                                <strong>Cidade:</strong>
                                                {" "}
                                                {empresa.cidade}
                                            </p>

                                            <p>
                                                <strong>Bairro:</strong>
                                                {" "}
                                                {empresa.bairro}
                                            </p>

                                            <p>
                                                <strong>Rua:</strong>
                                                {" "}
                                                {empresa.rua}
                                            </p>

                                            <p>
                                                <strong>Número:</strong>
                                                {" "}
                                                {empresa.numero}
                                            </p>

                                            <p>
                                                <strong>Chave Pix:</strong>
                                                {" "}
                                                {empresa.chave_pix}
                                            </p>

                                            <div className={css.corArea}>

                                                <strong>Cor:</strong>

                                                <div
                                                    className={css.cor}
                                                    style={{
                                                        background: empresa.cor
                                                    }}
                                                />

                                            </div>

                                        </div>

                                        <div className={css.botoes}>

                                            <button
                                                onClick={() =>
                                                    navigate(`/EditarEmpresa/${empresa.id_empresa}`)
                                                }
                                            >
                                                Editar
                                            </button>

                                            <button>
                                                Excluir
                                            </button>

                                        </div>

                                    </div>

                                )
                            }

                        </div>

                    ))
                }

            </div>

            <button
                className={css.adicionar}
                onClick={() => navigate("/CadastroEmpresa")}
            >
                ADICIONAR EMPRESA
                <span>+</span>
            </button>

        </div>

    );

}