const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL' // <-- PASTE YOUR URL HERE
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
