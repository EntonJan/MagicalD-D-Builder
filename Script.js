const scriptURL = 'https://script.google.com/macros/s/AKfycbxGHeVwsa5_R9zPIPxMhwNbGxL4FwMwKu2hBP6Ykt3Rc-Caf0825zKP0_1w3jE8_96w/exec' // <-- PASTE YOUR URL HERE
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
