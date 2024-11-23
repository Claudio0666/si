import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../components/css/Profissionais.css';
import Banner from './Banner2';
import CardAgendamento from './CardAgendamento';

const Profissionais = () => {
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [modalAtivo, setModalAtivo] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [cardAtivo, setCardAtivo] = useState(false);
  const [error, setError] = useState(null);

  const profissionais = [
    { id: 1, nome: 'Psicólogo' },
    { id: 2, nome: 'Terapeuta Ocupacional' },
    { id: 3, nome: 'Fonoaudiólogo' },
    { id: 4, nome: 'Neurologista' },
    { id: 5, nome: 'Nutricionista' }
  ];

  const fetchMedicos = async (especialidade) => {
    try {
      const response = await fetch(`http://localhost:5000/api/medicos/${encodeURIComponent(especialidade)}`);
      if (!response.ok) throw new Error('Erro ao buscar médicos');
      const data = await response.json();
      setMedicos(data);
    } catch (error) {
      setError('Não foi possível carregar os médicos, tente novamente.');
      console.error('Erro ao buscar médicos:', error);
    }
  };

  const fetchHorarios = async (medicoId, dataSelecionada) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/medicos/${medicoId}/horarios?data=${dataSelecionada.toISOString()}`
      );
      if (!response.ok) throw new Error('Erro ao buscar horários');
      const horariosData = await response.json();
      setHorariosDisponiveis(horariosData.horarios || []);
    } catch (error) {
      setError('Não foi possível carregar os horários, tente novamente.');
      console.error('Erro ao buscar horários:', error);
    }
  };

  const handleDateChange = (data) => {
    if (!(data instanceof Date) || isNaN(data)) {
      console.error('Data selecionada é inválida.');
      setDataSelecionada(null);
      return;
    }
    setDataSelecionada(data);
    setHorarioSelecionado(null);
    if (medicoSelecionado) fetchHorarios(medicoSelecionado.id, data);
  };

  const handleSelectProfissional = (profissional) => {
    setProfissionalSelecionado(profissional);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setMedicoSelecionado(null);
    setModalAtivo(true);
    setError(null);
    fetchMedicos(profissional.nome);
  };

  const handleCloseModal = () => {
    setModalAtivo(false);
    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setMedicoSelecionado(null);
    setMedicos([]);
    setHorariosDisponiveis([]);
    setError(null);
  };

  const handleSelectHorario = (horario) => {
    setHorarioSelecionado(horario);
  };

  const handleSelectMedico = (medico) => {
    setMedicoSelecionado(medico);
    setHorarioSelecionado(null);
    if (dataSelecionada) fetchHorarios(medico.id, dataSelecionada);
  };

  const handleAgendar = () => {
    if (horarioSelecionado && dataSelecionada && medicoSelecionado) {
      setCardAtivo({
        profissional: profissionalSelecionado,
        medico: medicoSelecionado,
        data: dataSelecionada,
        horario: horarioSelecionado,
      });
      handleCloseModal();
    } else {
      alert('Selecione uma data, um horário e um médico antes de agendar.');
    }
  };

  const handleCloseCard = () => {
    setCardAtivo(false);
  };

  return (
    <div className="container-profissionais">
      <div className="card-semi-transparente">
        <div className="profissional">
          <Banner />
          <h3>Escolha um Profissional</h3>
          <div className="profissionais-list">
            {profissionais.map((profissional) => (
              <div key={profissional.id} className="profissional-item">
                <button onClick={() => handleSelectProfissional(profissional)}>
                  {profissional.nome}
                </button>
              </div>
            ))}
          </div>
        </div>

        {modalAtivo && (
          <>
            <div className={`modal-overlay ${modalAtivo ? 'active' : ''}`} onClick={handleCloseModal}></div>
            <div className={`modal ${modalAtivo ? 'active' : ''}`}>
              <h3>{profissionalSelecionado?.nome}</h3>
              {error && <p className="error-message">{error}</p>}
              {!medicoSelecionado ? (
                <>
                  {medicos.length > 0 ? (
                    <>
                      <h4>Escolha um médico:</h4>
                      <div className="medicos-list">
                        {medicos.map((medico) => (
                          <div key={medico.id} className="medico-item">
                            <button onClick={() => handleSelectMedico(medico)}>
                              Dr(a). {medico.nome}
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>Nenhum médico disponível para essa especialidade.</p>
                  )}
                </>
              ) : (
                <>
                  <Calendar
                    onChange={handleDateChange}
                    value={dataSelecionada}
                    minDate={new Date()}
                  />
                  <div className="horarios-list">
                    {horariosDisponiveis.length > 0 ? (
                      horariosDisponiveis.map((horario, index) => (
                        <div
                          key={index}
                          className={`horario-item ${horarioSelecionado === horario ? 'selecionado' : ''}`}
                          onClick={() => handleSelectHorario(horario)}
                        >
                          {horario}
                        </div>
                      ))
                    ) : (
                      <p>Sem horários disponíveis para a data selecionada.</p>
                    )}
                  </div>
                </>
              )}
              <button className="agendar-horario" onClick={handleAgendar}>
                Agendar Consulta
              </button>
              <button className="fechar-modal" onClick={handleCloseModal}>
                Fechar
              </button>
            </div>
          </>
        )}

        {cardAtivo && <CardAgendamento profissional={cardAtivo.profissional} medico={cardAtivo.medico} data={cardAtivo.data} horario={cardAtivo.horario} onClose={handleCloseCard} />}
      </div>
    </div>
  );
};

export default Profissionais;
