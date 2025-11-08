// Exemplo de integração da API v2.0 com frontend JavaScript

const API_URL = 'http://localhost:3000/api';

// ========================================
// 1. GERENCIAMENTO DE EVENTOS
// ========================================

async function createEvent(name, description, startDate, endDate) {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, startDate, endDate })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Evento criado:', data.data);
      return data.data;
    } else {
      console.error('❌ Erro:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    return null;
  }
}

async function getEvents() {
  try {
    const response = await fetch(`${API_URL}/events`);
    const data = await response.json();
    
    if (data.success) {
      console.log('📋 Eventos:', data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ Erro:', error);
    return [];
  }
}

async function getEventRanking(eventId) {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/ranking`);
    const data = await response.json();
    
    if (data.success) {
      console.log('🏆 Ranking:', data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ Erro:', error);
    return [];
  }
}

// ========================================
// 2. GERENCIAMENTO DE AÇÕES
// ========================================

async function createAction(eventId, name, points, allowMultiple = false, description = '') {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, points, allowMultiple })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Ação criada:', data.data);
      return data.data;
    } else {
      console.error('❌ Erro:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    return null;
  }
}

async function getEventActions(eventId) {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/actions`);
    const data = await response.json();
    
    if (data.success) {
      console.log('📋 Ações do evento:', data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ Erro:', error);
    return [];
  }
}

async function updateAction(actionId, updates) {
  try {
    const response = await fetch(`${API_URL}/actions/${actionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Ação atualizada:', data.data);
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('❌ Erro:', error);
    return null;
  }
}

async function deleteAction(actionId) {
  try {
    const response = await fetch(`${API_URL}/actions/${actionId}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Ação removida');
      return true;
    } else {
      console.error('❌ Erro:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    return false;
  }
}

// ========================================
// 3. GERENCIAMENTO DE USUÁRIOS
// ========================================

async function registerUser(eventId, name, email) {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Usuário registrado:', data.data);
      // Salvar userId no localStorage
      localStorage.setItem('userId', data.data._id);
      localStorage.setItem('eventId', eventId);
      return data.data;
    } else {
      console.error('❌ Erro:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    return null;
  }
}

async function getUserData(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('👤 Dados do usuário:', data.data);
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('❌ Erro:', error);
    return null;
  }
}

async function getUserHistory(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/history`);
    const data = await response.json();
    
    if (data.success) {
      console.log('📜 Histórico:', data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ Erro:', error);
    return [];
  }
}

// ========================================
// 4. PONTUAÇÃO
// ========================================

async function performAction(userId, actionId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/actions/${actionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ ${data.message}`, data.data);
      return data.data;
    } else {
      console.error('❌ Erro:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    return null;
  }
}

// ========================================
// EXEMPLOS DE USO - VANILLA JS
// ========================================

// Exemplo 1: Setup inicial de um evento
async function setupEvent() {
  // 1. Criar evento
  const event = await createEvent(
    'Black Friday 2024',
    'Campanha de pontos da Black Friday',
    '2024-11-01T00:00:00.000Z',
    '2024-11-30T23:59:59.000Z'
  );
  
  if (!event) return;
  
  // 2. Criar ações
  await createAction(event._id, 'Completar cadastro', 20, false, 'Preencher todos os dados');
  await createAction(event._id, 'Realizar compra', 50, true, 'Fazer uma compra');
  await createAction(event._id, 'Compartilhar', 10, false, 'Compartilhar nas redes');
  await createAction(event._id, 'Indicar amigo', 30, true, 'Convidar um amigo');
  
  console.log('✅ Evento configurado com sucesso!');
  return event;
}

// Exemplo 2: Registrar usuário e realizar ações
async function userJourney(eventId) {
  // 1. Registrar usuário
  const user = await registerUser(eventId, 'João Silva', 'joao@example.com');
  if (!user) return;
  
  // 2. Buscar ações disponíveis
  const actions = await getEventActions(eventId);
  
  // 3. Realizar ações
  for (const action of actions) {
    console.log(`Realizando: ${action.name}`);
    await performAction(user._id, action._id);
  }
  
  // 4. Ver dados atualizados
  const userData = await getUserData(user._id);
  console.log(`Total de pontos: ${userData.points}`);
}

// Exemplo 3: Mostrar ranking na página
async function displayRanking(eventId) {
  const users = await getEventRanking(eventId);
  const rankingDiv = document.getElementById('ranking');
  
  if (rankingDiv && users.length > 0) {
    rankingDiv.innerHTML = `
      <h2>🏆 Ranking</h2>
      ${users.map((user, index) => `
        <div class="rank-item">
          <span class="position">#${index + 1}</span>
          <span class="name">${user.name}</span>
          <span class="points">${user.points} pts</span>
        </div>
      `).join('')}
    `;
  }
}

// Exemplo 4: Painel de administração
async function adminPanel(eventId) {
  const actions = await getEventActions(eventId);
  const actionsDiv = document.getElementById('admin-actions');
  
  if (actionsDiv) {
    actionsDiv.innerHTML = actions.map(action => `
      <div class="action-card">
        <h3>${action.name}</h3>
        <p>${action.description || 'Sem descrição'}</p>
        <p>Pontos: ${action.points}</p>
        <p>Múltiplas: ${action.allowMultiple ? 'Sim' : 'Não'}</p>
        <p>Status: ${action.isActive ? 'Ativa' : 'Inativa'}</p>
        <button onclick="editAction('${action._id}')">Editar</button>
        <button onclick="toggleAction('${action._id}', ${!action.isActive})">
          ${action.isActive ? 'Desativar' : 'Ativar'}
        </button>
      </div>
    `).join('');
  }
}

async function editAction(actionId) {
  const newPoints = prompt('Novos pontos:');
  if (newPoints) {
    await updateAction(actionId, { points: parseInt(newPoints) });
    location.reload();
  }
}

async function toggleAction(actionId, isActive) {
  await updateAction(actionId, { isActive });
  location.reload();
}

// ========================================
// EXEMPLO COM REACT
// ========================================

/*
import { useState, useEffect } from 'react';

function EventDashboard({ eventId }) {
  const [event, setEvent] = useState(null);
  const [actions, setActions] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    const [eventData, actionsData, rankingData] = await Promise.all([
      fetch(`${API_URL}/events/${eventId}`).then(r => r.json()),
      getEventActions(eventId),
      getEventRanking(eventId)
    ]);
    
    setEvent(eventData.data);
    setActions(actionsData);
    setRanking(rankingData);
  };

  const handleRegister = async (name, email) => {
    const newUser = await registerUser(eventId, name, email);
    if (newUser) {
      setUser(newUser);
    }
  };

  const handlePerformAction = async (actionId) => {
    if (!user) return;
    
    const result = await performAction(user._id, actionId);
    if (result) {
      // Atualizar dados do usuário
      const updatedUser = await getUserData(user._id);
      setUser(updatedUser);
      
      // Recarregar ranking
      const updatedRanking = await getEventRanking(eventId);
      setRanking(updatedRanking);
    }
  };

  return (
    <div className="event-dashboard">
      <h1>{event?.name}</h1>
      
      {!user ? (
        <RegistrationForm onSubmit={handleRegister} />
      ) : (
        <>
          <UserInfo user={user} />
          
          <div className="actions-grid">
            {actions.map(action => (
              <ActionCard
                key={action._id}
                action={action}
                onPerform={() => handlePerformAction(action._id)}
              />
            ))}
          </div>
          
          <Ranking users={ranking} currentUserId={user._id} />
        </>
      )}
    </div>
  );
}

function ActionCard({ action, onPerform }) {
  return (
    <div className="action-card">
      <h3>{action.name}</h3>
      <p>{action.description}</p>
      <div className="points">+{action.points} pts</div>
      <button onClick={onPerform} disabled={!action.isActive}>
        {action.isActive ? 'Realizar' : 'Indisponível'}
      </button>
      {!action.allowMultiple && (
        <small>Pode ser realizada apenas uma vez</small>
      )}
    </div>
  );
}
*/

// ========================================
// EXPORTAR FUNÇÕES
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createEvent,
    getEvents,
    getEventRanking,
    createAction,
    getEventActions,
    updateAction,
    deleteAction,
    registerUser,
    getUserData,
    getUserHistory,
    performAction
  };
}
