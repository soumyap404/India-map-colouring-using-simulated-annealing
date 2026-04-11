
(function buildChakra() {
    const g = document.getElementById('chakraSpokes');
    if (!g) return;
    const cx = 100, cy = 100, outerR = 88, innerR = 28;
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * 2 * Math.PI;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (cx + innerR * Math.cos(angle)).toFixed(2));
        line.setAttribute('y1', (cy + innerR * Math.sin(angle)).toFixed(2));
        line.setAttribute('x2', (cx + outerR * Math.cos(angle)).toFixed(2));
        line.setAttribute('y2', (cy + outerR * Math.sin(angle)).toFixed(2));
        line.setAttribute('stroke', 'rgba(0,0,180,0.12)');
        line.setAttribute('stroke-width', '0.8');
        g.appendChild(line);
    }
    const hub = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hub.setAttribute('cx', cx); hub.setAttribute('cy', cy); hub.setAttribute('r', 4);
    hub.setAttribute('fill', 'rgba(0,0,180,0.15)');
    g.appendChild(hub);
})();


(function spawnEmblems() {
    const layer = document.getElementById('emblemsLayer');
    if (!layer) return;
    const texts = [
        'BHARAT','भारत','JAI HIND','जय हिंद','सत्यमेव जयते',
        'INDIA','UNITY IN DIVERSITY','वन्दे मातरम्','VANDE MATARAM',
        '★ ★ ★','INCREDIBLE INDIA','ALGORITHM','MAP COLORING'
    ];
    for (let i = 0; i < 18; i++) {
        const el = document.createElement('div');
        el.className = 'float-emblem';
        el.textContent = texts[i % texts.length];
        const rot = (Math.random() - 0.5) * 18;
        el.style.cssText = `
            left:${3 + Math.random() * 94}%;
            --rot:${rot}deg;
            animation-duration:${13 + Math.random() * 20}s;
            animation-delay:${-Math.random() * 28}s;
            font-size:${0.42 + Math.random() * 0.32}rem;
        `;
        layer.appendChild(el);
    }
})();


(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLORS = [
        'rgba(255,153,51,','rgba(255,215,0,','rgba(19,136,8,',
        'rgba(0,200,255,', 'rgba(255,255,255,','rgba(0,0,180,'
    ];
    let W, H, particles = [];
    const COUNT = 85;

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * W, y: Math.random() * H,
            r: 0.5 + Math.random() * 2,
            vx: (Math.random() - 0.5) * 0.32, vy: (Math.random() - 0.5) * 0.32,
            alpha: 0.1 + Math.random() * 0.5,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.012 + Math.random() * 0.022,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + (p.alpha * (0.6 + 0.4 * Math.sin(p.pulse))) + ')';
            ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,153,51,${(1 - d / 100) * 0.07})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        if (document.getElementById('splashScreen') &&
            !document.getElementById('splashScreen').classList.contains('splash-exit')) {
            requestAnimationFrame(draw);
        }
    }
    draw();
})();


function animateCounters() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        let cur = 0;
        const step = Math.max(1, Math.floor(target / 28));
        const iv = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = cur;
            if (cur >= target) clearInterval(iv);
        }, 45);
    });
}
setTimeout(animateCounters, 1300);

/* 1e. Button ripple */
document.getElementById('startBtn').addEventListener('mousedown', function(e) {
    const ripple = document.getElementById('btnRipple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 0.6;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    ripple.classList.remove('ripple-anim');
    void ripple.offsetWidth;
    ripple.classList.add('ripple-anim');
});


(function cursorTrail() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:5;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const COLS = ['#FF9933','#ffffff','#138808','#FFD700'];
    const trail = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', e => {
        for (let i = 0; i < 3; i++) {
            trail.push({
                x: e.clientX + (Math.random()-0.5)*6,
                y: e.clientY + (Math.random()-0.5)*6,
                r: 1 + Math.random()*2, life: 1.0,
                color: COLS[Math.floor(Math.random()*COLS.length)]
            });
        }
    });
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = trail.length - 1; i >= 0; i--) {
            const p = trail[i]; p.life -= 0.04;
            if (p.life <= 0) { trail.splice(i, 1); continue; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(p.life * 180).toString(16).padStart(2, '0');
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    draw();
})();


