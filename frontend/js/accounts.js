const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

function showMessage(msg, isError = false) {
  const box = document.getElementById('messageBox');
  box.textContent = msg;
  box.className = `message ${isError ? 'error' : 'success'}`;
  setTimeout(() => { box.style.display = 'none'; }, 4000);
}

async function fetchAccounts() {
  try {
    const response = await fetch(`${API_URL}/accounts`);
    const data = await response.json();
    const tbody = document.querySelector('#accountTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(acc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${acc.ACCOUNT_NO || acc.Account_no}</td>
        <td>${acc.ACCOUNT_TYPE || acc.Account_type}</td>
        <td>$${acc.BALANCE_AVAILABLE || acc.Balance_available}</td>
        <td>${acc.BRANCH_ID || acc.Branch_ID}</td>
        <td>${acc.CUSTOMER_NAME || acc.Customer_Name || 'N/A'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load accounts', err);
  }
}

document.getElementById('accountForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const Account_no = document.getElementById('accNumber').value;
  const Account_type = document.getElementById('accType').value;
  const Balance_available = document.getElementById('accBalance').value;
  const Opening_date = document.getElementById('accDate').value;
  const Branch_ID = document.getElementById('accBranch').value;
  const Cust_ID = document.getElementById('accCustId').value;

  try {
    const response = await fetch(`${API_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Account_no, Account_type, Balance_available, Opening_date, Branch_ID, Cust_ID })
    });
    
    const result = await response.json();
    if (response.ok) {
      showMessage(result.message);
      document.getElementById('accountForm').reset();
      fetchAccounts();
    } else {
      showMessage(result.error, true);
    }
  } catch (err) {
    showMessage('Error connecting to server', true);
  }
});

// Load on start
fetchAccounts();
