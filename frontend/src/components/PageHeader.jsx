import React from 'react';
import '../styles/MacStyle.css';

/**
 * Componente PageHeader unificato per lo stile Mac Premium
 * @param {Object} props
 * @param {string} props.title - Titolo principale della pagina
 * @param {string} props.subtitle - Sottotitolo o descrizione
 * @param {string} props.badge - Testo del badge (es: "FAQ", "CHI SIAMO")
 * @param {React.ReactNode} props.icon - Icona React Icons
 * @param {string} props.theme - 'primary', 'warning', 'info', 'success'
 */
const PageHeader = ({ title, subtitle, badge, icon: Icon, theme = 'primary' }) => {
  const getThemeClass = (theme) => {
    switch (theme) {
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info text-white';
      case 'success': return 'bg-success text-white';
      default: return 'bg-primary text-white';
    }
  };

  const getBadgeThemeClass = (theme) => {
    switch (theme) {
      case 'warning': return 'bg-warning text-dark';
      case 'info': return 'bg-info text-white';
      case 'success': return 'bg-success text-white';
      default: return 'bg-primary text-white';
    }
  };

  const getIconContainerClass = (theme) => {
    switch (theme) {
      case 'warning': return 'bg-warning bg-opacity-10';
      case 'info': return 'bg-info bg-opacity-10';
      case 'success': return 'bg-success bg-opacity-10';
      default: return 'bg-primary bg-opacity-10';
    }
  };

  const getIconTextClass = (theme) => {
    switch (theme) {
      case 'warning': return 'text-warning';
      case 'info': return 'text-info';
      case 'success': return 'text-success';
      default: return 'text-primary';
    }
  };

  return (
    <div className="row justify-content-center text-center mb-5 animate__animated animate__fadeIn">
      <div className="col-lg-10">
        <div className="d-flex align-items-center justify-content-center mb-3">
          <div className={`${getIconContainerClass(theme)} p-3 rounded-4 me-3 shadow-sm`}>
            {Icon && <Icon className={getIconTextClass(theme)} size={32} />}
          </div>
          <span className={`mac-badge ${getBadgeThemeClass(theme)} shadow-sm px-3`}>{badge}</span>
        </div>
        <h1 className="display-4 mac-title mb-3 fw-bold">{title}</h1>
        <p className="lead mac-subtitle opacity-90 mx-auto" style={{ maxWidth: '800px' }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