function launchFireworks() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;';
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const FW_COLORS = ['#FF9933','#ffffff','#138808','#FFD700','#00c8ff'];
    const bursts = [];

    function makeBurst(x, y) {
        const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
        const pts = [];
        for (let i = 0; i < 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const speed = 2.5 + Math.random() * 4;
            pts.push({ x, y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life:1.0, r:2+Math.random()*2.5, color });
        }
        bursts.push(pts);
    }

    [[0.2,0.3],[0.8,0.25],[0.5,0.18],[0.15,0.6],[0.85,0.55]].forEach(([rx,ry],i) => {
        setTimeout(() => makeBurst(canvas.width*rx, canvas.height*ry), i*80);
    });

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let allDead = true;
        bursts.forEach(pts => pts.forEach(p => {
            if (p.life <= 0) return;
            allDead = false;
            p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.vx *= 0.97; p.life -= 0.018;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color + Math.floor(p.life*255).toString(16).padStart(2,'0');
            ctx.fill();
        }));
        if (!allDead && ++frame < 200) requestAnimationFrame(animate);
        else document.body.removeChild(canvas);
    }
    requestAnimationFrame(animate);
}

function launchDashboard() {
    const btn = document.getElementById('startBtn');
    if (btn.dataset.launching) return;
    btn.dataset.launching = '1';
    btn.querySelector('.btn-label').textContent = 'Launching…';

    launchFireworks();

    setTimeout(() => {
        document.getElementById('splashScreen').classList.add('splash-exit');
    }, 350);

    setTimeout(() => {
        // Hide splash, reveal dashboard
        document.getElementById('splashScreen').style.display = 'none';
        const dash = document.getElementById('dashboardScreen');
        dash.style.display = 'block';
        document.body.style.background = 'var(--bg, #020408)';
        // Initialise dashboard
        initDashboard();
    }, 1100);
}


document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') &&
        document.getElementById('splashScreen').style.display !== 'none') {
        e.preventDefault();
        launchDashboard();
    }
});


function backToIntro() {
    if (annealingActive) stopAnnealing();
    document.getElementById('dashboardScreen').style.display = 'none';
    const splash = document.getElementById('splashScreen');
    splash.style.display = 'flex';
    splash.classList.remove('splash-exit');
    // Reset launch guard so button works again
    const btn = document.getElementById('startBtn');
    delete btn.dataset.launching;
    btn.querySelector('.btn-label').textContent = 'Explore Visualization';
}



const GEO_URL = "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson";

const COLOR_PALETTE = [
    "#e63946","#457b9d","#2a9d8f","#e9c46a",
    "#b5838d","#6d6875","#f4a261","#90be6d"
];

const SHORT_NAMES = {
    "Andaman & Nicobar Island":"A&N Is.","Andhra Pradesh":"Andhra\nPradesh",
    "Arunachal Pradesh":"Arunachal\nPradesh","Assam":"Assam","Bihar":"Bihar",
    "Chandigarh":"Chd.","Chhattisgarh":"Chhattisgarh","Dadra and Nagar Haveli":"DNH",
    "Daman and Diu":"D&D","Delhi":"Delhi","Goa":"Goa","Gujarat":"Gujarat",
    "Haryana":"Haryana","Himachal Pradesh":"Himachal\nPradesh","Jammu & Kashmir":"J&K",
    "Jharkhand":"Jharkhand","Karnataka":"Karnataka","Kerala":"Kerala","Ladakh":"Ladakh",
    "Lakshadweep":"Lkshd.","Madhya Pradesh":"Madhya\nPradesh","Maharashtra":"Maharashtra",
    "Manipur":"Manipur","Meghalaya":"Meghalaya","Mizoram":"Mizoram","Nagaland":"Nagaland",
    "Odisha":"Odisha","Puducherry":"Puduch.","Punjab":"Punjab","Rajasthan":"Rajasthan",
    "Sikkim":"Sikkim","Tamil Nadu":"Tamil\nNadu","Telangana":"Telangana","Tripura":"Tripura",
    "Uttar Pradesh":"Uttar\nPradesh","Uttarakhand":"Uttara\nkhand","West Bengal":"West\nBengal"
};

