import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import css from "./CadastroEmpresa.module.css";

export default function CadastroEmpresa() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        nome_fantasia: "",
        razao_social: "",
        cnpj: "",
        bairro: "",
        rua: "",
        numero: "",
        cidade: "",
        chave_pix: "",
        telefone: "",
        cor: "#ff0000"
    });

    const [imagem, setImagem] = useState(null);

    useEffect(() => {

        if (id) {
            buscarEmpresa();
        }

    }, [id]);

    async function buscarEmpresa() {

        try {

            const response = await fetch(
                "http://localhost:5000/empresa/listar_empresas",
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            const empresaEncontrada = data.empresas.find(
                (empresa) => empresa.id_empresa == id
            );

            if (empresaEncontrada) {

                setForm({
                    nome_fantasia: empresaEncontrada.nome_fantasia || "",
                    razao_social: empresaEncontrada.razao_social || "",
                    cnpj: empresaEncontrada.cnpj || "",
                    bairro: empresaEncontrada.bairro || "",
                    rua: empresaEncontrada.rua || "",
                    numero: empresaEncontrada.numero || "",
                    cidade: empresaEncontrada.cidade || "",
                    chave_pix: empresaEncontrada.chave_pix || "",
                    telefone: empresaEncontrada.telefone || "",
                    cor: empresaEncontrada.cor || "#ff0000"
                });

            }

        } catch (erro) {

            console.error(erro);

        }

    }

    function handleChange(e) {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    }

    async function salvarEmpresa(e) {

        e.preventDefault();

        try {

            const formData = new FormData();

            Object.keys(form).forEach((campo) => {
                formData.append(campo, form[campo]);
            });

            if (imagem) {
                formData.append("imagem", imagem);
            }

            const editando = id;

            const response = await fetch(

                editando
                    ? `http://localhost:5000/empresa/editar_empresa/${id}`
                    : "http://localhost:5000/empresa/cadastro_empresa",

                {
                    method: editando ? "PUT" : "POST",
                    body: formData,
                    credentials: "include"
                }

            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            alert(data.message);

            setTimeout(() => {

                navigate("/ListarEmpresa");

            }, 1000);

        } catch (erro) {

            console.error(erro);
            alert(erro.message);

        }

    }

    return (

        <div className={css.modalFundo}>

            <form
                className={css.modalCard}
                onSubmit={salvarEmpresa}
            >

                <div className={css.grupo}>
                    <label>Nome Fantasia:</label>

                    <input
                        type="text"
                        name="nome_fantasia"
                        value={form.nome_fantasia}
                        onChange={handleChange}
                        placeholder="Digite o nome fantasia"
                    />
                </div>

                <div className={css.grupo}>
                    <label>Razão Social:</label>

                    <input
                        type="text"
                        name="razao_social"
                        value={form.razao_social}
                        onChange={handleChange}
                        placeholder="Digite a razão social"
                    />
                </div>

                <div className={css.grupo}>
                    <label>CNPJ:</label>

                    <input
                        type="text"
                        name="cnpj"
                        value={form.cnpj}
                        onChange={(e) => {

                            let valor = e.target.value;

                            valor = valor.replace(/\D/g, "");
                            valor = valor.slice(0, 14);

                            setForm({
                                ...form,
                                cnpj: valor
                            });

                        }}
                        placeholder="00000000000000"
                    />
                </div>

                <div className={css.duplaLinha}>

                    <div className={css.grupo}>
                        <label>Cidade:</label>

                        <input
                            type="text"
                            name="cidade"
                            value={form.cidade}
                            onChange={handleChange}
                            placeholder="Cidade"
                        />
                    </div>

                    <div className={css.grupo}>
                        <label>Bairro:</label>

                        <input
                            type="text"
                            name="bairro"
                            value={form.bairro}
                            onChange={handleChange}
                            placeholder="Bairro"
                        />
                    </div>

                </div>

                <div className={css.duplaLinha}>

                    <div className={css.grupo}>
                        <label>Rua:</label>

                        <input
                            type="text"
                            name="rua"
                            value={form.rua}
                            onChange={handleChange}
                            placeholder="Rua"
                        />
                    </div>

                    <div className={css.grupo}>
                        <label>Número:</label>

                        <input
                            type="text"
                            name="numero"
                            value={form.numero}
                            onChange={(e) => {

                                let valor = e.target.value;

                                valor = valor.replace(/\D/g, "");

                                setForm({
                                    ...form,
                                    numero: valor
                                });

                            }}
                            placeholder="Número"
                        />
                    </div>

                </div>

                <div className={css.grupo}>
                    <label>Telefone:</label>

                    <input
                        type="text"
                        name="telefone"
                        value={form.telefone}
                        onChange={(e) => {

                            let valor = e.target.value;

                            valor = valor.replace(/\D/g, "");
                            valor = valor.slice(0, 9);

                            setForm({
                                ...form,
                                telefone: valor
                            });

                        }}
                        placeholder="999999999"
                    />
                </div>

                <div className={css.duplaLinha}>

                    <div className={css.grupo}>
                        <label>Cor:</label>

                        <input
                            type="color"
                            name="cor"
                            value={form.cor}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={css.grupo}>
                        <label>Chave Pix:</label>

                        <input
                            type="text"
                            name="chave_pix"
                            value={form.chave_pix}
                            onChange={handleChange}
                            placeholder="Digite a chave pix"
                        />
                    </div>

                </div>

                <div className={css.grupo}>
                    <label>Imagem da empresa:</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagem(e.target.files[0])}
                    />
                </div>

                <button
                    type="submit"
                    className={css.botao}
                >
                    {
                        id
                            ? "SALVAR ALTERAÇÕES"
                            : "CADASTRAR EMPRESA"
                    }
                </button>

            </form>

        </div>

    );

}