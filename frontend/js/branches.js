const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

function showMessage(msg, isError = false) {
  const box = document.getElementById('messageBox');
  box.textContent = msg;
  box.className = `message ${isError ? 'error' : 'success'}`;
  setTimeout(() => { box.style.display = 'none'; }, 4000);
}

async function fetchBranches() {
  try {
    const response = await fetch(`${API_URL}/branches`);
    const data = await response.json();
    const tbody = document.querySelector('#branchTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(branch => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${branch.BRANCH_ID || branch.Branch_ID}</td>
        <td>${branch.BRANCH_NAME || branch.Branch_name}</td>
        <td>${branch.MANAGER || branch.Manager}</td>
        <td>${branch.CONTACT_NO || branch.Contact_no}</td>
        <td>${branch.CITY || branch.City}</td>
        <td>${branch.ADDRESS || branch.Address}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load branches', err);
  }
}

document.getElementById('branchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const Branch_ID = document.getElementById('branchId').value;
  const Branch_name = document.getElementById('branchName').value;
  const Manager = document.getElementById('branchManager').value;
  const Contact_no = document.getElementById('branchContact').value;
  const City = document.getElementById('branchCity').value;
  const Address = document.getElementById('branchAddress').value;

  try {
    const response = await fetch(`${API_URL}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Branch_ID, Branch_name, Contact_no, Manager, City, Address })
    });
    
    const result = await response.json();
    if (response.ok) {
      showMessage(result.message);
      document.getElementById('branchForm').reset();
      fetchBranches();
    } else {
      showMessage(result.error, true);
    }
  } catch (err) {
    showMessage('Error connecting to server', true);
  }
});

// Load on start
fetchBranches();