const ADJ_NAMES = {
    "Andaman & Nicobar Island":[],
    "Andhra Pradesh":["Karnataka","Telangana","Chhattisgarh","Odisha","Tamil Nadu"],
    "Arunachal Pradesh":["Assam","Nagaland"],
    "Assam":["Arunachal Pradesh","Nagaland","Manipur","Mizoram","Tripura","Meghalaya","West Bengal","Sikkim"],
    "Bihar":["Uttar Pradesh","Jharkhand","West Bengal"],
    "Chandigarh":["Punjab","Haryana"],
    "Chhattisgarh":["Madhya Pradesh","Uttar Pradesh","Jharkhand","Odisha","Andhra Pradesh","Telangana","Maharashtra"],
    "Dadra and Nagar Haveli":["Gujarat","Maharashtra"],
    "Daman and Diu":["Gujarat"],
    "Delhi":["Haryana","Uttar Pradesh","Rajasthan"],
    "Goa":["Karnataka","Maharashtra"],
    "Gujarat":["Rajasthan","Madhya Pradesh","Maharashtra","Dadra and Nagar Haveli","Daman and Diu"],
    "Haryana":["Punjab","Himachal Pradesh","Uttar Pradesh","Rajasthan","Delhi","Chandigarh"],
    "Himachal Pradesh":["Punjab","Haryana","Uttar Pradesh","Uttarakhand","Jammu & Kashmir"],
    "Jammu & Kashmir":["Himachal Pradesh","Punjab","Ladakh"],
    "Jharkhand":["Bihar","West Bengal","Odisha","Chhattisgarh","Uttar Pradesh"],
    "Karnataka":["Goa","Maharashtra","Andhra Pradesh","Telangana","Kerala","Tamil Nadu"],
    "Kerala":["Karnataka","Tamil Nadu"],
    "Ladakh":["Jammu & Kashmir"],
    "Lakshadweep":[],
    "Madhya Pradesh":["Rajasthan","Uttar Pradesh","Chhattisgarh","Maharashtra","Gujarat"],
    "Maharashtra":["Gujarat","Madhya Pradesh","Chhattisgarh","Telangana","Andhra Pradesh","Karnataka","Goa","Dadra and Nagar Haveli"],
    "Manipur":["Assam","Nagaland","Mizoram"],
    "Meghalaya":["Assam"],
    "Mizoram":["Assam","Manipur","Tripura"],
    "Nagaland":["Assam","Arunachal Pradesh","Manipur"],
    "Odisha":["West Bengal","Jharkhand","Chhattisgarh","Andhra Pradesh"],
    "Puducherry":["Tamil Nadu"],
    "Punjab":["Haryana","Himachal Pradesh","Rajasthan","Chandigarh","Jammu & Kashmir"],
    "Rajasthan":["Punjab","Haryana","Uttar Pradesh","Madhya Pradesh","Gujarat","Delhi"],
    "Sikkim":["West Bengal"],
    "Tamil Nadu":["Kerala","Karnataka","Andhra Pradesh","Puducherry"],
    "Telangana":["Maharashtra","Chhattisgarh","Andhra Pradesh","Karnataka"],
    "Tripura":["Assam","Mizoram"],
    "Uttar Pradesh":["Uttarakhand","Himachal Pradesh","Haryana","Delhi","Rajasthan","Madhya Pradesh","Chhattisgarh","Bihar","Jharkhand"],
    "Uttarakhand":["Himachal Pradesh","Uttar Pradesh"],
    "West Bengal":["Sikkim","Jharkhand","Bihar","Odisha","Assam"]
};

let stateNames = [], nameToIdx = {}, adjIdx = [], statePathEls = {};
let currentColors = [], bestColors = [], bestConflicts = Infinity;
let currentConflicts = 0, temperature = 100.0, initTemperature = 100.0;
const COOLING_RATE = 0.985;
let annealingActive = false, animationTimer = null, animationSpeedMs = 45;
let tempHistory = [], conflictHistory = [];
const MAX_HISTORY = 80;
let chart;
let dashboardInitialised = false;

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

