import { Chart } from "@/components/ui/chart"
// Global variables
const charts = {}
let dashboardData = {}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  checkAuthentication()
  loadDashboardData()
  updateLastUpdateTime()
})

// Check if user is authenticated
function checkAuthentication() {
  fetch("check-auth.php")
    .then((response) => response.json())
    .then((data) => {
      if (!data.authenticated) {
        window.location.href = "login.html"
      }
    })
    .catch((error) => {
      console.error("Auth check error:", error)
      window.location.href = "login.html"
    })
}

// Load dashboard data
function loadDashboardData() {
  fetch("get-dashboard-data.php")
    .then((response) => response.json())
    .then((data) => {
      dashboardData = data
      updateOverviewStats()
      initializeCharts()
      loadRecentProblems()
      loadRecentSuggestions()
    })
    .catch((error) => {
      console.error("Error loading dashboard data:", error)
    })
}

// Update overview statistics
function updateOverviewStats() {
  document.getElementById("totalFeedbacks").textContent = dashboardData.totalFeedbacks || 0
  document.getElementById("avgSatisfaction").textContent = (dashboardData.avgSatisfaction || 0).toFixed(1) + "/3"
  document.getElementById("recommendationRate").textContent = (dashboardData.recommendationRate || 0).toFixed(1) + "%"
  document.getElementById("problemsReported").textContent = dashboardData.problemsReported || 0
}

// Initialize all charts
function initializeCharts() {
  initFeedbackTrendChart()
  initRecommendationChart()
  initSatisfactionCategoryChart()
  initRatingDistributionChart()
  initServicesUsageChart()
  initVisitFrequencyChart()
  initProblemsTrendChart()
  initProblemTypesChart()
  initRecommendationTrendChart()
  initRecommendationBreakdownChart()
}

// Feedback trend chart
function initFeedbackTrendChart() {
  const ctx = document.getElementById("feedbackTrendChart").getContext("2d")
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
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Recommendation pie chart
function initRecommendationChart() {
  const ctx = document.getElementById("recommendationChart").getContext("2d")
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
        legend: {
          position: "bottom",
        },
      },
    },
  })
}

// Satisfaction by category chart
function initSatisfactionCategoryChart() {
  const ctx = document.getElementById("satisfactionCategoryChart").getContext("2d")
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
          ticks: {
            stepSize: 0.5,
          },
        },
      },
    },
  })
}

// Rating distribution chart
function initRatingDistributionChart() {
  const ctx = document.getElementById("ratingDistributionChart").getContext("2d")
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Services usage chart
function initServicesUsageChart() {
  const ctx = document.getElementById("servicesUsageChart").getContext("2d")
  charts.servicesUsage = new Chart(ctx, {
    type: "horizontalBar",
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Visit frequency chart
function initVisitFrequencyChart() {
  const ctx = document.getElementById("visitFrequencyChart").getContext("2d")
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
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  })
}

// Problems trend chart
function initProblemsTrendChart() {
  const ctx = document.getElementById("problemsTrendChart").getContext("2d")
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Problem types chart
function initProblemTypesChart() {
  const ctx = document.getElementById("problemTypesChart").getContext("2d")
  charts.problemTypes = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: dashboardData.problemTypes?.labels || [],
      datasets: [
        {
          data: dashboardData.problemTypes?.data || [],
          backgroundColor: ["#dc2626", "#f59e0b", "#059669", "#1e3a8a", "#8b5cf6"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  })
}

// Recommendation trend chart
function initRecommendationTrendChart() {
  const ctx = document.getElementById("recommendationTrendChart").getContext("2d")
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
      plugins: {
        legend: {
          display: false,
        },
      },
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

// Recommendation breakdown chart
function initRecommendationBreakdownChart() {
  const ctx = document.getElementById("recommendationBreakdownChart").getContext("2d")
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
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Load recent problems
function loadRecentProblems() {
  const problemsList = document.getElementById("recentProblemsList")
  const problems = dashboardData.recentProblems || []

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
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  // Remove active class from all nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Show selected section
  document.getElementById(sectionId).classList.add("active")

  // Add active class to clicked nav item
  document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add("active")
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
  document.getElementById("lastUpdate").textContent = now.toLocaleString("fr-FR")
}

function refreshData() {
  loadDashboardData()
  updateLastUpdateTime()
}

function exportData(type) {
  window.open(`export-data.php?type=${type}`, "_blank")
}

function logout() {
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    fetch("logout.php", { method: "POST" }).then(() => {
      window.location.href = "login.html"
    })
  }
}
