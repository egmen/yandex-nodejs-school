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
      // Выход, если валидация не пройдена
      const {isValid} = validate()
      if (!isValid) return false

      const {
        action,
        method
      } = form
      const body = new window.FormData(form)
      const fakeAction = createFakeAction()
      const options = fakeAction
        ? {}
        : {method, body}

      window.fetch(fakeAction || action, options)
        .then((result) => result.json())
        .then((result) => {
          const {status, reason, timeout} = result

          switch (status) {
            case 'progress':
              setResultState(status)
              window.setTimeout(() => submit(form), timeout)
              break
            case 'success':
              setResultState(status)
              break
            case 'error':
              setResultState(status, reason)
              break
            default:
              throw new Error('Неизвестный статус')
          }
        })
        .catch((err) => {
          setResultState('error', `Ошибка получения ответа ${err.toString()}`)
        })

      // Для отмены отправки формы средствами браузера
      return false
    }

    /**
     * Получение случайного названия файла по заложенной вероятности
     * @return {String} Имя файла, которое в ответ получит форма
     */
    function createFakeAction () {
      const actionTypes = {
        success: 2,
        error: 1,
        progress: 10
      }
      const actionsList = Object
        .keys(actionTypes)
        .reduce((list, curr) => list.concat(Array(actionTypes[curr]).fill(curr)), [])
      const randomActionKey = Math.floor(Math.random() * actionsList.length)

      return `response/${actionsList[randomActionKey]}.json`
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
     * @param {Element}  inputField   Поле ввода HTML
     */
    function setErrorClass (inputField, isValid) {
      if (inputField.classList.contains(errorClassName) ^ !isValid) {
        inputField.classList.toggle(errorClassName)
      }
    }

    /**
     * Установка класса результата
     * @param {String} className Наименование класса для установки
     * @param {String} text      Текст для установки в компоненте
     */
    function setResultState (className, text = '') {
      const classList = 'progress_success_error'.split('_')
      const resultContainer = document.querySelector('#resultContainer')

      // Проверка соответсвия текущего класса и отсутвию других
      classList.forEach((currentClass) => {
        if (resultContainer.classList.contains(currentClass) ^ !(className === currentClass)) {
          resultContainer.classList.toggle(errorClassName)
        }
      })
      resultContainer.innerHTML = text
    }
  }

  window.MyForm = MyForm()
})()
