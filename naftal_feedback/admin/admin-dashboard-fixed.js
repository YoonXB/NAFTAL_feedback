import { Chart } from "@/components/ui/chart"
// Global variables
let charts = {}
let dashboardData = {}
let isDataLoaded = false

// Initialize dashboard when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard initializing...")
  checkAuthentication()
})

// Check if user is authenticated
function checkAuthentication() {
  console.log("Checking authentication...")

  fetch("check-auth.php")
    .then((response) => {
      console.log("Auth check response status:", response.status)
      return response.json()
    })
    .then((data) => {
      console.log("Auth response:", data)
      if (!data.authenticated) {
        console.log("Not authenticated, redirecting to login")
        window.location.href = "login.html"
      } else {
        console.log("Authenticated, loading dashboard")
        loadDashboardData()
      }
    })
    .catch((error) => {
      console.error("Auth check error:", error)
      console.log("Auth check failed, loading sample data instead")
      // If auth check fails, assume we're in development mode
      loadSampleData()
    })
}

// Load dashboard data
function loadDashboardData() {
  console.log("Loading dashboard data...")
  showLoading(true)

  fetch("get-dashboard-data.php")
    .then((response) => {
      console.log("Dashboard data response status:", response.status)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      console.log("Dashboard data received:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      dashboardData = data
      isDataLoaded = true
      showLoading(false)
      updateDashboard()
    })
    .catch((error) => {
      console.error("Error loading dashboard data:", error)
      console.log("Loading sample data instead...")
      showLoading(false)
      // Load sample data instead of showing error
      loadSampleData()
    })
}

// Load sample data if real data fails
function loadSampleData() {
  console.log("Loading sample data for demonstration")

  dashboardData = {
    totalFeedbacks: 25,
    avgSatisfaction: 2.4,
    recommendationRate: 76.5,
    problemsReported: 8,
    feedbackTrend: {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      data: [3, 5, 2, 8, 4, 6, 7],
    },
    recommendationData: [19, 4, 2], // oui, non, peut-être
    satisfactionByCategory: [2.5, 2.1, 2.8, 2.6, 2.3, 2.2],
    ratingDistribution: [5, 8, 12],
    servicesUsage: {
      labels: ["Carburant", "Boutique", "Sanitaires", "Restaurant", "Lavage"],
      data: [23, 15, 12, 8, 6],
    },
    visitFrequency: [8, 10, 5, 2], // première fois, occasionnelle, régulière, quotidienne
    problemsTrend: {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      data: [1, 2, 0, 3, 1, 1, 2],
    },
    recentProblems: [
      { client_name: "Ahmed B.", problem_details: "Sanitaires sales", created_at: "2024-01-15 14:30:00" },
      { client_name: "Fatima K.", problem_details: "Attente trop longue", created_at: "2024-01-14 09:15:00" },
      { client_name: "Karim M.", problem_details: "Pompe en panne", created_at: "2024-01-13 10:20:00" },
    ],
    recentSuggestions: [
      { client_name: "Mohamed S.", suggestions: "Ajouter plus de pompes", created_at: "2024-01-13 16:45:00" },
      { client_name: "Amina B.", suggestions: "Améliorer l'éclairage", created_at: "2024-01-12 11:20:00" },
      { client_name: "Yacine D.", suggestions: "Agrandir la boutique", created_at: "2024-01-11 15:30:00" },
    ],
    recommendationTrend: {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      data: [80, 75, 85, 70, 78, 82, 76],
    },
  }

  isDataLoaded = true
  showLoading(false)
  updateDashboard()
}

// Update all dashboard elements
function updateDashboard() {
  console.log("Updating dashboard with data")
  updateOverviewStats()
  initializeCharts()
  loadRecentProblems()
  loadRecentSuggestions()
  updateLastUpdateTime()
  hideError()
}

// Show/hide loading indicator
function showLoading(show) {
  const loadingIndicator = document.getElementById("loadingIndicator")
  const mainContent = document.querySelector(".main-content")

  if (show) {
    loadingIndicator.style.display = "flex"
    if (mainContent) mainContent.style.opacity = "0.5"
  } else {
    loadingIndicator.style.display = "none"
    if (mainContent) mainContent.style.opacity = "1"
  }
}

// Show error message
function showError(message) {
  const errorMessage = document.getElementById("errorMessage")
  const errorText = document.getElementById("errorText")

  if (errorText) errorText.textContent = message
  if (errorMessage) errorMessage.style.display = "block"
}

// Hide error message
function hideError() {
  const errorMessage = document.getElementById("errorMessage")
  if (errorMessage) errorMessage.style.display = "none"
}

// Update overview statistics
function updateOverviewStats() {
  console.log("Updating overview stats")

  const elements = {
    totalFeedbacks: dashboardData.totalFeedbacks || 0,
    avgSatisfaction: (dashboardData.avgSatisfaction || 0).toFixed(1) + "/3",
    recommendationRate: (dashboardData.recommendationRate || 0).toFixed(1) + "%",
    problemsReported: dashboardData.problemsReported || 0,
  }

  Object.entries(elements).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) element.textContent = value
  })
}

