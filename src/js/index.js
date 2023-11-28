//Captura das Divs STEP
const $stepText = $('#step-text')
const $stepDescription = $('#step-description')
const $stepOne = $('.step.one')
const $stepTwo = $('.step.two')
const $stepThree = $('.step.three')
const $title = $('#title')

const $containerBtnFormOne = $('#containerBtnFormOne')
const $btnFormOne = $('#btnFormOne')

const $containerBtnFormTwo = $('#containerBtnFormTwo')
const $btnFormTwo = $('#btnFormTwo')

const $containerBtnFormThree = $('#containerBtnFormThree')
const $btnFormThree = $('#btnFormThree')

const $inputNome = $('#nome')
const $inputSobreNome = $('#sobrenome')
const $inputDataNascimento = $('#dataNascimento')
const $inputEmail = $('#email')
const $inputMinibio = $('#minibio')

const $inputEndereco = $('#endereco')
const $inputComplemento = $('#complemento')
const $inputCidade = $('#cidade')
const $inputCep = $('#cep')
const $inputHabilidades = $('#habilidades')
const $inputPontos = $('#pontosForte')

//variaveis de controle para verificar se os campos dos formularios são ou não válidos
let nomeValido = false
let sobreNomeValido = false
let dataDeNascimentoValido = false
let emailValido = false
let enderecoValido = false
let cidadeValida = false
let cepValido = false
let habilidadesValida = false
let pontosValido = false

const minLengthText = 2
const minLengthTextArea = 10
const emailRegex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const cepRegex = /^([\d]{2})\.?([\d]{3})\-?([\d]{3})/

function validarInput(element, minLength, maxLength, regex) {
  const closest = $(element).closest('.input-data') // closest é para achar o elemento mais próximo de acordo com a seletor
  if (
    !element.value ||
    (minLength && element.value.trim().length < minLength) ||
    (minLength && element.value.trim().length > maxLength) ||
    (regex && !element.value.toLowerCase().match(regex)) //essa validação verifica se o regex existe, caso ele exista verifica se as informçãoes são iguais as esperadas no regex
  ) {
    closest.addClass('error')
    return false
  }

  closest.removeClass('error')
  return true
}

function validarFormularioUm() {
  if (nomeValido && sobreNomeValido && emailValido && dataDeNascimentoValido) {
    $containerBtnFormOne.removeClass('disabled')
    $btnFormOne.removeClass('disabled')
    $btnFormOne.off('click').on('click', iniciarFormulario2)
    /* Aqui utilizamos o off para remover um click anterior caso ele tenha, isso é feito para evitar acumulo de listners de click, caso  tenha esse acumulo o resultado seria a função ser executada mais vezes que o necessário*/
  } else {
    $containerBtnFormOne.addClass('disabled')
    $btnFormOne.addClass('disabled')
    $btnFormOne.off('click')
  }
}
function validarFormularioDois() {
  if (enderecoValido && cidadeValida && cepValido) {
    $containerBtnFormTwo.removeClass('disabled')
    $btnFormTwo.removeClass('disabled')
    $btnFormTwo.off('click').on('click', iniciarFormulario3)
  } else {
    $containerBtnFormTwo.addClass('disabled')
    $btnFormTwo.addClass('disabled')
    $btnFormTwo.off('click')
  }
}

async function salvarNoTrello() {
  try {
    const nome = $inputNome.val()
    const sobreNome = $inputSobreNome.val()
    const email = $inputEmail.val()
    const dataNascimento = $inputDataNascimento.val()
    const miniBio = $inputMinibio.val()
    const endereco = $inputEndereco.val()
    const complemento = $inputComplemento.val()
    const cidade = $inputCidade.val()
    const cep = $inputCep.val()
    const habilidades = $inputHabilidades.val()
    const pontosForte = $inputPontos.val()

    if (
      !nome ||
      !sobreNome ||
      !email ||
      !dataNascimento ||
      !miniBio ||
      !endereco ||
      !complemento ||
      !cidade ||
      !cep ||
      !habilidades ||
      !pontosForte
    ) {
      return alert('Favor preencher todos os dados para seguir')
    }
    const body = {
      name: 'Formulário de candidatura - ' + nome,
      desc: `Seguem dados do candidato:
          ------------------- Dados pessoais ------------
          Nome: ${nome}
          Sobrenome: ${sobreNome}
          Email: ${email}
          Data nascimento: ${dataNascimento}
          Minibio: ${miniBio}
          ------------------- Dados de endereço ------------
          Endereço: ${endereco}
          Complemento: ${complemento}
          Cidade: ${cidade}
          CEP: ${cep}
          ------------------- Dados do candidato(a) ------------
          Habilidades: ${habilidades}
          Pontos Fortes: ${pontosForte}`
    }
    await fetch(
      'https://api.trello.com/1/cards?idList=65648cf7fb9df21c9cce0499&key=808813888e6935ab9bd7741b2ca37c32&token=ATTA80ab3199aae736b310f117a279b3a4cb75b36ac3842403c1e23018844bc72339594D2C93',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/Json'
        },

        body: JSON.stringify(body)
      }
    )
    return finalizarFormulario()
  } catch (error) {
    console.log('Ocorreu erro ao salvar no Trello', error)
  }
}

