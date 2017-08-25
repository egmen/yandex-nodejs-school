(function main () {
  const MyForm = function MyForm () {
    const errorClassName = 'error'
    const input = {
      fio: document.querySelector('input[name="fio"]'),
      email: document.querySelector('input[name="email"]'),
      phone: document.querySelector('input[name="phone"]')
    }

    return {
      validate,
      getData,
      setData,
      submit
    }

    /**
     * Проверка валидности полей и назначение класса ошибки
     * @return {Object} [description]
     */
    function validate () {
      const errorFields = Object
        .keys(input)
        .map((name) => input[name])
        .reduce((res, input) => {
          const {name, value} = input
          let isValid = true

          // Проверка полей по регулярному выражению средствами браузера
          if (value === '' || !input.checkValidity()) {
            isValid = false
          // Дополнительно проверка поля phone по сумме цифр
          } else if (name === 'phone' && checkDigitSum(value) > 30) {
            isValid = false
          }
          if (!isValid) res.push(name)

          // Установка класса error
          setErrorClass(input, isValid)
          
          return res
        }, [])

      return {
        isValid: errorFields.length === 0,
        errorFields
      }
    }

    /**
     * Получение данных из формы
     * @return {Object} ФИО, email и телефон из формы
     */
    function getData () {
      return {
        fio: input.fio.value,
        email: input.email.value,
        phone: input.phone.value
      }
    }

    /**
     * Установка данных в форму
     * @param {String} options.fio   Фамилия, имя и отчество (ровно 3 слова)
     * @param {String} options.email Email на Яндексе
     * @param {String} options.phone Номер телефона в международном формате
     */
    function setData ({fio, email, phone}) {
      input.fio.value = fio
      input.email.value = email
      input.phone.value = phone
      return
    }

    /**
     * Отправка формы
     * @param  {Element} form Форма, которую пытаемся отправить
     * @return {Boolean}      Отмена стандартного действия, если JS загрузился
     */
    function submit (form) {
      form.submit()
      return false
    }

    /**
     * Получение суммы всех цифр в строке
     * @param  {String} text Строка в которой требуется посчитать сумму цифр
     * @return {Number}      Сумма цифр
     */
    function checkDigitSum (text) {
      const digitSum = text
        .match(/\d/g)
        .reduce((sum, cur) => sum + Number(cur), 0)

      return digitSum
    }

    /**
     * Установка класса ошибки полю ввода
     * при несоответвии наличия класса и валидности поля (XOR), сделать toggle
     * @param {Element}  input   Поле ввода HTML
     */
    function setErrorClass (input, isValid) {
      if (input.classList.contains(errorClassName) ^ !isValid) {
        input.classList.toggle(errorClassName)
      }
    }
  }

  window.MyForm = MyForm()
})()
