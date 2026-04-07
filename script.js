// ═══════════════════════════════════════════════════════════════
//  INDIA MAP COLORING — Simulated Annealing
//  D3 real state outlines + state name labels + SA/Chart/Theme
// ═══════════════════════════════════════════════════════════════

// ── GeoJSON source (India states, all states/UTs) ──
const GEO_URL = "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

// ── 8-color palette (matches original legend) ──
const COLOR_PALETTE = [
    "#e63946", // Color 1 — red
    "#457b9d", // Color 2 — steel blue
    "#2a9d8f", // Color 3 — teal
    "#e9c46a", // Color 4 — golden
    "#b5838d", // Color 5 — rose
    "#6d6875", // Color 6 — mauve
    "#f4a261", // Color 7 — orange
    "#90be6d"  // Color 8 — lime green
];

// ── Short/split display names for state labels ──
// Multi-line names use "\n" as line separator
const SHORT_NAMES = {
    "Andaman & Nicobar Island": "A&N Is.",
    "Andhra Pradesh":           "Andhra\nPradesh",
    "Arunachal Pradesh":        "Arunachal\nPradesh",
    "Assam":                    "Assam",
    "Bihar":                    "Bihar",
    "Chandigarh":               "Chd.",
    "Chhattisgarh":             "Chhattisgarh",
    "Dadra and Nagar Haveli":   "DNH",
    "Daman and Diu":            "D&D",
    "Delhi":                    "Delhi",
    "Goa":                      "Goa",
    "Gujarat":                  "Gujarat",
    "Haryana":                  "Haryana",
    "Himachal Pradesh":         "Himachal\nPradesh",
    "Jammu & Kashmir":          "J&K",
    "Jharkhand":                "Jharkhand",
    "Karnataka":                "Karnataka",
    "Kerala":                   "Kerala",
    "Ladakh":                   "Ladakh",
    "Lakshadweep":              "Lkshd.",
    "Madhya Pradesh":           "Madhya\nPradesh",
    "Maharashtra":              "Maharashtra",
    "Manipur":                  "Manipur",
    "Meghalaya":                "Meghalaya",
    "Mizoram":                  "Mizoram",
    "Nagaland":                 "Nagaland",
    "Odisha":                   "Odisha",
    "Puducherry":               "Puduch.",
    "Punjab":                   "Punjab",
    "Rajasthan":                "Rajasthan",
    "Sikkim":                   "Sikkim",
    "Tamil Nadu":               "Tamil\nNadu",
    "Telangana":                "Telangana",
    "Tripura":                  "Tripura",
    "Uttar Pradesh":            "Uttar\nPradesh",
    "Uttarakhand":              "Uttara\nkhand",
    "West Bengal":              "West\nBengal"
};

