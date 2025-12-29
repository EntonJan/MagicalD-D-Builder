const scriptURL = 'https://script.google.com/macros/s/AKfycbwc4LIOkRk49HQrj4t4A8qycYrYCVURy4e7kHlKXulnxayfZSR-P6RLct5cJZhvxlR5/exec' // <-- PASTE YOUR URL HERE
const form = document.getElementById('charForm')
const responseMsg = document.getElementById('response')
const btn = document.getElementById('submitBtn')

form.addEventListener('submit', e => {
  e.preventDefault()
  btn.disabled = true
  btn.innerHTML = "Saving to Ledger..."

  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
        responseMsg.innerHTML = "Character Saved to the Great Library!"
        responseMsg.className = "success"
        form.reset()
        btn.disabled = false
        btn.innerHTML = "Forge Character"
    })
    .catch(error => {
        console.error('Error!', error.message)
        btn.disabled = false
    })
})
