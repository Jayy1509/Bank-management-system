const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';

function showMessage(msg, isError = false) {
  const box = document.getElementById('messageBox');
  box.textContent = msg;
  box.className = `message ${isError ? 'error' : 'success'}`;
  setTimeout(() => { box.style.display = 'none'; }, 4000);
}

async function fetchCustomers() {
  try {
    const response = await fetch(`${API_URL}/customers`);
    const data = await response.json();
    const tbody = document.querySelector('#customerTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(cust => {
      // Oracle returns column names in uppercase by default
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${cust.CUST_ID || cust.Cust_ID}</td>
        <td>${cust.NAME || cust.Name}</td>
        <td>${cust.ADDRESS || cust.Address}</td>
        <td>${cust.CONTACT_NO || cust.Contact_no}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load customers', err);
  }
}

document.getElementById('customerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const Cust_ID = document.getElementById('custId').value;
  const Name = document.getElementById('custName').value;
  const Address = document.getElementById('custAddress').value;
  const Contact_no = document.getElementById('custContact').value;

  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Cust_ID, Name, Address, Contact_no })
    });
    
    const result = await response.json();
    if (response.ok) {
      showMessage(result.message);
      document.getElementById('customerForm').reset();
      fetchCustomers();
    } else {
      showMessage(result.error, true);
    }
  } catch (err) {
    showMessage('Error connecting to server', true);
  }
});

// Load on start
fetchCustomers();
