import React, { useState } from 'react';
import '../styles/FormularioTransacao.css';

function FormularioTransacao({ onSubmit, tipoTransacao, categorias }) {
  const [formData, setFormData] = useState({
    categoria: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    recorrente: false,
    num_parcelas: 1
  });

  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');

    if (!formData.categoria || !formData.valor || !formData.data) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    if (parseFloat(formData.valor) <= 0) {
      setErro('Valor deve ser maior que zero');
      return;
    }

    if (formData.recorrente && formData.num_parcelas < 1) {
      setErro('Número de parcelas deve ser pelo menos 1');
      return;
    }

    onSubmit({
      tipo: tipoTransacao,
      categoria: formData.categoria,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      data: formData.data,
      recorrente: formData.recorrente,
      num_parcelas: formData.recorrente ? parseInt(formData.num_parcelas) : null
    });

    setFormData({
      categoria: '',
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0],
      recorrente: false,
      num_parcelas: 1
    });
  };

  // Calcular data final de parcelamento
  const calcularDataFinal = () => {
    if (!formData.recorrente || !formData.num_parcelas || formData.num_parcelas <= 1) {
      return null;
    }
    const dataInicio = new Date(formData.data);
    dataInicio.setMonth(dataInicio.getMonth() + (parseInt(formData.num_parcelas) - 1));
    return dataInicio.toLocaleDateString('pt-BR');
  };

  const dataFinal = calcularDataFinal();

  return (
    <form className="formulario-transacao" onSubmit={handleSubmit}>
      <h2>{tipoTransacao === 'receita' ? '➕ Adicionar Receita' : '➖ Adicionar Despesa'}</h2>

      {erro && <div className="erro">{erro}</div>}

      <div className="form-group">
        <label htmlFor="categoria">Categoria *</label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
        >
          <option value="">-- Selecione --</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Descrição</label>
        <input
          type="text"
          id="descricao"
          name="descricao"
          placeholder="Ex: Salário mensal, Conta de energia..."
          value={formData.descricao}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="valor">Valor (R$) *</label>
          <input
            type="number"
            id="valor"
            name="valor"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="data">Data *</label>
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

      <div className="form-group checkbox">
        <label htmlFor="recorrente">
          <input
            type="checkbox"
            id="recorrente"
            name="recorrente"
            checked={formData.recorrente}
            onChange={handleChange}
          />
          <span>Com parcelas</span>
        </label>
      </div>

      {formData.recorrente && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="num_parcelas">Número de parcelas *</label>
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

          {dataFinal && (
            <div className="form-group info-parcelas">
              <label>Período de Parcelamento</label>
              <div className="info-text">
                <strong>De:</strong> {new Date(formData.data).toLocaleDateString('pt-BR')}<br/>
                <strong>Até:</strong> {dataFinal}
              </div>
            </div>
          )}
        </div>
      )}

      <button type="submit" className="btn-submit">
        Adicionar
      </button>
    </form>
  );
}

export default FormularioTransacao;