async function loadMap() {
    const res = await fetch(GEO_URL);
    const geo = await res.json();
    const svg     = d3.select('#indiaMapSVG');
    const g       = svg.select('#statesGroup');
    const labelsG = svg.select('#labelsGroup');
    const projection = d3.geoMercator().fitSize([560, 650], geo);
    const pathGen    = d3.geoPath().projection(projection);
    const tooltip    = document.getElementById('mapTooltip');

    stateNames = []; nameToIdx = {}; adjIdx = []; statePathEls = {};
    geo.features.forEach(f => stateNames.push(f.properties.ST_NM));
    stateNames.forEach((n, i) => { nameToIdx[n] = i; });
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

    geo.features.forEach(f => {
        const name = f.properties.ST_NM;
        const el = g.append('path')
            .datum(f).attr('d', pathGen)
            .attr('class', 'state-path').attr('data-name', name)
            .on('mousemove', evt => {
                const idx = nameToIdx[name];
                const col = COLOR_PALETTE[currentColors[idx] % COLOR_PALETTE.length];
                tooltip.style.opacity = '1';
                tooltip.style.left = (evt.clientX + 16) + 'px';
                tooltip.style.top  = (evt.clientY - 36) + 'px';
                tooltip.innerHTML =
                    `<strong style="color:#e8f4ff">${name}</strong><br>` +
                    `<span style="display:inline-flex;align-items:center;gap:7px;margin-top:4px;opacity:0.8">` +
                    `<span style="width:8px;height:8px;border-radius:2px;background:${col};display:inline-block"></span>` +
                    `Color ${(currentColors[idx] % COLOR_PALETTE.length) + 1}</span>`;
            })
            .on('mouseleave', () => { tooltip.style.opacity = '0'; });
        statePathEls[name] = el;
    });

    geo.features.forEach(f => {
        const name = f.properties.ST_NM;
        const centroid = pathGen.centroid(f);
        if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return;
        const lines = (SHORT_NAMES[name] || name).split('\n');
        if (lines.length === 1) {
            labelsG.append('text').attr('class','state-label').attr('x',centroid[0]).attr('y',centroid[1]).text(lines[0]);
        } else {
            const t = labelsG.append('text').attr('class','state-label').attr('x',centroid[0]).attr('y',centroid[1]-3);
            lines.forEach((line, li) => t.append('tspan').attr('x',centroid[0]).attr('dy', li === 0 ? 0 : 6).text(line));
        }
    });

    currentColors    = stateNames.map(() => Math.floor(Math.random() * COLOR_PALETTE.length));
    bestColors       = [...currentColors];
    currentConflicts = computeConflicts(currentColors);
    bestConflicts    = currentConflicts;
    temperature      = initTemperature;

    document.getElementById('mapLoadingOverlay').classList.add('hidden');
    renderMapColors();
    updateAllUI();
}

function renderMapColors() {
    const conflicting = getConflictingIndices(currentColors);
    stateNames.forEach((name, i) => {
        const el = statePathEls[name];
        if (!el) return;
        el.attr('fill', COLOR_PALETTE[currentColors[i] % COLOR_PALETTE.length]);
        el.classed('conflict-state', conflicting.has(i));
    });
}

function updateAllUI() {
    document.getElementById('conflictsValue').innerText  = currentConflicts;
    document.getElementById('tempValue').innerText       = temperature.toFixed(2);
    document.getElementById('colorsUsedValue').innerText = new Set(currentColors).size;
    document.getElementById('bestConflictSpan').innerText = bestConflicts === Infinity ? '—' : bestConflicts;
    document.getElementById('initialTempText').innerText  = initTemperature.toFixed(0);
    const cv = document.getElementById('conflictsValue');
    cv.parentElement.classList.add('conflict-update');
    setTimeout(() => cv.parentElement.classList.remove('conflict-update'), 300);
}

function recordToGraph() {
    tempHistory.push(+temperature.toFixed(2));
    conflictHistory.push(currentConflicts);
    if (tempHistory.length > MAX_HISTORY) { tempHistory.shift(); conflictHistory.shift(); }
    updateChart();
}