// ── Real India state adjacency (by GeoJSON ST_NM name) ──
const ADJ_NAMES = {
    "Andaman & Nicobar Island": [],
    "Andhra Pradesh":  ["Karnataka","Telangana","Chhattisgarh","Odisha","Tamil Nadu"],
    "Arunachal Pradesh": ["Assam","Nagaland"],
    "Assam":           ["Arunachal Pradesh","Nagaland","Manipur","Mizoram","Tripura","Meghalaya","West Bengal","Sikkim"],
    "Bihar":           ["Uttar Pradesh","Jharkhand","West Bengal"],
    "Chandigarh":      ["Punjab","Haryana"],
    "Chhattisgarh":    ["Madhya Pradesh","Uttar Pradesh","Jharkhand","Odisha","Andhra Pradesh","Telangana","Maharashtra"],
    "Dadra and Nagar Haveli": ["Gujarat","Maharashtra"],
    "Daman and Diu":   ["Gujarat"],
    "Delhi":           ["Haryana","Uttar Pradesh","Rajasthan"],
    "Goa":             ["Karnataka","Maharashtra"],
    "Gujarat":         ["Rajasthan","Madhya Pradesh","Maharashtra","Dadra and Nagar Haveli","Daman and Diu"],
    "Haryana":         ["Punjab","Himachal Pradesh","Uttar Pradesh","Rajasthan","Delhi","Chandigarh"],
    "Himachal Pradesh":["Punjab","Haryana","Uttar Pradesh","Uttarakhand","Jammu & Kashmir"],
    "Jammu & Kashmir": ["Himachal Pradesh","Punjab","Ladakh"],
    "Jharkhand":       ["Bihar","West Bengal","Odisha","Chhattisgarh","Uttar Pradesh"],
    "Karnataka":       ["Goa","Maharashtra","Andhra Pradesh","Telangana","Kerala","Tamil Nadu"],
    "Kerala":          ["Karnataka","Tamil Nadu"],
    "Ladakh":          ["Jammu & Kashmir"],
    "Lakshadweep":     [],
    "Madhya Pradesh":  ["Rajasthan","Uttar Pradesh","Chhattisgarh","Maharashtra","Gujarat"],
    "Maharashtra":     ["Gujarat","Madhya Pradesh","Chhattisgarh","Telangana","Andhra Pradesh","Karnataka","Goa","Dadra and Nagar Haveli"],
    "Manipur":         ["Assam","Nagaland","Mizoram"],
    "Meghalaya":       ["Assam"],
    "Mizoram":         ["Assam","Manipur","Tripura"],
    "Nagaland":        ["Assam","Arunachal Pradesh","Manipur"],
    "Odisha":          ["West Bengal","Jharkhand","Chhattisgarh","Andhra Pradesh"],
    "Puducherry":      ["Tamil Nadu"],
    "Punjab":          ["Haryana","Himachal Pradesh","Rajasthan","Chandigarh","Jammu & Kashmir"],
    "Rajasthan":       ["Punjab","Haryana","Uttar Pradesh","Madhya Pradesh","Gujarat","Delhi"],
    "Sikkim":          ["West Bengal"],
    "Tamil Nadu":      ["Kerala","Karnataka","Andhra Pradesh","Puducherry"],
    "Telangana":       ["Maharashtra","Chhattisgarh","Andhra Pradesh","Karnataka"],
    "Tripura":         ["Assam","Mizoram"],
    "Uttar Pradesh":   ["Uttarakhand","Himachal Pradesh","Haryana","Delhi","Rajasthan","Madhya Pradesh","Chhattisgarh","Bihar","Jharkhand"],
    "Uttarakhand":     ["Himachal Pradesh","Uttar Pradesh"],
    "West Bengal":     ["Sikkim","Jharkhand","Bihar","Odisha","Assam"]
};

// ═══════════════════════════════════════════════════════════════
//  RUNTIME STATE
// ═══════════════════════════════════════════════════════════════
let stateNames   = [];   // ordered list (from GeoJSON features)
let nameToIdx    = {};   // name → array index
let adjIdx       = [];   // adjacency as index arrays
let statePathEls = {};   // name → D3 selection of <path>

let currentColors   = [];
let bestColors      = [];
let bestConflicts   = Infinity;
let currentConflicts = 0;
let temperature      = 100.0;

const INIT_TEMP    = 100.0;
const COOLING_RATE = 0.985;

let annealingActive  = false;
let animationTimer   = null;
let animationSpeedMs = 45;

let tempHistory     = [];
let conflictHistory = [];
const MAX_HISTORY   = 60;

// ═══════════════════════════════════════════════════════════════
//  CONFLICT COUNTING
// ═══════════════════════════════════════════════════════════════
function computeConflicts(colors) {
    let n = 0;
    for (let i = 0; i < stateNames.length; i++)
        for (const j of adjIdx[i])
            if (j > i && colors[i] === colors[j]) n++;
    return n;
}

function getConflictingIndices(colors) {
    const set = new Set();
    for (let i = 0; i < stateNames.length; i++)
        for (const j of adjIdx[i])
            if (j > i && colors[i] === colors[j]) { set.add(i); set.add(j); }
    return set;
}

