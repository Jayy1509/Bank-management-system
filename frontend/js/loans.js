const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

function showMessage(msg, isError = false) {
  const box = document.getElementById('messageBox');
  box.textContent = msg;
  box.className = `message ${isError ? 'error' : 'success'}`;
  setTimeout(() => { box.style.display = 'none'; }, 4000);
}

async function fetchLoans() {
  try {
    const response = await fetch(`${API_URL}/loans`);
    const data = await response.json();
    const tbody = document.querySelector('#loanTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(loan => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${loan.LOAN_ID || loan.Loan_ID}</td>
        <td>${loan.LOAN_TYPE || loan.Loan_type}</td>
        <td>$${loan.AMOUNT || loan.Amount}</td>
        <td>${loan.DURATION || loan.Duration}</td>
        <td>${loan.CUST_ID || loan.Cust_ID}</td>
        <td>${loan.BRANCH_ID || loan.Branch_ID}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load loans', err);
  }
}

document.getElementById('loanForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const Loan_ID = document.getElementById('loanId').value;
  const Loan_type = document.getElementById('loanType').value;
  const loan_date = document.getElementById('loanDate').value;
  const Amount = document.getElementById('loanAmount').value;
  const Duration = document.getElementById('loanDuration').value;
  const Installment_pms = document.getElementById('loanPms').value;
  const Cust_ID = document.getElementById('loanCustId').value;
  const Branch_ID = document.getElementById('loanBranchId').value;

  try {
    const response = await fetch(`${API_URL}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Loan_ID, Loan_type, loan_date, Amount, Duration, Installment_pms, Cust_ID, Branch_ID })
    });
    
    const result = await response.json();
    if (response.ok) {
      showMessage(result.message);
      document.getElementById('loanForm').reset();
      fetchLoans();
    } else {
      showMessage(result.error, true);
    }
  } catch (err) {
    showMessage('Error connecting to server', true);
  }
});

// Load on start
fetchLoans();
