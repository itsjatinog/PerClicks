(function() {
    // Obfuscated configuration (Base64)
    const _0x1 = "aHR0cHM6Ly9wZXJjbGlja3M0LWRlZmF1bHQtcnRkYi5maXJlYmFzZWlvLmNvbQ=="; // Firebase URL
    const _0x2 = "aHR0cHM6Ly9zaHJpbmttZS5pby9yZWYvMTAxNDc5NjUyMjQ0MTA0OTE4MjQ0"; // Target URL
    
    const d = (s) => atob(s);
    const DB = d(_0x1);
    const TG = d(_0x2);

    const root = document.getElementById('perclicks-ad-unit');
    if (!root) return;

    const sid = root.getAttribute('data-site-id');
    const uid = root.getAttribute('data-owner-uid');

    // Injecting the ad with a unique ID every time to prevent bot targeting
    const rid = "pc_" + Math.random().toString(36).substring(7);
    root.innerHTML = `<div id="${rid}"><a href="${TG}" id="cl-trig"><img src="https://shrinkme.io/banners/ref/728x90GIF.gif" style="width:100%;border-radius:5px;"></a></div>`;

    document.getElementById('cl-trig').addEventListener('click', async function(e) {
        e.preventDefault();
        const b = e.currentTarget;
        b.style.opacity = "0.4";
        b.style.pointerEvents = "none";

        try {
            // Fetch status check with a 'Cache-Buster' to prevent repeat fake data
            const sCheck = await fetch(`${DB}/all_websites/${sid}.json?cb=${Date.now()}`);
            const sData = await sCheck.json();

            if (sData && sData.status === "active") {
                const uCheck = await fetch(`${DB}/users/${uid}.json`);
                const uData = await uCheck.json();

                // Payload construction
                const p = {
                    [`/all_websites/${sid}/clicks`]: (sData.clicks || 0) + 1,
                    [`/users/${uid}/balance`]: (uData.balance || 0) + 0.15,
                    [`/users/${uid}/today_earnings`]: (uData.today_earnings || 0) + 0.15
                };

                // Secure PATCH
                await fetch(`${DB}/.json`, {
                    method: 'PATCH',
                    body: JSON.stringify(p)
                });
            }
        } catch (f) {} finally {
            window.location.href = TG;
        }
    });
})();
