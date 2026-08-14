import React, { useState, useEffect } from 'react';
import FormularioTransacao from '../components/FormularioTransacao';
import ListaTransacoes from '../components/ListaTransacoes';
import {
  criarTransacao,
  listarTransacoes,
  atualizarTransacao,
  listarCategorias,
  criarCategoria,
  removerCategoria,
  atualizarCategoria
} from '../services/api';
import '../styles/Receitas.css';

function Receitas() {
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erro, setErro] = useState(null);

  const [filtros, setFiltros] = useState({
    categoria: '',
    recorrente: ''
  });

  const [mostrarAdicionarCategoria, setMostrarAdicionarCategoria] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [adicionandoCategoria, setAdicionandoCategoria] = useState(false);

  const [editandoCategoria, setEditandoCategoria] = useState(false);
  const [nomeCategoriaEditada, setNomeCategoriaEditada] = useState('');
  const [salvandoEdicaoCategoria, setSalvandoEdicaoCategoria] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    carregarTransacoes();
  }, [filtros]);

  const carregarCategorias = async () => {
    try {
      setCarregandoCategorias(true);

      const response = await listarCategorias('receita');

      const lista = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.value)
          ? response.data.value
          : [];

      setCategorias(lista);
    } catch (erro) {
      console.error('Erro ao carregar categorias:', erro);
      setErro('Erro ao carregar categorias de receitas.');
    } finally {
      setCarregandoCategorias(false);
    }
  };

  const carregarTransacoes = async () => {
    try {
      setCarregando(true);

      const params = {
        tipo: 'receita',
        limit: 100
      };

      if (filtros.categoria) {
        params.categoria = filtros.categoria;
      }

      if (filtros.recorrente !== '') {
        params.recorrente = filtros.recorrente === 'true';
      }

      const response = await listarTransacoes(params);

      setTransacoes(response.data.transacoes || []);
      setErro(null);
    } catch (erro) {
      console.error('Erro ao carregar receitas:', erro);
      setErro('Erro ao carregar receitas.');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionarReceita = async (dados) => {
    try {
      await criarTransacao(dados);

      await carregarTransacoes();

      alert('Receita adicionada com sucesso!');
    } catch (erro) {
      console.error('Erro ao adicionar receita:', erro);

      alert(
        'Erro ao adicionar receita: ' +
        (erro.response?.data?.erro || erro.message)
      );
    }
  };

  const handleAtualizar = async (id, dados) => {
    try {
      if (id) {
        await atualizarTransacao(id, dados);
      }

      await carregarTransacoes();
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);

      alert(
        'Erro ao atualizar: ' +
        (erro.response?.data?.erro || erro.message)
      );
    }
  };

  const handleAdicionarCategoria = async () => {
    const nome = novaCategoria.trim();

    if (!nome) {
      alert('Digite o nome da categoria.');
      return;
    }

    try {
      setAdicionandoCategoria(true);

      await criarCategoria('receita', nome);

      await carregarCategorias();

      setNovaCategoria('');
      setMostrarAdicionarCategoria(false);

      alert('Categoria adicionada com sucesso!');
    } catch (erro) {
      console.error('Erro ao adicionar categoria:', erro);

      alert(
        'Erro ao adicionar categoria: ' +
        (erro.response?.data?.erro || erro.message)
      );
    } finally {
      setAdicionandoCategoria(false);
    }
  };

  const handleRemoverCategoria = async () => {
    const categoriaSelecionada = filtros.categoria;

    if (!categoriaSelecionada) {
      alert('Selecione uma categoria para remover.');
      return;
    }

    const categoria = categorias.find(
      (item) => item.nome === categoriaSelecionada
    );

    if (!categoria) {
      alert('Categoria não encontrada.');
      return;
    }

    const confirmar = window.confirm(
      `Deseja realmente remover a categoria "${categoria.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await removerCategoria(categoria.id);

      setFiltros({
        ...filtros,
        categoria: ''
      });

      await carregarCategorias();

      alert('Categoria removida com sucesso!');
    } catch (erro) {
      console.error('Erro ao remover categoria:', erro);

      alert(
        'Não foi possível remover a categoria: ' +
        (erro.response?.data?.erro || erro.message)
      );
    }
  };

  const iniciarEdicaoCategoria = () => {
    const categoriaSelecionada = filtros.categoria;

    if (!categoriaSelecionada) {
      alert('Selecione uma categoria para editar.');
      return;
    }

    const categoria = categorias.find(
      (item) => item.nome === categoriaSelecionada
    );

    if (!categoria) {
      alert('Categoria não encontrada.');
      return;
    }

    setNomeCategoriaEditada(categoria.nome);
    setEditandoCategoria(true);
    setMostrarAdicionarCategoria(false);
  };

  const cancelarEdicaoCategoria = () => {
    setEditandoCategoria(false);
    setNomeCategoriaEditada('');
  };

  const handleEditarCategoria = async () => {
    const novoNome = nomeCategoriaEditada.trim();

    if (!novoNome) {
      alert('Digite o nome da categoria.');
      return;
    }

    const categoriaSelecionada = filtros.categoria;

    const categoria = categorias.find(
      (item) => item.nome === categoriaSelecionada
    );

    if (!categoria) {
      alert('Categoria não encontrada.');
      return;
    }

    if (novoNome === categoria.nome) {
      cancelarEdicaoCategoria();
      return;
    }

    try {
      setSalvandoEdicaoCategoria(true);

      await atualizarCategoria(categoria.id, novoNome);

      const nomeAntigo = categoria.nome;

      await carregarCategorias();

      setFiltros((estadoAtual) => ({
        ...estadoAtual,
        categoria: novoNome
      }));

      setEditandoCategoria(false);
      setNomeCategoriaEditada('');

      alert(
        `Categoria "${nomeAntigo}" alterada para "${novoNome}" com sucesso!`
      );
    } catch (erro) {
      console.error('Erro ao editar categoria:', erro);

      alert(
        'Erro ao editar categoria: ' +
        (erro.response?.data?.erro || erro.message)
      );
    } finally {
      setSalvandoEdicaoCategoria(false);
    }
  };

  return (
    <div className="receitas-container">

      <h1>💵 Receitas</h1>

      <FormularioTransacao
        onSubmit={handleAdicionarReceita}
        tipoTransacao="receita"
        categorias={categorias.map((categoria) => categoria.nome)}
      />

      {/* GERENCIAMENTO DE CATEGORIAS */}

      <div className="gerenciador-categorias">

        <div className="gerenciador-categorias-titulo">
          <span>Categoria</span>
        </div>

        <div className="gerenciador-categorias-controles">

          <select
            value={filtros.categoria}
            onChange={(e) =>
              setFiltros({
                ...filtros,
                categoria: e.target.value
              })
            }
            disabled={carregandoCategorias}
          >
            <option value="">
              Todas as categorias
            </option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id}
                value={categoria.nome}
              >
                {categoria.nome}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn-adicionar-categoria"
            onClick={() => {
              setMostrarAdicionarCategoria(!mostrarAdicionarCategoria);
              setEditandoCategoria(false);
            }}
          >
            + Adicionar
          </button>

          <button
            type="button"
            className="btn-editar-categoria"
            onClick={iniciarEdicaoCategoria}
            disabled={!filtros.categoria}
          >
            ✏️ Editar
          </button>

          <button
            type="button"
            className="btn-remover-categoria"
            onClick={handleRemoverCategoria}
            disabled={!filtros.categoria}
          >
            🗑 Remover
          </button>

        </div>

        {mostrarAdicionarCategoria && (
          <div className="nova-categoria">

            <input
              type="text"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              placeholder="Nome da nova categoria"
              maxLength={100}
              autoFocus
              disabled={adicionandoCategoria}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdicionarCategoria();
                }

                if (e.key === 'Escape') {
                  setMostrarAdicionarCategoria(false);
                  setNovaCategoria('');
                }
              }}
            />

            <button
              type="button"
              className="btn-confirmar-categoria"
              onClick={handleAdicionarCategoria}
              disabled={adicionandoCategoria}
            >
              {adicionandoCategoria ? 'Salvando...' : 'Adicionar'}
            </button>

            <button
              type="button"
              className="btn-cancelar-categoria"
              onClick={() => {
                setMostrarAdicionarCategoria(false);
                setNovaCategoria('');
              }}
              disabled={adicionandoCategoria}
            >
              Cancelar
            </button>

          </div>
        )}

        {editandoCategoria && (
          <div className="nova-categoria">

            <input
              type="text"
              value={nomeCategoriaEditada}
              onChange={(e) => setNomeCategoriaEditada(e.target.value)}
              placeholder="Novo nome da categoria"
              maxLength={100}
              autoFocus
              disabled={salvandoEdicaoCategoria}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditarCategoria();
                }

                if (e.key === 'Escape') {
                  cancelarEdicaoCategoria();
                }
              }}
            />

            <button
              type="button"
              className="btn-confirmar-categoria"
              onClick={handleEditarCategoria}
              disabled={salvandoEdicaoCategoria}
            >
              {salvandoEdicaoCategoria ? 'Salvando...' : 'Salvar'}
            </button>

            <button
              type="button"
              className="btn-cancelar-categoria"
              onClick={cancelarEdicaoCategoria}
              disabled={salvandoEdicaoCategoria}
            >
              Cancelar
            </button>

          </div>
        )}

      </div>

      {/* FILTROS */}

      <div className="filtros">

        <select
          value={filtros.recorrente}
          onChange={(e) =>
            setFiltros({
              ...filtros,
              recorrente: e.target.value
            })
          }
        >
          <option value="">Todas</option>
          <option value="true">
            Apenas recorrentes
          </option>
          <option value="false">
            Apenas não recorrentes
          </option>
        </select>

      </div>

      {erro && (
        <div className="erro">
          {erro}
        </div>
      )}

      {carregando && (
        <div>
          Carregando...
        </div>
      )}

      <ListaTransacoes
        transacoes={transacoes}
        onEditar={() => {}}
        onAtualizar={handleAtualizar}
      />

    </div>
  );
}

export default Receitas;