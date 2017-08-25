(function main () {
  const MyForm = function MyForm () {
    fioInput = document.querySelector('input[name="fio"]')
    emailInput = document.querySelector('input[name="email"]')
    phoneInput = document.querySelector('input[name="phone"]')

    return {
      validate,
      getData,
      setData,
      submit
    }

    function validate () {
      return {}
    }
    function getData () {
      return {
        fio: fioInput.value,
        email: emailInput.value,
        phone: phoneInput.value
      }
    }
    function setData ({fio, email, phone}) {
      fioInput.value = fio
      emailInput.value = email
      phoneInput.value = phone
      return
    }
    function submit (form) {
      form.submit()
      return false
    }
  }

  window.MyForm = MyForm()
})()
