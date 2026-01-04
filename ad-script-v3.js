(function() {
    const root = document.getElementById('perclicks-ad-unit');
    if (!root) return;

    const sid = root.getAttribute('data-site-id');
    const uid = root.getAttribute('data-owner-uid');
    
    // YOUR WEBSITE REDIRECT PAGE URL
    const REDIRECT_PAGE = "https://perclicks.xo.je/process-click.html";

    root.innerHTML = `
        <div style="width:100%; display:flex; justify-content:center; background:#f9f9f9; border-radius:8px; border:1px solid #ddd; overflow:hidden;">
            <a href="${REDIRECT_PAGE}?sid=${sid}&uid=${uid}" style="width:100%; display:block; line-height:0;">
                <img src="https://shrinkme.io/banners/ref/728x90GIF.gif" 
                     style="width:100%; height:auto; max-height:90px; object-fit:contain; display:block; margin:0 auto;">
            </a>
        </div>
    `;
})();