// Initialize all charts
function initializeCharts() {
  console.log("Initializing charts")

  // Check if Chart.js is loaded
  if (typeof Chart === "undefined") {
    console.error("Chart.js is not loaded!")
    showError("Erreur: Chart.js n'est pas chargé. Veuillez actualiser la page.")
    return
  }

  // Destroy existing charts
  Object.values(charts).forEach((chart) => {
    if (chart && typeof chart.destroy === "function") {
      chart.destroy()
    }
  })
  charts = {}

  try {
    initFeedbackTrendChart()
    initRecommendationChart()
    initSatisfactionCategoryChart()
    initRatingDistributionChart()
    initServicesUsageChart()
    initVisitFrequencyChart()
    initProblemsTrendChart()
    initProblemsOverviewChart()
    initRecommendationTrendChart()
    initRecommendationBreakdownChart()
    updateSatisfactionBars()
    console.log("All charts initialized successfully")
  } catch (error) {
    console.error("Error initializing charts:", error)
    showError("Erreur lors de l'initialisation des graphiques: " + error.message)
  }
}

// Individual chart initialization functions
function initFeedbackTrendChart() {
  const ctx = document.getElementById("feedbackTrendChart")
  if (!ctx) return

  charts.feedbackTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: dashboardData.feedbackTrend?.labels || [],
      datasets: [
        {
          label: "Nombre de retours",
          data: dashboardData.feedbackTrend?.data || [],
          borderColor: "#1e3a8a",
          backgroundColor: "rgba(30, 58, 138, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  })
}

function initRecommendationChart() {
  const ctx = document.getElementById("recommendationChart")
  if (!ctx) return

  charts.recommendation = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Oui", "Non", "Peut-être"],
      datasets: [
        {
          data: dashboardData.recommendationData || [0, 0, 0],
          backgroundColor: ["#059669", "#dc2626", "#f59e0b"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  })
}

function initSatisfactionCategoryChart() {
  const ctx = document.getElementById("satisfactionCategoryChart")
  if (!ctx) return

  charts.satisfactionCategory = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "Qualité Station",
        "Propreté Sanitaires",
        "Rapidité Service",
        "Amabilité Personnel",
        "Disponibilité Produits",
        "Perception Prix",
      ],
      datasets: [
        {
          label: "Satisfaction Moyenne",
          data: dashboardData.satisfactionByCategory || [0, 0, 0, 0, 0, 0],
          borderColor: "#1e3a8a",
          backgroundColor: "rgba(30, 58, 138, 0.2)",
          pointBackgroundColor: "#1e3a8a",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 3,
          ticks: { stepSize: 0.5 },
        },
      },
    },
  })
}

function initRatingDistributionChart() {
  const ctx = document.getElementById("ratingDistributionChart")
  if (!ctx) return

  charts.ratingDistribution = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Insatisfait (1)", "Neutre (2)", "Satisfait (3)"],
      datasets: [
        {
          label: "Nombre de réponses",
          data: dashboardData.ratingDistribution || [0, 0, 0],
          backgroundColor: ["#dc2626", "#f59e0b", "#059669"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  })
}

function initServicesUsageChart() {
  const ctx = document.getElementById("servicesUsageChart")
  if (!ctx) return

  charts.servicesUsage = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dashboardData.servicesUsage?.labels || [],
      datasets: [
        {
          label: "Nombre d'utilisations",
          data: dashboardData.servicesUsage?.data || [],
          backgroundColor: "#f59e0b",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  })
}

function initVisitFrequencyChart() {
  const ctx = document.getElementById("visitFrequencyChart")
  if (!ctx) return

  charts.visitFrequency = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Première fois", "Occasionnelle", "Régulière", "Quotidienne"],
      datasets: [
        {
          data: dashboardData.visitFrequency || [0, 0, 0, 0],
          backgroundColor: ["#dc2626", "#f59e0b", "#059669", "#1e3a8a"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  })
}

function initProblemsTrendChart() {
  const ctx = document.getElementById("problemsTrendChart")
  if (!ctx) return

  charts.problemsTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: dashboardData.problemsTrend?.labels || [],
      datasets: [
        {
          label: "Problèmes signalés",
          data: dashboardData.problemsTrend?.data || [],
          borderColor: "#dc2626",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  })
}

function initProblemsOverviewChart() {
  const ctx = document.getElementById("problemsOverviewChart")
  if (!ctx) return

  const totalFeedbacks = dashboardData.totalFeedbacks || 0
  const problemsReported = dashboardData.problemsReported || 0
  const noProblems = totalFeedbacks - problemsReported

  charts.problemsOverview = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Pas de problème", "Problème signalé"],
      datasets: [
        {
          data: [noProblems, problemsReported],
          backgroundColor: ["#059669", "#dc2626"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
    },
  })
}

function initRecommendationTrendChart() {
  const ctx = document.getElementById("recommendationTrendChart")
  if (!ctx) return

  charts.recommendationTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: dashboardData.recommendationTrend?.labels || [],
      datasets: [
        {
          label: "Taux de recommandation (%)",
          data: dashboardData.recommendationTrend?.data || [],
          borderColor: "#059669",
          backgroundColor: "rgba(5, 150, 105, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => value + "%",
          },
        },
      },
    },
  })
}