// ═══════════════════════════════════════════════════════════════
//  D3 MAP — LOAD & RENDER
// ═══════════════════════════════════════════════════════════════
async function loadMap() {
    const res = await fetch(GEO_URL);
    const geo = await res.json();

    const svgEl = document.getElementById("indiaMapSVG");
    const svg   = d3.select(svgEl);
    const g     = svg.select("#statesGroup");
    const labelsG = svg.select("#labelsGroup"); // separate layer for labels

    // Fit projection to viewBox 560×650
    const projection = d3.geoMercator().fitSize([560, 650], geo);
    const pathGen    = d3.geoPath().projection(projection);

    const tooltip = document.getElementById("mapTooltip");

    // Build stateNames list from GeoJSON
    geo.features.forEach(f => stateNames.push(f.properties.ST_NM));

    // Build index maps
    stateNames.forEach((n, i) => { nameToIdx[n] = i; });

    // Build adjacency index arrays
    adjIdx = stateNames.map(() => []);
    stateNames.forEach((name, i) => {
        (ADJ_NAMES[name] || []).forEach(nb => {
            const j = nameToIdx[nb];
            if (j !== undefined && !adjIdx[i].includes(j)) {
                adjIdx[i].push(j);
                if (!adjIdx[j].includes(i)) adjIdx[j].push(i);
            }
        });
    });

    // Draw each state as a real geographic <path>
    geo.features.forEach(f => {
        const name = f.properties.ST_NM;
        const el = g.append("path")
            .datum(f)
            .attr("d", pathGen)
            .attr("class", "state-path")
            .attr("data-name", name)
            .on("mousemove", (evt) => {
                const idx = nameToIdx[name];
                const col = COLOR_PALETTE[currentColors[idx] % COLOR_PALETTE.length];
                tooltip.style.opacity = "1";
                tooltip.style.left = (evt.clientX + 16) + "px";
                tooltip.style.top  = (evt.clientY - 36) + "px";
                tooltip.innerHTML  =
                    `<strong>${name}</strong><br>` +
                    `<span style="display:inline-flex;align-items:center;gap:6px;margin-top:3px">` +
                    `<span style="width:10px;height:10px;border-radius:50%;background:${col};display:inline-block"></span>` +
                    `Color ${(currentColors[idx] % COLOR_PALETTE.length) + 1}</span>`;
            })
            .on("mouseleave", () => { tooltip.style.opacity = "0"; });

        statePathEls[name] = el;
    });

    // ── Add state name labels at centroid of each state ──
    geo.features.forEach(f => {
        const name     = f.properties.ST_NM;
        const centroid = pathGen.centroid(f);

        // Skip if centroid is invalid (e.g. island groups off-canvas)
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;

        const displayName = SHORT_NAMES[name] || name;
        const lines       = displayName.split("\n");

        if (lines.length === 1) {
            // Single-line label
            labelsG.append("text")
                .attr("class", "state-label")
                .attr("x", centroid[0])
                .attr("y", centroid[1])
                .text(lines[0]);
        } else {
            // Multi-line label using <tspan> elements
            const textEl = labelsG.append("text")
                .attr("class", "state-label")
                .attr("x", centroid[0])
                .attr("y", centroid[1] - 3); // nudge up slightly for multi-line

            lines.forEach((line, li) => {
                textEl.append("tspan")
                    .attr("x", centroid[0])
                    .attr("dy", li === 0 ? 0 : 6) // 6px line spacing
                    .text(line);
            });
        }
    });

    // Initial random colors
    currentColors = stateNames.map(() => Math.floor(Math.random() * COLOR_PALETTE.length));
    bestColors     = [...currentColors];
    currentConflicts = computeConflicts(currentColors);
    bestConflicts    = currentConflicts;

    // Hide loading overlay
    document.getElementById("mapLoadingOverlay").classList.add("hidden");

    renderMapColors();
    updateAllUI();
}

// ── Apply current colors to SVG paths ──
function renderMapColors() {
    const conflicting = getConflictingIndices(currentColors);
    stateNames.forEach((name, i) => {
        const el = statePathEls[name];
        if (!el) return;
        el.attr("fill", COLOR_PALETTE[currentColors[i] % COLOR_PALETTE.length]);
        el.classed("conflict-state", conflicting.has(i));
    });
}

// ═══════════════════════════════════════════════════════════════
//  UI UPDATE (same as original)
// ═══════════════════════════════════════════════════════════════
function updateAllUI() {
    document.getElementById("conflictsValue").innerText  = currentConflicts;
    document.getElementById("tempValue").innerText       = temperature.toFixed(2);
    document.getElementById("colorsUsedValue").innerText = new Set(currentColors).size;
    document.getElementById("bestConflictSpan").innerText =
        bestConflicts === Infinity ? "—" : bestConflicts;

    const conflictSpan = document.getElementById("conflictsValue");
    conflictSpan.classList.add("conflict-update");
    setTimeout(() => conflictSpan.classList.remove("conflict-update"), 300);
}

