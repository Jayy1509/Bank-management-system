const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

function showMessage(msg, isError = false) {
  const box = document.getElementById('messageBox');
  box.textContent = msg;
  box.className = `message ${isError ? 'error' : 'success'}`;
  setTimeout(() => { box.style.display = 'none'; }, 4000);
}

// Convert Oracle Date format or ISO date to display safely
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString();
}

async function fetchTransactions() {
  try {
    const response = await fetch(`${API_URL}/transactions`);
    const data = await response.json();
    const tbody = document.querySelector('#transTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(trans => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${trans.TRANS_ID || trans.Trans_ID}</td>
        <td><span style="color: ${trans.TRANSACTION_TYPE === 'Deposit' || trans.Transaction_type === 'Deposit' ? '#34d399' : '#f87171'}">${trans.TRANSACTION_TYPE || trans.Transaction_type}</span></td>
        <td>$${trans.AMOUNT || trans.Amount}</td>
        <td>${formatDate(trans.TRANS_DATE || trans.trans_date)}</td>
        <td>${trans.ACCOUNT_NO || trans.Account_no}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load transactions', err);
  }
}

document.getElementById('transForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const Trans_ID = document.getElementById('transId').value;
  const Account_no = document.getElementById('transAcc').value;
  const Transaction_type = document.getElementById('transType').value;
  const Amount = document.getElementById('transAmount').value;
  const trans_date = document.getElementById('transDate').value;

  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Trans_ID, Account_no, Transaction_type, Amount, trans_date })
    });
    
    const result = await response.json();
    if (response.ok) {
      showMessage(`${result.message} New Balance: $${result.newBalance}`);
      document.getElementById('transForm').reset();
      fetchTransactions();
    } else {
      showMessage(result.error, true);
    }
  } catch (err) {
    showMessage('Error connecting to server', true);
  }
});

// Load on start
fetchTransactions();
