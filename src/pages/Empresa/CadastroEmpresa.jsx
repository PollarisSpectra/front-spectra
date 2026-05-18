import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import css from "./CadastroEmpresa.module.css";

export default function CadastroEmpresa() {
    const { id } = useParams();
  const navigate = useNavigate();

  const [passo, setPasso] = useState(1);

  const [form, setForm] = useState({
    nome_fantasia: "",
    razao_social: "",
    cnpj: "",
    cep: "",
    bairro: "",
    rua: "",
    numero: "",
    cidade: "",
    chave_pix: "",
    telefone: "",

    // Paleta de cores
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
    COR_TEXTO_FORMULARIO: "",
  });

  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    if (id) {
      buscarEmpresa();
    }
  }, [id]);

  useEffect(() => {
    if (form.cep.length === 8) {
      buscarCEP(form.cep);
    }
  }, [form.cep]);

  async function buscarEmpresa() {
    try {
      const response = await fetch(
        "http://localhost:5000/empresa/listar_empresas",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      const emp = data.empresas.find(
        (e) => String(e.id_empresa) === String(id)
      );

      if (emp) {
        setForm((prev) => ({
          ...prev,
          ...emp,
        }));
      }
    } catch (erro) {
      console.error("Erro ao buscar empresa:", erro);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const alterarCor = (nome, valor) => {
    setForm({
      ...form,
      [nome]: valor,
    });
  };

  async function buscarCEP(cep) {
    try {
      console.log("Buscando CEP:", cep);

      const response = await fetch(
          `https://viacep.com.br/ws/${cep}/json/`
      );

      const data = await response.json();

      console.log(data);

      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setForm((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));

    } catch (erro) {
      console.error("Erro ao buscar CEP:", erro);
    }
  }


  function validarEtapa1() {
    if (!form.nome_fantasia.trim()) {
      alert("Preencha o nome fantasia");
      return false;
    }

    if (!form.razao_social.trim()) {
      alert("Preencha a razão social");
      return false;
    }

    if (!form.cnpj.trim()) {
      alert("Preencha o CNPJ");
      return false;
    }

    if (form.cnpj.length !== 14) {
      alert("CNPJ inválido");
      return false;
    }

    if (!form.telefone.trim()) {
      alert("Preencha o telefone");
      return false;
    }

    if (form.telefone.length < 10) {
      alert("Telefone inválido");
      return false;
    }

    if (!form.cep.trim()) {
      alert("Preencha o CEP");
      return false;
    }

    if (form.cep.length !== 8) {
      alert("CEP inválido");
      return false;
    }

    if (!form.cidade.trim()) {
      alert("Preencha a cidade");
      return false;
    }

    if (!form.bairro.trim()) {
      alert("Preencha o bairro");
      return false;
    }

    if (!form.rua.trim()) {
      alert("Preencha a rua");
      return false;
    }

    if (!form.numero.trim()) {
      alert("Preencha o número");
      return false;
    }

    return true;
  }

  async function salvarEmpresa() {
    try {
      // =========================
      // CADASTRAR EMPRESA
      // =========================

      const empresaData = new FormData();

      empresaData.append("nome_fantasia", form.nome_fantasia);
      empresaData.append("razao_social", form.razao_social);
      empresaData.append("cnpj", form.cnpj);
      empresaData.append("cep", form.cep);
      empresaData.append("bairro", form.bairro);
      empresaData.append("rua", form.rua);
      empresaData.append("numero", form.numero);
      empresaData.append("cidade", form.cidade);
      empresaData.append("telefone", form.telefone);

      if (imagem) {
        empresaData.append("imagem", imagem);
      }

      const responseEmpresa = await fetch(
          "http://localhost:5000/empresa/cadastro_empresa",
          {
            method: "POST",
            body: empresaData,
            credentials: "include",
          }
      );

      const empresa = await responseEmpresa.json();

      if (!responseEmpresa.ok) {
        throw new Error(empresa.error);
      }

      // =========================
      // CADASTRAR CORES
      // =========================

      const coresData = new FormData();

      coresData.append("id_empresa", empresa.id_empresa);

      coresData.append("COR_BOTAO", form.COR_BOTAO);
      coresData.append("COR_PRINCIPAL", form.COR_PRINCIPAL);
      coresData.append("COR_ALERTA", form.COR_ALERTA);
      coresData.append("COR_FUNDO", form.COR_FUNDO);
      coresData.append("COR_SECUNDARIA", form.COR_SECUNDARIA);
      coresData.append("COR_TEXTO", form.COR_TEXTO);
      coresData.append("COR_DESTAQUE_TEXTO", form.COR_DESTAQUE_TEXTO);
      coresData.append("COR_HOVER", form.COR_HOVER);
      coresData.append("COR_TEXTO_DESTAQUE", form.COR_TEXTO_DESTAQUE);
      coresData.append("COR_CARD", form.COR_CARD);
      coresData.append("COR_FORMULARIO", form.COR_FORMULARIO);
      coresData.append("COR_LINHA", form.COR_LINHA);
      coresData.append("COR_MODAL", form.COR_MODAL);
      coresData.append("COR_ICONE", form.COR_ICONE);
      coresData.append("COR_TEXTO_FORMULARIO", form.COR_TEXTO_FORMULARIO);



      const responseCores = await fetch(
          "http://localhost:5000/empresa/cadastro_cores",
          {
            method: "POST",
            body: coresData,
            credentials: "include",
          }
      );

      const cores = await responseCores.json();

      if (!responseCores.ok) {
        throw new Error(cores.error);
      }

      alert("Empresa cadastrada com sucesso!");

      navigate("/home");



    } catch (erro) {
      alert(erro.message);
    }
  }

  return (
    <div className={css.modalFundo}>
      <h1 className={css.formTituloPrincipal}>
        {id ? "Editar Empresa" : "Cadastro de Empresa"}

        <span className={css.subEtapa}>
          {" "}
          - Etapa {passo}/2
        </span>
      </h1>

      <div className={css.header}>
        <button
          className={css.btnVoltar}
          onClick={() => navigate("/app/empresa")}
        >
          ←
        </button>
      </div>

      <div className={css.modalCard}>
        {passo === 1 ? (
          // ETAPA 1 - DADOS
          <div className={css.fadeAnim}>
            <div className={css.grupo}>
              <label>Nome Fantasia</label>

              <input
                name="nome_fantasia"
                value={form.nome_fantasia}
                onChange={handleChange}
                placeholder="Ex: CinePipoca"
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
              <div
                className={css.grupo}
                style={{ flex: 2 }}
              >
                <label>CNPJ</label>

                <input
                  name="cnpj"
                  value={form.cnpj}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cnpj: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 14),
                    })
                  }
                />
              </div>

              <div
                className={css.grupo}
                style={{ flex: 1 }}
              >
                <label>Telefone</label>

                <input
                  name="telefone"
                  value={form.telefone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefone: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 11),
                    })
                  }
                />
              </div>
            </div>

            <div className={css.grupo}>
              <label>CEP</label>

              <input
                  type="text"
                  name="cep"
                  value={form.cep}
                  onChange={(e) => {
                    const valor = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 8);

                    setForm((prev) => ({
                      ...prev,
                      cep: valor,
                    }));

                  }}
              />
            </div>

            <div className={css.duplaLinha}>
              <div
                className={css.grupo}
                style={{ flex: 2 }}
              >
                <label>Cidade</label>

                <input
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                />
              </div>

              <div
                className={css.grupo}
                style={{ flex: 1 }}
              >
                <label>Bairro</label>

                <input
                  name="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={css.duplaLinha}>
              <div
                className={css.grupo}
                style={{ flex: 3 }}
              >
                <label>Rua</label>

                <input
                  name="rua"
                  value={form.rua}
                  onChange={handleChange}
                />
              </div>

              <div
                className={css.grupo}
                style={{ flex: 1 }}
              >
                <label>Nº</label>

                <input
                  name="numero"
                  value={form.numero}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={css.grupo}>
              <label>Logo da Empresa</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImagem(e.target.files[0])
                }
              />
            </div>

            <button
              type="button"
              className={css.botao}
              onClick={() => {
                if (validarEtapa1()) {
                  setPasso(2);
                }
              }}
            >
              PRÓXIMA ETAPA: CORES
            </button>
          </div>
        ) : (
          // ETAPA 2 - CORES
          <div className={css.fadeAnim}>
            <h2 className={css.subtituloCores}>
              Personalize sua Identidade Visual
            </h2>

            <div className={css.gridCores}>
              {Object.keys(form)
                .filter((key) => key.startsWith("COR_"))
                .map((nome) => (
                  <div
                    className={css.cardCor}
                    key={nome}
                  >
                    <label>
                      {nome.replaceAll("_", " ")}
                    </label>

                    <div className={css.inputAreaCor}>
                      <input
                        type="color"
                        value={form[nome]}
                        onChange={(e) =>
                          alterarCor(nome, e.target.value)
                        }
                        className={css.colorPicker}
                      />

                      <input
                        type="text"
                        value={form[nome]}
                        onChange={(e) =>
                          alterarCor(nome, e.target.value)
                        }
                        className={css.textInputCor}
                      />
                    </div>
                  </div>
                ))}
            </div>

            <div
              className={css.duplaLinha}
              style={{ marginTop: "20px" }}
            >
              <button
                type="button"
                className={css.botaoSecundario}
                onClick={() => setPasso(1)}
              >
                VOLTAR
              </button>

              <button
                type="button"
                className={css.botao}
                onClick={salvarEmpresa}
              >
                FINALIZAR E SALVAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}