function recordToGraph() {
    tempHistory.push(temperature);
    conflictHistory.push(currentConflicts);
    if (tempHistory.length > MAX_HISTORY) { tempHistory.shift(); conflictHistory.shift(); }
    updateChart();
}

// ═══════════════════════════════════════════════════════════════
//  SIMULATED ANNEALING (original logic, unchanged)
// ═══════════════════════════════════════════════════════════════
function performAnnealingStep() {
    if (!annealingActive) return;

    const newColors    = [...currentColors];
    const randomRegion = Math.floor(Math.random() * stateNames.length);
    const newColor     = Math.floor(Math.random() * COLOR_PALETTE.length);
    newColors[randomRegion] = newColor;

    const newConflicts = computeConflicts(newColors);
    const delta        = newConflicts - currentConflicts;

    let accept = false;
    if (delta < 0) {
        accept = true;
    } else {
        const probability = Math.exp(-delta / temperature);
        if (Math.random() < probability) accept = true;
    }

    if (accept) {
        currentColors    = newColors;
        currentConflicts = newConflicts;
        if (currentConflicts < bestConflicts) {
            bestConflicts = currentConflicts;
            bestColors    = [...currentColors];
        }
    }

    temperature = Math.max(temperature * COOLING_RATE, 0.01);

    updateAllUI();
    renderMapColors();   // ← renders D3 SVG (replaces drawMap())
    recordToGraph();

    // Check convergence
    if (currentConflicts === 0 && temperature < 1.5) {
        if (annealingActive) {
            annealingActive = false;
            if (animationTimer) clearTimeout(animationTimer);
            animationTimer = null;
            const startBtn = document.getElementById("startAnnealingBtn");
            startBtn.innerHTML = '<i class="fas fa-check-circle"></i> Optimal!';
            setTimeout(() => {
                startBtn.innerHTML = '<i class="fas fa-play"></i> Start Annealing';
            }, 1500);
        }
        return;
    }

    if (annealingActive) {
        animationTimer = setTimeout(performAnnealingStep, animationSpeedMs);
    }
}

function startAnnealing() {
    if (annealingActive) { stopAnnealing(); return; }
    temperature    = INIT_TEMP;
    annealingActive = true;
    if (animationTimer) clearTimeout(animationTimer);
    document.getElementById("startAnnealingBtn").innerHTML =
        '<i class="fas fa-spinner fa-pulse"></i> Annealing...';
    performAnnealingStep();
}

function stopAnnealing() {
    if (animationTimer) { clearTimeout(animationTimer); animationTimer = null; }
    annealingActive = false;
    document.getElementById("startAnnealingBtn").innerHTML =
        '<i class="fas fa-play"></i> Start Annealing';
}

function resetRandomColors() {
    if (annealingActive) stopAnnealing();

    currentColors = stateNames.map(() => Math.floor(Math.random() * COLOR_PALETTE.length));
    currentConflicts = computeConflicts(currentColors);
    bestConflicts    = currentConflicts;
    bestColors       = [...currentColors];
    temperature      = INIT_TEMP;

    tempHistory     = [];
    conflictHistory = [];
    recordToGraph();
    updateAllUI();
    renderMapColors();

    document.getElementById("bestConflictSpan").innerText = bestConflicts;
}

// ═══════════════════════════════════════════════════════════════
//  CHART (original logic, unchanged)
// ═══════════════════════════════════════════════════════════════
let chart;

