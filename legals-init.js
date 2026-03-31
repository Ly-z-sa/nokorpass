/* 
  Cinemart Premium Cookie Consent 
  A high-end, glassmorphic banner for data privacy awareness.
*/

(function() {
  console.log("Cinemart Cookie Consent initializing...");
  try {
    if (localStorage.getItem('cinemart-cookie-consent')) {
      console.log("Cookie consent already given.");
      return;
    }
  } catch (e) {
    console.warn("Storage access denied. Showing banner but preferences won't persist.");
  }

  const style = document.createElement('style');
  style.textContent = `
    .cookie-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      z-index: 9999;
      width: calc(100% - 48px);
      max-width: 900px;
      background: rgba(26, 26, 26, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 14px 32px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
      opacity: 0;
    }

    .cookie-banner.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    .cookie-content h4 {
      font-family: 'Syne', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }

    .cookie-content p {
      font-size: 0.85rem;
      color: #b0b0b8;
      line-height: 1.5;
    }

    .cookie-content a {
      color: #e8490f;
      text-decoration: none;
      font-weight: 600;
    }

    .cookie-content a:hover {
      text-decoration: underline;
    }

    .cookie-btns {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
    }

    .cookie-btn {
      background: #e8490f;
      color: #fff;
      border: 1px solid #e8490f;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .cookie-btn.secondary {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .cookie-btn:hover {
      background: #ff5511;
      border-color: #ff5511;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(232, 73, 15, 0.3);
    }

    .cookie-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: none;
    }

    @media (max-width: 600px) {
      .cookie-banner {
        flex-direction: column;
        text-align: center;
        padding: 24px;
        bottom: 16px;
      }
      .cookie-btns {
        width: 100%;
        flex-direction: column;
      }
      .cookie-btn {
        width: 100%;
      }
    }
  `;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-content">
      <h4>Cookies & Privacy</h4>
      <p>We use essential cookies to provide a secure login. Do you accept our <a href="privacy.html">Privacy Policy</a>?</p>
    </div>
    <div class="cookie-btns">
      <button class="cookie-btn secondary" id="rejectCookies">No, Thanks</button>
      <button class="cookie-btn" id="acceptCookies">Accept All</button>
    </div>
  `;

  document.head.appendChild(style);
  document.body.appendChild(banner);

  // Tiny delay for the slide-up animation
  setTimeout(() => banner.classList.add('show'), 1000);

  const closeBanner = (status) => {
    localStorage.setItem('cinemart-cookie-consent', status);
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 600);
  };

  document.getElementById('acceptCookies').addEventListener('click', () => closeBanner('true'));
  document.getElementById('rejectCookies').addEventListener('click', () => closeBanner('false'));
})();
