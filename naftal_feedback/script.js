let currentScreen = 1
const totalScreens = 3

function nextScreen() {
  if (validateCurrentScreen()) {
    if (currentScreen < totalScreens) {
      document.getElementById(`screen${currentScreen}`).classList.remove("active")
      currentScreen++
      document.getElementById(`screen${currentScreen}`).classList.add("active")
      updateProgress()
      updateStepIndicator()
    }
  }
}

function prevScreen() {
  if (currentScreen > 1) {
    document.getElementById(`screen${currentScreen}`).classList.remove("active")
    currentScreen--
    document.getElementById(`screen${currentScreen}`).classList.add("active")
    updateProgress()
    updateStepIndicator()
  }
}

function updateProgress() {
  const progress = (currentScreen / totalScreens) * 100
  document.getElementById("progress").style.width = progress + "%"
}

function updateStepIndicator() {
  const steps = document.querySelectorAll(".step")
  steps.forEach((step, index) => {
    step.classList.remove("active", "completed")
    if (index + 1 < currentScreen) {
      step.classList.add("completed")
    } else if (index + 1 === currentScreen) {
      step.classList.add("active")
    }
  })
}

function validateCurrentScreen() {
  const currentScreenElement = document.getElementById(`screen${currentScreen}`)
  const requiredFields = currentScreenElement.querySelectorAll("[required]")

  for (const field of requiredFields) {
    if (field.type === "radio") {
      const radioGroup = currentScreenElement.querySelectorAll(`[name="${field.name}"]`)
      const isChecked = Array.from(radioGroup).some((radio) => radio.checked)
      if (!isChecked) {
        alert("Veuillez répondre à toutes les questions obligatoires.")
        return false
      }
    } else if (!field.value.trim()) {
      alert("Veuillez remplir tous les champs obligatoires.")
      field.focus()
      return false
    }
  }

  // Validate that at least one service is selected in screen 1
  if (currentScreen === 1) {
    const services = currentScreenElement.querySelectorAll('input[name="services[]"]:checked')
    if (services.length === 0) {
      alert("Veuillez sélectionner au moins un service utilisé.")
      return false
    }
  }

  return true
}

function toggleProblemDescription() {
  const problemRadio = document.querySelector('input[name="encountered_problem"]:checked')
  const problemDescription = document.getElementById("problemDescription")

  if (problemRadio && problemRadio.value === "oui") {
    problemDescription.classList.remove("hidden")
    document.getElementById("problem_details").required = true
  } else {
    problemDescription.classList.add("hidden")
    document.getElementById("problem_details").required = false
    document.getElementById("problem_details").value = ""
  }
}

// Character count for textareas
function setupCharacterCount() {
  const textareas = document.querySelectorAll("textarea")
  textareas.forEach((textarea) => {
    const maxLength = textarea.getAttribute("maxlength")
    const charCountElement = textarea.nextElementSibling

    textarea.addEventListener("input", function () {
      const currentLength = this.value.length
      charCountElement.textContent = `${currentLength}/${maxLength}`

      if (currentLength > maxLength * 0.9) {
        charCountElement.style.color = "#e74c3c"
      } else {
        charCountElement.style.color = "#666"
      }
    })
  })
}

// Form submission - now goes to summary page
document.getElementById("feedbackForm").addEventListener("submit", function (e) {
  e.preventDefault()

  if (!validateCurrentScreen()) {
    return
  }

  // Collect all form data
  const formData = new FormData(this)
  const surveyData = {}

  // Convert FormData to object
  for (const [key, value] of formData.entries()) {
    if (key.endsWith("[]")) {
      const cleanKey = key.slice(0, -2)
      if (!surveyData[cleanKey]) {
        surveyData[cleanKey] = []
      }
      surveyData[cleanKey].push(value)
    } else {
      surveyData[key] = value
    }
  }

  // Store survey data in localStorage
  localStorage.setItem("naftal_survey_data", JSON.stringify(surveyData))

  // Redirect to summary page
  window.location.href = "summary.html"
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupCharacterCount()
  updateProgress()
  updateStepIndicator()

  // Check if client info exists, if not redirect to client info page
  const clientInfo = localStorage.getItem("naftal_client_info")
  if (!clientInfo) {
    window.location.href = "client-info.html"
  }
})
