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
        cep: "",
        bairro: "",
        rua: "",
        numero: "",
        cidade: "",
        uf: "",
        chave_pix: "",
        telefone: "",
        cor: "#ff1c1c"
    });

    const [imagem, setImagem] = useState(null);

    useEffect(() => {
        if (id) {
            buscarEmpresa();
        }
    }, [id]);

    async function buscarEmpresa() {
        try {
            const response = await fetch("http://localhost:5000/empresa/listar_empresas", {
                credentials: "include"
            });
            const data = await response.json();
            const empresaEncontrada = data.empresas.find(emp => emp.id_empresa == id);

            if (empresaEncontrada) {
                setForm({
                    nome_fantasia: empresaEncontrada.nome_fantasia || "",
                    razao_social: empresaEncontrada.razao_social || "",
                    cnpj: empresaEncontrada.cnpj || "",
                    cep: empresaEncontrada.cep || "",
                    bairro: empresaEncontrada.bairro || "",
                    rua: empresaEncontrada.rua || "",
                    numero: empresaEncontrada.numero || "",
                    cidade: empresaEncontrada.cidade || "",
                    uf: empresaEncontrada.uf || "",
                    chave_pix: empresaEncontrada.chave_pix || "",
                    telefone: empresaEncontrada.telefone || "",
                    cor: empresaEncontrada.cor || "#ff1c1c"
                });
            }
        } catch (erro) {
            console.error("Erro ao buscar empresa:", erro);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function buscarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, "");

        if (cepLimpo.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert("CEP não encontrado");
                return;
            }

            setForm((prev) => ({
                ...prev,
                rua: data.logradouro || "",
                bairro: data.bairro || "",
                cidade: data.localidade || "",
                uf: data.uf || ""
            }));
        } catch (erro) {
            console.error("Erro ao buscar CEP:", erro);
        }
    }

    async function salvarEmpresa(e) {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => formData.append(key, form[key]));
            if (imagem) formData.append("imagem", imagem);

            const url = id
                ? `http://localhost:5000/empresa/editar_empresa/${id}`
                : "http://localhost:5000/empresa/cadastro_empresa";

            const response = await fetch(url, {
                method: id ? "PUT" : "POST",
                body: formData,
                credentials: "include"
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            alert(data.message);
            navigate("/ListarEmpresa");
        } catch (erro) {
            alert(erro.message);
        }
    }

    return (
        <div className={css.modalFundo}>

            {/* Título da Página */}
            <h1 className={css.formTituloPrincipal}>
                {id ? "Editar Empresa" : "Cadastro de Empresa"}
            </h1>

            <form className={css.modalCard} onSubmit={salvarEmpresa}>

                <div className={css.grupo}>
                    <label>Nome Fantasia</label>
                    <input
                        name="nome_fantasia"
                        value={form.nome_fantasia}
                        onChange={handleChange}
                        placeholder="Ex: Pizzaria do Jhow"
                    />
                </div>

                <div className={css.grupo}>
                    <label>Razão Social</label>
                    <input
                        name="razao_social"
                        value={form.razao_social}
                        onChange={handleChange}
                    />
                </div>

                <div className={css.duplaLinha}>
                    <div className={css.grupo} style={{ flex: 2 }}>
                        <label>CNPJ</label>
                        <input
                            name="cnpj"
                            value={form.cnpj}
                            onChange={(e) => setForm({ ...form, cnpj: e.target.value.replace(/\D/g, "").slice(0, 14) })}
                        />
                    </div>
                    <div className={css.grupo} style={{ flex: 1 }}>
                        <label>Telefone</label>
                        <input
                            name="telefone"
                            value={form.telefone}
                            placeholder="11999999999"
                            onChange={(e) => setForm({ ...form, telefone: e.target.value.replace(/\D/g, "").slice(0, 11) })}
                        />
                    </div>
                </div>

                <div className={css.grupo}>
                    <label>CEP</label>
                    <input
                        type="text"
                        name="cep"
                        value={form.cep}
                        placeholder="00000000"
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, "").slice(0, 8);
                            setForm({ ...form, cep: valor });
                            buscarCEP(valor);
                        }}
                    />
                </div>

                <div className={css.duplaLinha}>
                    <div className={css.grupo} style={{ flex: 2 }}>
                        <label>Cidade</label>
                        <input name="cidade" value={form.cidade} onChange={handleChange} />
                    </div>
                    <div className={css.grupo} style={{ flex: 1 }}>
                        <label>Bairro</label>
                        <input name="bairro" value={form.bairro} onChange={handleChange} />
                    </div>
                </div>

                <div className={css.duplaLinha}>
                    <div className={css.grupo} style={{ flex: 3 }}>
                        <label>Rua</label>
                        <input name="rua" value={form.rua} onChange={handleChange} />
                    </div>
                    <div className={css.grupo} style={{ flex: 1 }}>
                        <label>Nº</label>
                        <input name="numero" value={form.numero} onChange={handleChange} />
                    </div>
                </div>

                <div className={css.duplaLinha}>
                    <div className={css.grupo}>
                        <label>Cor Identidade</label>
                        <input type="color" name="cor" value={form.cor} onChange={handleChange} />
                    </div>
                    <div className={css.grupo} style={{ flex: 1 }}>
                        <label>Chave Pix</label>
                        <input name="chave_pix" value={form.chave_pix} onChange={handleChange} />
                    </div>
                </div>

                <div className={css.grupo}>
                    <label>Logo da Empresa</label>
                    <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} />
                </div>

                <button type="submit" className={css.botao}>
                    {id ? "SALVAR ALTERAÇÕES" : "FINALIZAR CADASTRO"}
                </button>

            </form>
        </div>
    );
}