function performAnnealingStep() {
    if (!annealingActive) return;
    const newColors    = [...currentColors];
    const randomRegion = Math.floor(Math.random() * stateNames.length);
    newColors[randomRegion] = Math.floor(Math.random() * COLOR_PALETTE.length);
    const newConflicts = computeConflicts(newColors);
    const delta = newConflicts - currentConflicts;
    let accept = delta < 0 || Math.random() < Math.exp(-delta / temperature);
    if (accept) {
        currentColors    = newColors;
        currentConflicts = newConflicts;
        if (currentConflicts < bestConflicts) { bestConflicts = currentConflicts; bestColors = [...currentColors]; }
    }
    temperature = Math.max(temperature * COOLING_RATE, 0.01);
    updateAllUI(); renderMapColors(); recordToGraph();

    if (currentConflicts === 0 && temperature < 1.5) {
        annealingActive = false;
        if (animationTimer) { clearTimeout(animationTimer); animationTimer = null; }
        const sb = document.getElementById('startAnnealingBtn');
        sb.innerHTML = '<i class="fas fa-check-circle"></i><span>Optimal!</span>';
        updateAnnealingStatus('optimal');
        setTimeout(() => { sb.innerHTML = '<i class="fas fa-play"></i><span>Start Annealing</span>'; }, 2000);
        return;
    }
    if (annealingActive) animationTimer = setTimeout(performAnnealingStep, animationSpeedMs);
}

function startAnnealing() {
    if (annealingActive) { stopAnnealing(); return; }
    temperature = initTemperature;
    annealingActive = true;
    if (animationTimer) clearTimeout(animationTimer);
    document.getElementById('startAnnealingBtn').innerHTML = '<i class="fas fa-spinner fa-pulse"></i><span>Annealing...</span>';
    updateAnnealingStatus('running');
    performAnnealingStep();
}

function stopAnnealing() {
    if (animationTimer) { clearTimeout(animationTimer); animationTimer = null; }
    annealingActive = false;
    document.getElementById('startAnnealingBtn').innerHTML = '<i class="fas fa-play"></i><span>Start Annealing</span>';
    updateAnnealingStatus('stopped');
}

function updateAnnealingStatus(status) {
    const btn = document.getElementById('annealingStatusBtn');
    if (!btn) return;
    btn.classList.remove('btn-status-running','btn-status-success');
    if (status === 'running')  { btn.classList.add('btn-status-running');  btn.innerHTML = '<i class="fas fa-circle fa-beat"></i><span>Running</span>'; }
    else if (status === 'optimal') { btn.classList.add('btn-status-success'); btn.innerHTML = '<i class="fas fa-check-circle"></i><span>Optimal</span>'; }
    else { btn.innerHTML = '<i class="fas fa-circle"></i><span>Idle</span>'; }
}

function resetRandomColors() {
    if (annealingActive) stopAnnealing();
    currentColors    = stateNames.map(() => Math.floor(Math.random() * COLOR_PALETTE.length));
    currentConflicts = computeConflicts(currentColors);
    bestConflicts    = currentConflicts;
    bestColors       = [...currentColors];
    temperature      = initTemperature;
    tempHistory = []; conflictHistory = [];
    recordToGraph(); updateAllUI(); renderMapColors();
}

function initChart() {
    const ctx = document.getElementById('tempChartCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                { label:'Temperature (T)', data:[], borderColor:'#ff8c00', backgroundColor:'rgba(255,140,0,0.07)', borderWidth:1.8, tension:0.4, fill:true, pointRadius:0, yAxisID:'y' },
                { label:'Conflicts',        data:[], borderColor:'#00c8ff', backgroundColor:'rgba(0,200,255,0.04)', borderWidth:2,   tension:0.3, fill:false,pointRadius:0, yAxisID:'y1' }
            ]
        },
        options: {
            responsive:true, maintainAspectRatio:true, animation:false,
            interaction:{ mode:'index', intersect:false },
            plugins:{
                legend:{ labels:{ color:'#7aafcf', font:{ family:"'JetBrains Mono',monospace", size:10 }, boxWidth:20, boxHeight:2 } },
                tooltip:{ backgroundColor:'rgba(2,10,20,0.92)', borderColor:'rgba(0,200,255,0.3)', borderWidth:1, titleColor:'#00c8ff', bodyColor:'#7aafcf', titleFont:{ family:"'JetBrains Mono',monospace", size:11 }, bodyFont:{ family:"'JetBrains Mono',monospace", size:10 } }
            },
            scales:{
                y:  { title:{ display:true, text:'Temperature', color:'#ff8c00', font:{ family:"'JetBrains Mono',monospace", size:9 } }, grid:{ color:'rgba(0,200,255,0.06)' }, ticks:{ color:'#3a6070', font:{ family:"'JetBrains Mono',monospace", size:9 } } },
                y1: { position:'right', title:{ display:true, text:'Conflicts', color:'#00c8ff', font:{ family:"'JetBrains Mono',monospace", size:9 } }, grid:{ drawOnChartArea:false }, ticks:{ color:'#3a6070', font:{ family:"'JetBrains Mono',monospace", size:9 } } },
                x:  { title:{ display:true, text:'Iterations', color:'#3a6070', font:{ family:"'JetBrains Mono',monospace", size:9 } }, ticks:{ color:'#3a6070', font:{ family:"'JetBrains Mono',monospace", size:9 }, maxTicksLimit:8 } }
            }
        }
    });
}

