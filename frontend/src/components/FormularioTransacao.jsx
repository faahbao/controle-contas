import React, { useState } from 'react';
import '../styles/FormularioTransacao.css';

function FormularioTransacao({ onSubmit, tipoTransacao, categorias }) {
  const obterHoje = () => {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  };

  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    valor: '',
    data: obterHoje(),
    recorrente: false,
    num_parcelas: 1
  });

  const [erro, setErro] = useState('');

  // =========================================================
  // ALTERAÇÃO DOS CAMPOS
  // =========================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // =========================================================
  // ADICIONAR MESES A UMA DATA
  // =========================================================

  const adicionarMeses = (dataString, meses) => {
    if (!dataString) {
      return null;
    }

    const partes = dataString.split('-');

    if (partes.length !== 3) {
      return null;
    }

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    if (
      !Number.isInteger(ano) ||
      !Number.isInteger(mes) ||
      !Number.isInteger(dia)
    ) {
      return null;
    }

    /*
     * Trabalhamos com o primeiro dia do mês para evitar
     * problemas quando a data original é dia 29, 30 ou 31.
     */

    const data = new Date(ano, mes - 1, 1);

    data.setMonth(data.getMonth() + meses);

    // Último dia do mês de destino
    const ultimoDia = new Date(
      data.getFullYear(),
      data.getMonth() + 1,
      0
    ).getDate();

    const diaFinal = Math.min(dia, ultimoDia);

    const novoAno = data.getFullYear();
    const novoMes = String(data.getMonth() + 1).padStart(2, '0');
    const novoDia = String(diaFinal).padStart(2, '0');

    return `${novoAno}-${novoMes}-${novoDia}`;
  };

  // =========================================================
  // CONVERTER DATA YYYY-MM-DD PARA DATA LOCAL
  // =========================================================

  const converterParaData = (dataString) => {
    if (!dataString) {
      return null;
    }

    const partes = dataString.split('-');

    if (partes.length !== 3) {
      return null;
    }

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    return new Date(ano, mes - 1, dia);
  };

  // =========================================================
  // FORMATAR DATA
  // =========================================================

  const formatarData = (dataString) => {
    const data = converterParaData(dataString);

    if (!data || Number.isNaN(data.getTime())) {
      return '-';
    }

    return data.toLocaleDateString('pt-BR');
  };

  // =========================================================
  // QUANTIDADE DE PARCELAS
  // =========================================================

  const quantidadeParcelas = Math.max(
    1,
    parseInt(formData.num_parcelas, 10) || 1
  );

  // =========================================================
  // VALOR DA PARCELA
  // =========================================================

  const valorParcela = parseFloat(formData.valor) || 0;

  // =========================================================
  // VALOR TOTAL
  // =========================================================

  const valorTotal = valorParcela * quantidadeParcelas;

  // =========================================================
  // DATA DA PRIMEIRA PARCELA
  // =========================================================

  const dataPrimeiraParcela = formData.data || null;

  // =========================================================
  // DATA DA ÚLTIMA PARCELA
  // =========================================================

  const dataUltimaParcela =
    formData.recorrente && formData.data
      ? adicionarMeses(
          formData.data,
          quantidadeParcelas - 1
        )
      : dataPrimeiraParcela;

  // =========================================================
  // PRÉVIA DAS PARCELAS
  // =========================================================

  const parcelasVisualizacao = [];

  if (
    formData.recorrente &&
    formData.data &&
    quantidadeParcelas > 1
  ) {
    const limiteVisualizacao = Math.min(
      quantidadeParcelas,
      12
    );

    for (
      let numero = 1;
      numero <= limiteVisualizacao;
      numero++
    ) {
      parcelasVisualizacao.push({
        numero,
        data: adicionarMeses(
          formData.data,
          numero - 1
        )
      });
    }
  }

  // =========================================================
  // ENVIO DO FORMULÁRIO
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro('');

    // -------------------------------------------------------
    // Categoria
    // -------------------------------------------------------

    if (!formData.categoria) {
      setErro('Selecione uma categoria.');
      return;
    }

    // -------------------------------------------------------
    // Valor
    // -------------------------------------------------------

    if (
      formData.valor === '' ||
      formData.valor === null ||
      formData.valor === undefined
    ) {
      setErro('Informe o valor da parcela.');
      return;
    }

    if (
      !Number.isFinite(valorParcela) ||
      valorParcela <= 0
    ) {
      setErro(
        'O valor da parcela deve ser maior que zero.'
      );
      return;
    }

    // -------------------------------------------------------
    // Data
    // -------------------------------------------------------

    if (!formData.data) {
      setErro(
        'Informe a data da primeira parcela.'
      );
      return;
    }

    // -------------------------------------------------------
    // Quantidade de parcelas
    // -------------------------------------------------------

    if (formData.recorrente) {
      if (
        !Number.isInteger(
          Number(formData.num_parcelas)
        )
      ) {
        setErro(
          'A quantidade de parcelas deve ser um número inteiro.'
        );
        return;
      }

      if (
        quantidadeParcelas < 1 ||
        quantidadeParcelas > 360
      ) {
        setErro(
          'A quantidade de parcelas deve estar entre 1 e 360.'
        );
        return;
      }
    }

    // -------------------------------------------------------
    // Dados enviados ao backend
    // -------------------------------------------------------

    const dados = {
      tipo: tipoTransacao,
      categoria: formData.categoria,
      descricao: formData.descricao,
      valor: valorParcela,
      data: formData.data,
      recorrente: formData.recorrente,
      num_parcelas: formData.recorrente
        ? quantidadeParcelas
        : null
    };

    try {
      await onSubmit(dados);

      // -----------------------------------------------------
      // Limpar formulário
      // -----------------------------------------------------

      setFormData({
        categoria: '',
        descricao: '',
        valor: '',
        data: obterHoje(),
        recorrente: false,
        num_parcelas: 1
      });

      setErro('');
    } catch (error) {
      console.error(
        'Erro ao enviar formulário:',
        error
      );

      setErro(
        error?.message ||
          'Erro ao salvar a transação.'
      );
    }
  };

  // =========================================================
  // FORMATAÇÃO MONETÁRIA
  // =========================================================

  const formatarMoeda = (valor) => {
    return Number(valor || 0).toLocaleString(
      'pt-BR',
      {
        style: 'currency',
        currency: 'BRL'
      }
    );
  };

  // =========================================================
  // INTERFACE
  // =========================================================

  return (
    <form
      className="formulario-transacao"
      onSubmit={handleSubmit}
    >
      <h2>
        {tipoTransacao === 'receita'
          ? '➕ Adicionar Receita'
          : '➖ Adicionar Despesa'}
      </h2>

      {/* ====================================================
          ERRO
      ==================================================== */}

      {erro && (
        <div className="erro">
          {erro}
        </div>
      )}

      {/* ====================================================
          CATEGORIA
      ==================================================== */}

      <div className="form-group">
        <label htmlFor="categoria">
          Categoria *
        </label>

        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
        >
          <option value="">
            -- Selecione --
          </option>

          {categorias.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ====================================================
          DESCRIÇÃO
      ==================================================== */}

      <div className="form-group">
        <label htmlFor="descricao">
          Descrição
        </label>

        <input
          type="text"
          id="descricao"
          name="descricao"
          placeholder={
            tipoTransacao === 'receita'
              ? 'Ex: Salário mensal, renda extra...'
              : 'Ex: Conta de energia, supermercado...'
          }
          value={formData.descricao}
          onChange={handleChange}
        />
      </div>

      {/* ====================================================
          VALOR E DATA
      ==================================================== */}

      <div className="form-row">

        <div className="form-group">
          <label htmlFor="valor">
            Valor da parcela (R$) *
          </label>

          <input
            type="number"
            id="valor"
            name="valor"
            placeholder="0,00"
            step="0.01"
            min="0.01"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="data">
            Data da primeira parcela *
          </label>

          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
        </div>

      </div>

      {/* ====================================================
          PARCELAMENTO
      ==================================================== */}

      <div className="form-group checkbox">
        <label htmlFor="recorrente">

          <input
            type="checkbox"
            id="recorrente"
            name="recorrente"
            checked={formData.recorrente}
            onChange={handleChange}
          />

          <span>
            Com parcelas
          </span>

        </label>
      </div>

      {/* ====================================================
          INFORMAÇÕES DO PARCELAMENTO
      ==================================================== */}

      {formData.recorrente && (
        <>

          <div className="form-row">

            {/* QUANTIDADE */}

            <div className="form-group">
              <label htmlFor="num_parcelas">
                Número de parcelas *
              </label>

              <input
                type="number"
                id="num_parcelas"
                name="num_parcelas"
                min="1"
                max="360"
                value={formData.num_parcelas}
                onChange={handleChange}
                required
              />
            </div>

            {/* RESUMO */}

            <div className="form-group info-parcelas">
              <label>
                Resumo do parcelamento
              </label>

              <div className="info-text">

                <div>
                  <strong>
                    Valor da parcela:
                  </strong>{' '}

                  {formatarMoeda(
                    valorParcela
                  )}
                </div>

                <div>
                  <strong>
                    Quantidade:
                  </strong>{' '}

                  {quantidadeParcelas}x
                </div>

                <div>
                  <strong>
                    Valor total:
                  </strong>{' '}

                  {formatarMoeda(
                    valorTotal
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* =================================================
              PERÍODO
          ================================================= */}

          <div className="info-parcelamento">

            <h3>
              📅 Período do parcelamento
            </h3>

            <div className="periodo-parcelamento">

              <div>
                <span>
                  Primeira parcela
                </span>

                <strong>
                  {formatarData(
                    dataPrimeiraParcela
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Última parcela
                </span>

                <strong>
                  {formatarData(
                    dataUltimaParcela
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Valor total
                </span>

                <strong>
                  {formatarMoeda(
                    valorTotal
                  )}
                </strong>
              </div>

            </div>

          </div>

          {/* =================================================
              PRÉVIA DAS PARCELAS
          ================================================= */}

          {parcelasVisualizacao.length > 0 && (
            <div className="lista-parcelas-preview">

              <h3>
                Parcelas
              </h3>

              <div className="parcelas-grid">

                {parcelasVisualizacao.map(
                  (parcela) => (
                    <div
                      key={parcela.numero}
                      className="parcela-preview"
                    >

                      <span>
                        Parcela{' '}
                        {parcela.numero}/
                        {quantidadeParcelas}
                      </span>

                      <strong>
                        {formatarData(
                          parcela.data
                        )}
                      </strong>

                      <small>
                        {formatarMoeda(
                          valorParcela
                        )}
                      </small>

                    </div>
                  )
                )}

              </div>

              {quantidadeParcelas > 12 && (
                <div className="mais-parcelas">
                  +{' '}
                  {quantidadeParcelas - 12}{' '}
                  parcelas
                </div>
              )}

            </div>
          )}

        </>
      )}

      {/* ====================================================
          RESUMO SEM PARCELAMENTO
      ==================================================== */}

      {!formData.recorrente &&
        valorParcela > 0 && (
          <div className="info-parcelamento">

            <div className="periodo-parcelamento">

              <div>
                <span>
                  Data
                </span>

                <strong>
                  {formatarData(
                    dataPrimeiraParcela
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Valor total
                </span>

                <strong>
                  {formatarMoeda(
                    valorParcela
                  )}
                </strong>
              </div>

            </div>

          </div>
        )}

      {/* ====================================================
          BOTÃO
      ==================================================== */}

      <button
        type="submit"
        className="btn-submit"
      >
        Adicionar
      </button>

    </form>
  );
}

export default FormularioTransacao;