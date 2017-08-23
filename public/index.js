(function main () {
  class MyForm {
    constructor () {
      this.fio = document.querySelector('input[name="fio"]')
      this.email = document.querySelector('input[name="email"]')
      this.phone = document.querySelector('input[name="phone"]')
    }
    validate () {
      return {}
    }
    getData () {
      return {
        fio: this.fio.value,
        email: this.email.value,
        phone: this.phone.value
      }
    }
    setData ({fio, email, phone}) {
      this.fio.value = fio
      this.email.value = email
      this.phone.value = phone
      return
    }
    submit () {
      return
    }
  }

  window.MyForm = new MyForm()
})()