function initChart() {
    const chartCtx = document.getElementById("tempChartCanvas").getContext("2d");
    chart = new Chart(chartCtx, {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Temperature (T)",
                    data: [],
                    borderColor: "#ff9f4a",
                    backgroundColor: "rgba(255,159,74,0.1)",
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    pointRadius: 2,
                    pointBackgroundColor: "#ffb347",
                    yAxisID: "y"
                },
                {
                    label: "Conflicts",
                    data: [],
                    borderColor: "#5bc0ff",
                    backgroundColor: "rgba(91,192,255,0.05)",
                    borderWidth: 2.5,
                    tension: 0.2,
                    fill: false,
                    pointRadius: 2,
                    pointBackgroundColor: "#88ddff",
                    yAxisID: "y1"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { labels: { color: "#f3e5c9", font: { size: 11 } } },
                tooltip: { mode: "index", intersect: false }
            },
            scales: {
                y: {
                    title: { display: true, text: "Temperature", color: "#ffbc6e", font: { size: 10 } },
                    grid:  { color: "#3e6b7c" },
                    ticks: { color: "#ffe0b5" }
                },
                y1: {
                    position: "right",
                    title: { display: true, text: "Conflicts", color: "#7fc9ff", font: { size: 10 } },
                    grid:  { drawOnChartArea: false },
                    ticks: { color: "#b8e1ff" }
                },
                x: {
                    title: { display: true, text: "Iterations (recent)", color: "#dddddd" },
                    ticks: { color: "#cfcfcf" }
                }
            }
        }
    });
}

function updateChart() {
    if (!chart) return;
    const labels = tempHistory.map((_, idx) => idx + 1);
    chart.data.labels              = labels;
    chart.data.datasets[0].data   = [...tempHistory];
    chart.data.datasets[1].data   = [...conflictHistory];
    chart.update("none");
}

// ═══════════════════════════════════════════════════════════════
//  THEME TOGGLE (original logic, unchanged)
// ═══════════════════════════════════════════════════════════════
function getSavedTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function updateThemeButton() {
    const btn     = document.getElementById("themeToggleBtn");
    if (!btn) return;
    const isLight = document.body.classList.contains("light-theme");
    btn.innerHTML = isLight
        ? '<i class="fas fa-moon"></i> Dark Mode'
        : '<i class="fas fa-sun"></i> Light Mode';
}

function updateChartTheme() {
    if (!chart) return;
    const isLight  = document.body.classList.contains("light-theme");
    const textColor = isLight ? "#1f2a3d" : "#f3e5c9";
    const gridColor = isLight ? "rgba(31,50,79,0.15)" : "#3e6b7c";

    chart.options.plugins.legend.labels.color  = textColor;
    chart.options.scales.y.title.color  = isLight ? "#1565c0" : "#ffbc6e";
    chart.options.scales.y.ticks.color  = textColor;
    chart.options.scales.y.grid.color   = gridColor;
    chart.options.scales.y1.title.color = isLight ? "#1976d2" : "#7fc9ff";
    chart.options.scales.y1.ticks.color = textColor;
    chart.options.scales.x.title.color  = textColor;
    chart.options.scales.x.ticks.color  = textColor;
    chart.update("none");
}

function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("theme", theme);
    updateThemeButton();
    updateChartTheme();
    // Update label fill color to remain readable in both themes
    d3.selectAll(".state-label")
      .attr("fill", theme === "light" ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.80)");
}

function toggleTheme() {
    const next = document.body.classList.contains("light-theme") ? "dark" : "light";
    applyTheme(next);
}

// ═══════════════════════════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════
function setupEventListeners() {
    document.getElementById("startAnnealingBtn").addEventListener("click", () => {
        annealingActive ? stopAnnealing() : startAnnealing();
    });

    document.getElementById("resetColorsBtn").addEventListener("click", () => {
        if (annealingActive) stopAnnealing();
        resetRandomColors();
    });

    document.getElementById("speedSlider").addEventListener("input", (e) => {
        animationSpeedMs = parseInt(e.target.value);
        document.getElementById("speedDisplay").innerText = animationSpeedMs + " ms";
        if (annealingActive) {
            if (animationTimer) clearTimeout(animationTimer);
            performAnnealingStep();
        }
    });

    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
async function init() {
    applyTheme(getSavedTheme());
    initChart();
    setupEventListeners();
    updateChartTheme();

    try {
        await loadMap();
        recordToGraph();
    } catch (err) {
        document.getElementById("mapLoadingOverlay").innerHTML =
            `<span style="color:#ff4757">⚠ Failed to load map: ${err.message}.<br>
             Check your internet connection and refresh.</span>`;
    }
}

init();