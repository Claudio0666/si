import React from 'react';
import '../components/css/CardAgendamento.css';

const CardAgendamento = ({ profissional, medico, data, horario, onClose }) => {
  // Verificação para garantir que os objetos 'profissional' e 'medico' existam
  const profissionalNome = profissional ? profissional.nome : 'Desconhecido';
  const medicoNome = medico ? medico.nome : 'Desconhecido';
  const dataFormatada = data ? data.toLocaleDateString() : 'Data inválida';
  const horarioExibido = horario || 'Horário não especificado';

  const handleCardClick = (e) => {
    e.stopPropagation(); // Impede o fechamento do card ao clicar dentro dele
  };

  return (
    <div className="card-agendamento-overlay" onClick={onClose}>
      <div className="card-agendamento" onClick={handleCardClick}>
        <h3>Consulta Agendada</h3>
        <p><strong>Profissional:</strong> {profissionalNome}</p>
        <p><strong>Médico:</strong> Dr(a). {medicoNome}</p>
        <p><strong>Data:</strong> {dataFormatada}</p>
        <p><strong>Horário:</strong> {horarioExibido}</p>
        <button onClick={onClose} className="fechar-card">Fechar</button>
      </div>
    </div>
  );
};

export default CardAgendamento;