function updateChart() {
    if (!chart) return;
    chart.data.labels           = tempHistory.map((_,i) => i+1);
    chart.data.datasets[0].data = [...tempHistory];
    chart.data.datasets[1].data = [...conflictHistory];
    chart.update('none');
}

function setupCodeToggle() {
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
            const id = 'panel' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
            const panel = document.getElementById(id);
            if (panel) panel.classList.add('active');
        });
    });
    const copyBtn = document.getElementById('copyCodeBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const el = document.querySelector('.code-panel.active .code-block');
            if (!el) return;
            try {
                await navigator.clipboard.writeText(el.innerText);
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'; copyBtn.classList.remove('copied'); }, 1800);
            } catch { copyBtn.innerHTML = '<i class="fas fa-times"></i> Failed'; setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'; },1500); }
        });
    }
}

function getSavedTheme() {
    const s = localStorage.getItem('theme');
    if (s === 'light' || s === 'dark') return s;
    return window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.innerHTML = theme === 'light'
        ? '<i class="fas fa-moon"></i><span>Dark Mode</span>'
        : '<i class="fas fa-sun"></i><span>Light Mode</span>';
    if (chart) {
        const isLight = theme === 'light';
        const gc = isLight ? 'rgba(0,80,150,0.08)' : 'rgba(0,200,255,0.06)';
        const tc = isLight ? '#5a7890' : '#3a6070';
        chart.options.plugins.legend.labels.color = isLight ? '#2a5070' : '#7aafcf';
        chart.options.scales.y.grid.color  = gc;
        ['y','y1','x'].forEach(ax => chart.options.scales[ax].ticks.color = tc);
        chart.update('none');
    }
    d3.selectAll('.state-label').attr('fill', theme === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)');
}

function setupDashboardEvents() {
    document.getElementById('startAnnealingBtn').addEventListener('click', () => annealingActive ? stopAnnealing() : startAnnealing());
    document.getElementById('resetColorsBtn').addEventListener('click', () => { if (annealingActive) stopAnnealing(); resetRandomColors(); });
    document.getElementById('speedSlider').addEventListener('input', e => {
        animationSpeedMs = parseInt(e.target.value);
        document.getElementById('speedDisplay').innerText = animationSpeedMs + ' ms';
        if (annealingActive) { if (animationTimer) clearTimeout(animationTimer); performAnnealingStep(); }
    });
    document.getElementById('initTempSlider').addEventListener('input', e => {
        initTemperature = parseFloat(e.target.value);
        document.getElementById('initTempDisplay').innerText = initTemperature.toFixed(0);
        document.getElementById('initialTempText').innerText = initTemperature.toFixed(0);
        if (!annealingActive) { temperature = initTemperature; updateAllUI(); }
    });
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', () => {
        const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(next);
    });
}

async function initDashboard() {
    if (dashboardInitialised) return;
    dashboardInitialised = true;

    applyTheme(getSavedTheme());
    initChart();
    setupDashboardEvents();
    setupCodeToggle();

    try {
        await loadMap();
        recordToGraph();
    } catch (err) {
        document.getElementById('mapLoadingOverlay').innerHTML =
            `<span style="color:#ff3355;font-family:'JetBrains Mono',monospace;font-size:0.8rem">
             &#9888; MAP LOAD FAILED: ${err.message}. Check internet and refresh.</span>`;
    }
}
