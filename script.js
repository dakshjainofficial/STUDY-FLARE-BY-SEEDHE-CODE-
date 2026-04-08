/**
 * StudyFlare - Standardized Interactive Engine
 */

const delay = ms => new Promise(res => setTimeout(res, ms));

document.addEventListener("DOMContentLoaded", function() {
    console.log("StudyFlare V2: Unified Engine Initialized");

    // --- AUTH FLOW ---
    const googleBtn = document.getElementById("googleLoginBtn");
    const guestBtn = document.getElementById("guestLoginBtn");

    if (googleBtn) {
        googleBtn.addEventListener("click", async function() {
            this.innerHTML = `<div class="spinner"></div> Signing in...`;
            this.disabled = true;
            await delay(1200);
            localStorage.setItem("userRole", "user");
            window.location.href = "dashboard.html";
        });
    }

    if (guestBtn) {
        guestBtn.addEventListener("click", function() {
            localStorage.setItem("userRole", "guest");
            window.location.href = "dashboard.html";
        });
    }

    // --- DASHBOARD LOGIC ---
    if (window.location.pathname.includes("dashboard.html")) {
        initDashboard();
    }

    // --- ROOM LOGIC ---
    if (window.location.pathname.includes("room.html")) {
        initRoom();
    }

    // Trigger Animations
    document.querySelectorAll('.animate-on-load').forEach((el, i) => {
        setTimeout(() => el.style.opacity = "1", i * 150);
    });
});

function initDashboard() {
    const role = localStorage.getItem("userRole") || "guest";
    const isGuest = role === "guest";
    
    const badge = document.getElementById("authStateBadge");
    if (badge) {
        badge.innerText = isGuest ? "Guest Access" : "Pro member";
        badge.className = isGuest ? "flare-tag tag-guest" : "flare-tag tag-live";
    }

    // AI Solver
    const askBtn = document.getElementById("askAiBtn");
    const input = document.getElementById("aiDoubtInput");
    const resContainer = document.getElementById("aiResponseContainer");
    const resText = document.getElementById("aiResponseText");

    if (askBtn) {
        askBtn.onclick = async () => {
            const query = input.value;
            if (!query) return;
            
            resContainer.classList.remove("hidden");
            resText.innerHTML = "<em>Analyzing logic...</em>";
            await delay(1500);
            
            resText.innerHTML = `<strong>StudyFlare AI Insight:</strong> Your query regarding "${query}" suggests a focus on fundamental principles. I recommend a deeper dive into the core derivation to solidify the concept. Escalating to a human student is recommended if clarity is needed.`;
            input.value = "";
        };
    }

    // Navigation and Feed
    renderFeed(isGuest);
}

function renderFeed(isGuest) {
    const grid = document.getElementById("doubtsGrid");
    if (!grid) return;
    const doubts = [
        { topic: 'Thermodynamics', desc: 'Can someone explain entropy in simple terms?', user: 'Alice' },
        { topic: 'Calculus', desc: 'Struggling with Chain Rule application.', user: 'Bob' }
    ];
    grid.innerHTML = doubts.map(d => `
        <div class="flare-card animate-on-load" style="border-left: 4px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                     <span class="flare-tag tag-live" style="background: rgba(255,59,59,0.1); color: var(--primary);">${d.topic}</span>
                     <h4 style="margin-top: 10px;">${d.topic} Doubt</h4>
                     <p style="margin-top: 5px;">${d.desc}</p>
                </div>
                <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" 
                    onclick="${isGuest ? "alert('Login required to solve!')" : "alert('Connecting to session...')"}">Solve Now</button>
            </div>
            <div style="margin-top: 20px; font-size: 0.75rem; color: var(--text-sub);">👤 Posted by ${d.user}</div>
        </div>
    `).join('');
}

function initRoom() {
    const sendBtn = document.getElementById("sendChatBtn");
    const input = document.getElementById("chatInput");
    const chat = document.getElementById("chatMessages");

    if (sendBtn) {
        sendBtn.onclick = () => {
            const val = input.value;
            if (!val) return;
            const msg = document.createElement("div");
            msg.className = "message msg-user";
            msg.innerText = val;
            chat.appendChild(msg);
            input.value = "";
            chat.scrollTop = chat.scrollHeight;

            // Auto reply
            setTimeout(() => {
                const reply = document.createElement("div");
                reply.className = "message msg-others";
                reply.innerText = "Friend: Got it! Let's solve this together.";
                chat.appendChild(reply);
                chat.scrollTop = chat.scrollHeight;
            }, 1000);
        };
    }
}

function startTimer(btn) {
    let timeLeft = 25 * 60;
    btn.innerText = "Studying...";
    const display = document.getElementById("timerValue");
    setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            display.innerText = `${m}:${s}`;
        }
    }, 1000);
}