function validarFormularioTres() {
  if (habilidadesValida && pontosValido) {
    $containerBtnFormThree.removeClass('disabled')
    $btnFormThree.removeClass('disabled')
    $btnFormThree.off('click').on('click', salvarNoTrello)
  } else {
    $containerBtnFormThree.addClass('disabled')
    $btnFormThree.addClass('disabled')
    $btnFormThree.off('click')
  }
}

function iniciarFormulario2() {
  $stepText.text('Passo 2 de 3 - Dados de correspondência')
  $stepDescription.text(
    'Precisamos desses dados para que possamos entrar em contato se necessário.'
  )
  $stepOne.hide()
  $stepTwo.show()

  $inputEndereco.keyup(function () {
    enderecoValido = validarInput(this, minLengthTextArea)
    validarFormularioDois()
  })
  $inputCidade.keyup(function () {
    cidadeValida = validarInput(this, minLengthText)
    validarFormularioDois()
  })

  $inputCep.keyup(function () {
    this.value = this.value.replace(/\D/g, '') // Captura o valor do input de CEP e substitui os valores nao numericos por ""
    cepValido = validarInput(this, null, null, cepRegex)
    if (cepValido) {
      this.value = this.value.replace(cepRegex, '$1.$2-$3') //Esse $ é para fazer a separação de blocos do CEP
    }
    validarFormularioDois()
  })

  $inputComplemento.keyup(function () {
    validarFormularioDois()
  })
}

function iniciarFormulario3() {
  $stepText.text('Passo 3 de 3 - Fale sobre você')
  $stepDescription.text(
    'Paa que possamos filtrar melhor você no processo, conte-nos um pouco mais sobre você suas habilidades e pontos fortes.'
  )
  $stepTwo.hide()
  $stepThree.show()

  $inputHabilidades.keyup(function () {
    habilidadesValida = validarInput(this, minLengthTextArea)
    validarFormularioTres()
  })
  $inputPontos.keyup(function () {
    pontosValido = validarInput(this, minLengthTextArea)
    validarFormularioTres()
  })
}

function finalizarFormulario() {
  $stepThree.hide()
  $stepDescription.hide()
  $title.text('Inscriçaõ realizada com sucesso')
  $stepText.text(
    'Agradecemos a sua inscrição, entraremos em contato assim que possível, nosso prazo de análise é de 5 dias úteis'
  )
}

//Função Inicializadora
function init() {
  $stepText.text('Passo 1 de 3 - Dados Pessoais')
  $stepDescription.text(
    'Descreva seus dados para que possamos te conhecer melhor.'
  )
  $stepTwo.hide()
  $stepThree.hide()

  $inputNome.keyup(function () {
    // KeyUp é uma função que dispara algum comportamento depois que o usuario solta alguma tecla QUE ele acabou de pressionar
    nomeValido = validarInput(this, minLengthText)
    validarFormularioUm()
  })

  $inputSobreNome.keyup(function () {
    sobreNomeValido = validarInput(this, minLengthText)
    validarFormularioUm()
  })

  $inputDataNascimento.keyup(function () {
    dataDeNascimentoValido = validarInput(this, minLengthText)
    validarFormularioUm()
  })

  $inputDataNascimento.change(function () {
    dataDeNascimentoValido = validarInput(this, minLengthText)
    validarFormularioUm()
  })

  $inputDataNascimento.on('focus', function () {
    //Muda o input para date quando está selecionado.
    this.type = 'date'
  })

  $inputDataNascimento.on('blur', function () {
    //Muda o input para text quando não está preenchido.
    if (!this.value) {
      this.type = 'text'
    }
  })

  $inputEmail.keyup(function () {
    emailValido = validarInput(this, null, null, emailRegex)
    validarFormularioUm()
  })
  $inputMinibio.keyup(function () {
    validarFormularioUm()
  })
}

init()
