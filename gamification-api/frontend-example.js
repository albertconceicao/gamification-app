// Exemplo de integração da API com frontend JavaScript

const API_URL = 'http://localhost:3000/api';

// ========================================
// 1. REGISTRAR NOVO USUÁRIO
// ========================================
async function registerUser(name, email) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Usuário registrado:', data.data);
      // Salvar userId no localStorage para uso posterior
      localStorage.setItem('userId', data.data._id);
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

// ========================================
// 2. ADICIONAR PONTOS QUANDO USUÁRIO FAZ UMA AÇÃO
// ========================================
async function addPoints(userId, points, actionType) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ points, actionType })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ ${points} pontos adicionados! Total: ${data.data.totalPoints}`);
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

// ========================================
// 3. BUSCAR RANKING DE USUÁRIOS
// ========================================
async function getRanking() {
  try {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    
    if (data.success) {
      console.log('📊 Ranking de usuários:', data.data);
      return data.data;
    } else {
      console.error('❌ Erro:', data.message);
      return [];
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    return [];
  }
}

// ========================================
// 4. BUSCAR DADOS DE UM USUÁRIO ESPECÍFICO
// ========================================
async function getUserData(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('👤 Dados do usuário:', data.data);
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

// ========================================
// EXEMPLOS DE USO
// ========================================

// Exemplo 1: Registrar usuário quando ele preenche um formulário
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  
  await registerUser(name, email);
});

// Exemplo 2: Adicionar pontos quando usuário comenta
document.getElementById('commentButton')?.addEventListener('click', async () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    await addPoints(userId, 5, 'comment');
    // Atualizar UI com novos pontos
    updateUserPoints();
  }
});

// Exemplo 3: Adicionar pontos quando usuário compartilha
document.getElementById('shareButton')?.addEventListener('click', async () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    await addPoints(userId, 10, 'share');
    updateUserPoints();
  }
});

// Exemplo 4: Mostrar ranking na página
async function displayRanking() {
  const users = await getRanking();
  const rankingDiv = document.getElementById('ranking');
  
  if (rankingDiv && users.length > 0) {
    rankingDiv.innerHTML = users.map((user, index) => `
      <div class="user-rank">
        <span class="position">#${index + 1}</span>
        <span class="name">${user.name}</span>
        <span class="points">${user.points} pts</span>
      </div>
    `).join('');
  }
}

// Exemplo 5: Atualizar pontos do usuário na interface
async function updateUserPoints() {
  const userId = localStorage.getItem('userId');
  if (userId) {
    const userData = await getUserData(userId);
    if (userData) {
      const pointsElement = document.getElementById('userPoints');
      if (pointsElement) {
        pointsElement.textContent = userData.points;
      }
    }
  }
}

// ========================================
// EXEMPLO COM REACT
// ========================================

/*
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [ranking, setRanking] = useState([]);

  // Registrar usuário
  const handleRegister = async (name, email) => {
    const newUser = await registerUser(name, email);
    if (newUser) {
      setUser(newUser);
    }
  };

  // Adicionar pontos
  const handleAction = async (points, actionType) => {
    if (user) {
      const result = await addPoints(user._id, points, actionType);
      if (result) {
        setUser(prev => ({ ...prev, points: result.totalPoints }));
      }
    }
  };

  // Carregar ranking
  useEffect(() => {
    const loadRanking = async () => {
      const data = await getRanking();
      setRanking(data);
    };
    loadRanking();
  }, []);

  return (
    <div>
      <h1>Sistema de Pontos</h1>
      {user && (
        <div>
          <p>Olá, {user.name}!</p>
          <p>Seus pontos: {user.points}</p>
          <button onClick={() => handleAction(5, 'comment')}>
            Comentar (+5 pts)
          </button>
          <button onClick={() => handleAction(10, 'share')}>
            Compartilhar (+10 pts)
          </button>
        </div>
      )}
      
      <h2>Ranking</h2>
      <ul>
        {ranking.map((u, i) => (
          <li key={u._id}>
            #{i + 1} - {u.name}: {u.points} pts
          </li>
        ))}
      </ul>
    </div>
  );
}
*/

// ========================================
// EXPORTAR FUNÇÕES (para uso em módulos)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerUser,
    addPoints,
    getRanking,
    getUserData
  };
}
