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
    uf: "",
    chave_pix: "",
    telefone: "",

    // Paleta de cores
    COR_BOTAO: "#ffffff",
    COR_PRINCIPAL: "#ff1c1c",
    COR_ALERTA: "#2a2a2a",
    COR_FUNDO: "#000000",
    COR_SECUNDARIA: "#4a4a4a",
    COR_TEXTO: "#ffffff",
    COR_DESTAQUE_TEXTO: "#ffffff",
    COR_HOVER: "#e61919",
    COR_TEXTO_DESTAQUE: "#ff1a1a",
    COR_CARD: "#ececec",
    COR_FORMULARIO: "#ffffff",
    COR_LINHA: "#bdbdbd",
    COR_MODAL: "#31333880",
    COR_ICONE: "#000000",
    COR_TEXTO_FORMULARIO: "#111111",
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
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      const data = await response.json();

      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          rua: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          uf: data.uf || "",
        }));
      }
    } catch (erro) {
      console.error(erro);
    }
  }

  async function salvarEmpresa() {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (imagem) {
        formData.append("imagem", imagem);
      }

      const url = id
        ? `http://localhost:5000/empresa/editar_empresa/${id}`
        : "http://localhost:5000/empresa/cadastro_empresa";

      const response = await fetch(url, {
        method: id ? "PUT" : "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      alert("Empresa salva com sucesso!");

      navigate("/ListarEmpresa");
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

                  setForm({
                    ...form,
                    cep: valor,
                  });

                  if (valor.length === 8) {
                    buscarCEP(valor);
                  }
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
              onClick={() => setPasso(2)}
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