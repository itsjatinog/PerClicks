(function() {
    const DB_URL = "https://perclicks4-default-rtdb.firebaseio.com";
    const TARGET = "https://shrinkme.io/ref/101479652244104918244";
    
    const root = document.getElementById('perclicks-ad-unit');
    if (!root) return;

    const sid = root.getAttribute('data-site-id');
    const uid = root.getAttribute('data-owner-uid');

    // Security metrics
    let loadTime = Date.now();
    let humanInteraction = false;

    // Detect both Mouse and Touch for mobile compatibility
    const setHuman = () => humanInteraction = true;
    window.addEventListener('mousemove', setHuman, {once: true});
    window.addEventListener('touchstart', setHuman, {once: true});

    // --- HTML: Mobile Responsive Wrapper ---
    root.innerHTML = `
        <div style="width:100%; display:flex; justify-content:center; align-items:center; background:#f9f9f9; border-radius:8px; border:1px solid #ddd; cursor:pointer; overflow:hidden; touch-action: manipulation;">
            <a href="javascript:void(0)" id="cl-trig" style="width:100%; display:block; line-height:0; -webkit-tap-highlight-color: transparent;">
                <img src="https://shrinkme.io/banners/ref/728x90GIF.gif" 
                     style="width:100%; height:auto; max-width:728px; max-height:90px; object-fit:contain; display:block; margin:0 auto;">
            </a>
        </div>
    `;

    async function updateClicks(e) {
        e.preventDefault();
        
        const timeDiff = Date.now() - loadTime;
        const btn = document.getElementById('cl-trig');
        
        // Visual Feedback for Mobile (Touch State)
        btn.style.opacity = "0.5";
        btn.style.pointerEvents = "none";

        // 1. MOBILE BOT CHECK
        // On mobile, interactions happen fast, but we still check for the "HumanInteraction" flag
        const isSuspicious = (timeDiff < 800) || (!humanInteraction);
        
        // 2. SESSION LOCK
        if (sessionStorage.getItem('pc_v_' + sid)) {
            window.location.replace(TARGET);
            return;
        }

        try {
            // 3. DATA UPDATE
            const sRes = await fetch(`${DB_URL}/all_websites/${sid}.json`);
            const sData = await sRes.json();

            if (sData && sData.status === "active" && !isSuspicious) {
                const uRes = await fetch(`${DB_URL}/users/${uid}.json`);
                const uData = await uRes.json();

                const updates = {
                    [`all_websites/${sid}/clicks`]: (sData.clicks || 0) + 1,
                    [`all_websites/${sid}/earned`]: (sData.earned || 0) + 0.15,
                    [`users/${uid}/balance`]: (uData.balance || 0) + 0.15,
                    [`users/${uid}/today_earnings`]: (uData.today_earnings || 0) + 0.15
                };

                await fetch(`${DB_URL}/.json`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });

                sessionStorage.setItem('pc_v_' + sid, 'true');
            }
        } catch (err) {
            console.error("PC-Network-Error");
        } finally {
            // 4. REDIRECT
            window.location.replace(TARGET);
        }
    }

    // Attach to both click and touchend for maximum mobile responsiveness
    const trigger = document.getElementById('cl-trig');
    trigger.addEventListener('click', updateClicks);
})();
