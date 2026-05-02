const API_URL = 'https://hustlehub-backend-new.onrender.com'

export const api = {
  // Hustles
  getHustles: () => fetch(`${API_URL}/hustles`).then(r => r.json()),
  getHustle: (id) => fetch(`${API_URL}/hustles/${id}`).then(r => r.json()),
  createHustle: (data) => fetch(`${API_URL}/hustles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Profiles
  getProfile: (id) => fetch(`${API_URL}/profiles/${id}`).then(r => r.json()),
  updateProfile: (id, data) => fetch(`${API_URL}/profiles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Payments
  getPayments: (userId) => fetch(`${API_URL}/payments/${userId}`).then(r => r.json()),
  getPaymentStats: (userId) => fetch(`${API_URL}/payments/stats/${userId}`).then(r => r.json()),

  // M-Pesa
  initiatePayment: (phone, amount, userId) => fetch(`${API_URL}/stkpush`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, amount, userId, description: 'HustleHub Payment' })
  }).then(r => r.json()),

  checkPaymentStatus: (checkoutRequestId) => 
    fetch(`${API_URL}/payment-status/${checkoutRequestId}`).then(r => r.json())
}
