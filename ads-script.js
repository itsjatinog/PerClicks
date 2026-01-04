(function() {
    // Obfuscated configuration (Base64)
    const _0x1 = "aHR0cHM6Ly9wZXJjbGlja3M0LWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbQ=="; // Firebase
    const _0x2 = "aHR0cHM6Ly9zaHJpbmttZS5pby9yZWYvMTAxNDc5NjUyMjQ0MTA0OTE4MjQ0"; // Target
    
    const d = (s) => atob(s);
    const DB = d(_0x1);
    const TG = d(_0x2);

    const root = document.getElementById('perclicks-ad-unit');
    if (!root) return;

    const sid = root.getAttribute('data-site-id');
    const uid = root.getAttribute('data-owner-uid');

    // FIX: Container with Flexbox and Image with object-fit
    root.innerHTML = `
        <div style="width:100%; display:flex; justify-content:center; align-items:center; background:#f9f9f9; border-radius:8px; overflow:hidden; border:1px solid #ddd; margin:10px 0;">
            <a href="${TG}" id="cl-trig" style="width:100%; display:block; line-height:0;">
                <img src="https://shrinkme.io/banners/ref/728x90GIF.gif" 
                     alt="Ad" 
                     style="width:100%; max-height:90px; object-fit:contain; display:block; margin:0 auto;">
            </a>
        </div>
    `;

    document.getElementById('cl-trig').addEventListener('click', async function(e) {
        e.preventDefault();
        const b = e.currentTarget;
        b.style.opacity = "0.5";
        b.style.pointerEvents = "none";

        try {
            const sCheck = await fetch(`${DB}/all_websites/${sid}.json?cb=${Date.now()}`);
            const sData = await sCheck.json();

            if (sData && sData.status === "active") {
                const uCheck = await fetch(`${DB}/users/${uid}.json`);
                const uData = await uCheck.json();

                const p = {
                    [`/all_websites/${sid}/clicks`]: (sData.clicks || 0) + 1,
                    [`/users/${uid}/balance`]: (uData.balance || 0) + 0.15,
                    [`/users/${uid}/today_earnings`]: (uData.today_earnings || 0) + 0.15
                };

                await fetch(`${DB}/.json`, {
                    method: 'PATCH',
                    body: JSON.stringify(p)
                });
            }
        } catch (f) {
            console.error("Track Error");
        } finally {
            window.location.href = TG;
        }
    });
})();
