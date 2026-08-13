import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>💰 Controle</h1>
        <p>de Contas</p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </Link>

        <Link to="/receitas" className="nav-item">
          <span className="icon">💵</span>
          <span>Receitas</span>
        </Link>

        <Link to="/despesas" className="nav-item">
          <span className="icon">💸</span>
          <span>Despesas</span>
        </Link>

        <Link to="/relatorios" className="nav-item">
          <span className="icon">📈</span>
          <span>Relatórios</span>
        </Link>

        <Link to="/exportar" className="nav-item">
          <span className="icon">📥</span>
          <span>Exportar</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 Controle de Contas</p>
      </div>
    </aside>
  );
}

export default Sidebar;