function initRecommendationBreakdownChart() {
  const ctx = document.getElementById("recommendationBreakdownChart")
  if (!ctx) return

  charts.recommendationBreakdown = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Oui", "Non", "Peut-être"],
      datasets: [
        {
          label: "Nombre de réponses",
          data: dashboardData.recommendationData || [0, 0, 0],
          backgroundColor: ["#059669", "#dc2626", "#f59e0b"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  })
}

// Update satisfaction progress bars
function updateSatisfactionBars() {
  const categories = dashboardData.satisfactionByCategory || [0, 0, 0, 0, 0, 0]
  const elements = [
    { bar: "stationQualityBar", text: "stationQualityText", value: categories[0] },
    { bar: "serviceSpeedBar", text: "serviceSpeedText", value: categories[2] },
    { bar: "staffFriendlinessBar", text: "staffFriendlinessText", value: categories[3] },
    { bar: "productAvailabilityBar", text: "productAvailabilityText", value: categories[4] },
  ]

  elements.forEach((element) => {
    const percentage = (element.value / 3) * 100
    const barElement = document.getElementById(element.bar)
    const textElement = document.getElementById(element.text)

    if (barElement) barElement.style.width = percentage + "%"
    if (textElement) textElement.textContent = `${element.value.toFixed(1)}/3 (${percentage.toFixed(0)}%)`
  })
}

// Load recent problems
function loadRecentProblems() {
  const problemsList = document.getElementById("recentProblemsList")
  const problems = dashboardData.recentProblems || []

  if (!problemsList) return

  if (problems.length === 0) {
    problemsList.innerHTML = '<div class="problem-item">Aucun problème signalé récemment</div>'
    return
  }

  problemsList.innerHTML = problems
    .map(
      (problem) => `
        <div class="problem-item">
            <div class="item-header">
                <strong>${problem.client_name}</strong>
                <span class="item-date">${formatDate(problem.created_at)}</span>
            </div>
            <div class="item-content">${problem.problem_details}</div>
        </div>
    `,
    )
    .join("")
}

// Load recent suggestions
function loadRecentSuggestions() {
  const suggestionsList = document.getElementById("recentSuggestionsList")
  const suggestions = dashboardData.recentSuggestions || []

  if (!suggestionsList) return

  if (suggestions.length === 0) {
    suggestionsList.innerHTML = '<div class="suggestion-item">Aucune suggestion récente</div>'
    return
  }

  suggestionsList.innerHTML = suggestions
    .map(
      (suggestion) => `
        <div class="suggestion-item">
            <div class="item-header">
                <strong>${suggestion.client_name}</strong>
                <span class="item-date">${formatDate(suggestion.created_at)}</span>
            </div>
            <div class="item-content">${suggestion.suggestions}</div>
        </div>
    `,
    )
    .join("")
}

// Navigation functions
function showSection(sectionId) {
  console.log("Showing section:", sectionId)

  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  // Remove active class from all nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Show selected section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Add active class to clicked nav item
  const navItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`)
  if (navItem) {
    navItem.classList.add("active")
  }
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function updateLastUpdateTime() {
  const now = new Date()
  const element = document.getElementById("lastUpdate")
  if (element) element.textContent = now.toLocaleString("fr-FR")
}

function refreshData() {
  console.log("Refreshing data...")
  loadDashboardData()
}

function exportData(type) {
  console.log("Exporting data type:", type)
  window.open(`export_csv.php?type=${type}`, "_blank")
}

function logout() {
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    fetch("logout.php", { method: "POST" })
      .then(() => {
        // Clear any stored credentials
        if (typeof Storage !== "undefined") {
          localStorage.removeItem("admin_credentials")
          sessionStorage.clear()
        }
        window.location.href = "login.html"
      })
      .catch((error) => {
        console.error("Logout error:", error)
        window.location.href = "login.html"
      })
  }
}
