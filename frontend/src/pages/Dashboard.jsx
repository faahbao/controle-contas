import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get('/dashboard');
        setDashboard(response.data);
      } catch (err) {
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Ola, {user?.nome}</span>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Sair</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm">Receitas</h3>
            <p className="text-3xl font-bold text-green-600">R$ {dashboard?.receitas?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm">Despesas</h3>
            <p className="text-3xl font-bold text-red-600">R$ {dashboard?.despesas?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm">Saldo</h3>
            <p className={`text-3xl font-bold ${dashboard?.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>R$ {dashboard?.saldo?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Transacoes Recentes</h2>
          {dashboard?.recentes?.length === 0 ? (<p className="text-gray-600">Nenhuma transacao encontrada.</p>) : (
            <div className="space-y-2">
              {dashboard?.recentes?.map((t) => (
                <div key={t.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{t.descricao}</p>
                    <p className="text-sm text-gray-500">{new Date(t.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <p className={`font-bold ${t.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>{t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
