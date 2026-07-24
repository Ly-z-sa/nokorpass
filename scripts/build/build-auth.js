const fs = require('fs');
const path = require('path');


const css = `
    ::-webkit-scrollbar { display: none; }
    html { scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none; }
    html::-webkit-scrollbar { display: none; }

    body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--text); line-height: 1.6; overflow: hidden; height: 100vh; display: flex; margin: 0; }
    
    /* ── Split Layout ── */
    .auth-visual { flex: 1.2; background: url('../../assets/auth-bg.png') center/cover no-repeat; position: relative; display: flex; align-items: flex-end; padding: 48px; }
    .auth-visual::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, transparent 100%); }
    .auth-visual-content { position: relative; z-index: 2; max-width: 520px; }
    .auth-visual-content h1 { font-family: 'Syne', sans-serif; font-size: 2.8rem; font-weight: 800; color: #fff; line-height: 1.1; margin-bottom: 12px; }
    .auth-visual-content p { color: rgba(255,255,255,0.65); font-size: 1rem; line-height: 1.6; }
    .auth-visual-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(232,73,15,0.15); border: 1px solid rgba(232,73,15,0.35); color: var(--accent); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; margin-bottom: 18px; }

    /* ── Form Side ── */
    .auth-form-side { flex: 0.8; display: flex; align-items: center; justify-content: center; padding: 32px; background: var(--black); position: relative; overflow-y: auto; }
    
    .auth-container { max-width: 400px; width: 100%; }

    /* ── Brand Mark ── */
    .auth-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; text-decoration: none; }
    .auth-brand img { height: 30px; width: auto; display: block; }
    .auth-brand-name { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #fff; letter-spacing: 0.02em; }

    /* ── Titles ── */
    .auth-title { font-family: 'DM Sans', sans-serif; font-size: 1.6rem; font-weight: 700; color: var(--white); margin: 0 0 6px; letter-spacing: -0.4px; }
    .auth-subtitle { color: var(--muted); font-size: 0.85rem; margin: 0 0 24px; }

    /* ── Error ── */
    .error-msg { color: #ff4b4b; background: rgba(255, 75, 75, 0.08); padding: 10px 14px; border-radius: 8px; font-size: 0.8rem; display: none; text-align: center; margin-bottom: 14px; border: 1px solid rgba(255, 75, 75, 0.2); }

    /* ── Form ── */
    .auth-form { display: flex; flex-direction: column; gap: 10px; }
    .input-group { display: flex; flex-direction: column; gap: 4px; }
    .input-group label { font-size: 0.75rem; font-weight: 600; color: var(--muted); letter-spacing: 0.02em; }
    .input-group input {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 9px;
      padding: 10px 12px;
      color: #fff;
      font-size: 0.875rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
      width: 100%;
      box-sizing: border-box;
    }
    .input-group input:focus { border-color: var(--accent); background: rgba(232,73,15,0.04); box-shadow: 0 0 0 3px rgba(232, 73, 15, 0.1); }
    .input-group input::placeholder { color: rgba(255,255,255,0.2); }

    /* ── Buttons ── */
    .btn-auth { background: var(--accent); color: #fff; border: none; padding: 11px 16px; border-radius: 9px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; font-family: 'DM Sans', sans-serif; width: 100%; letter-spacing: 0.01em; }
    .btn-auth:hover { filter: brightness(1.1); box-shadow: 0 8px 24px rgba(232, 73, 15, 0.35); transform: translateY(-1px); }
    .btn-auth:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

    .btn-google { background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 10px 16px; border-radius: 9px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; width: 100%; font-size: 0.875rem; font-family: 'DM Sans', sans-serif; }
    .btn-google img { height: 18px; }
    .btn-google:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

    /* ── Divider ── */
    .divider { display: flex; align-items: center; text-align: center; color: var(--muted); margin: 4px 0; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; }
    .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid var(--border); }
    .divider::before { margin-right: 14px; }
    .divider::after { margin-left: 14px; }

    /* ── Toggle ── */
    .toggle-auth { text-align: center; font-size: 0.8rem; color: var(--muted); margin-top: 14px; }
    .toggle-auth a { color: var(--accent); font-weight: 700; text-decoration: none; margin-left: 4px; }
    .toggle-auth a:hover { text-decoration: underline; }

    /* ── TOS note ── */
    .tos-note { font-size: 0.7rem; color: rgba(255,255,255,0.3); margin-top: 2px; text-align: center; line-height: 1.5; }
    .tos-note a { color: rgba(255,255,255,0.45); text-decoration: none; font-weight: 600; }
    .tos-note a:hover { color: var(--accent); }

    /* ── Password Rules ── */
    .password-requirements { margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
    .pw-rule { font-size: 0.7rem; color: var(--muted); display: flex; align-items: center; gap: 5px; transition: color 0.2s; }
    .pw-rule::before { content: '○'; font-size: 0.75rem; }
    .pw-rule.met { color: #4caf50; }
    .pw-rule.met::before { content: '●'; }

    /* ── Verification Overlay ── */
    .verification-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 5000; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; backdrop-filter: blur(12px); }
    .verification-card { max-width: 420px; }
    .verification-card h2 { font-family: 'Syne', sans-serif; font-size: 1.75rem; color: #fff; margin-bottom: 12px; }
    .verification-card p { color: var(--muted); font-size: 0.9rem; margin-bottom: 28px; line-height: 1.65; }
    .spinner { width: 48px; height: 48px; border: 3px solid rgba(255,255,255,0.08); border-top-color: var(--accent); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 24px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .btn-ghost-sm { background: rgba(255,255,255,0.06); color: var(--text); border: 1px solid var(--border); padding: 9px 20px; border-radius: 8px; cursor: pointer; font-size: 0.82rem; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
    .btn-ghost-sm:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); }
    .verification-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }

    @media (max-width: 1024px) {
      .auth-visual { display: none; }
      .auth-form-side { flex: 1; padding: 20px; }
      body { overflow-y: auto; height: auto; }
    }
`;

const js = `
    import { auth } from './js/firebase-config.js';
    import { 
      createUserWithEmailAndPassword, 
      signInWithEmailAndPassword, 
      GoogleAuthProvider, 
      signInWithPopup, 
      sendEmailVerification, 
      signOut,
      onAuthStateChanged 
    } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const errorMsg = document.getElementById('errorMsg');
    const verificationOverlay = document.getElementById('verificationOverlay');

    // ── Turnstile state ──
    let turnstileVerified = false;
    let turnstileWidgetId = null;

    function renderTurnstile() {
      if (window.turnstile && turnstileWidgetId === null) {
        turnstileWidgetId = window.turnstile.render('#turnstile-container', {
          sitekey: '0x4AAAAAAD2hL95dUBV9_63T',
          theme: 'dark',
          callback: function(token) {
            turnstileVerified = !!token;
            updateSignupBtn();
          },
          'expired-callback': function() {
            turnstileVerified = false;
            updateSignupBtn();
          },
          'error-callback': function() {
            turnstileVerified = false;
            updateSignupBtn();
          }
        });
      }
    }

    // Toggle logic
    loginToggle.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'flex';
      signupForm.style.display = 'none';
      document.getElementById('authSubtitle').textContent = "Sign in to your account";
    });

    signupToggle.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      signupForm.style.display = 'flex';
      document.getElementById('authSubtitle').textContent = "Create your account";
      renderTurnstile();
    });

    function getFriendlyErrorMessage(err) {
      if (!err) return "An unexpected error occurred. Please try again.";
      const code = err.code || '';
      switch (code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          return "Invalid email or password.";
        case 'auth/email-already-in-use':
          return "This email address is already in use.";
        case 'auth/invalid-email':
          return "Please enter a valid email address.";
        case 'auth/weak-password':
          return "The password is too weak (must be at least 6 characters).";
        case 'auth/user-disabled':
          return "This account has been disabled. Please contact support.";
        case 'auth/popup-closed-by-user':
          return "Google sign-in was cancelled.";
        case 'auth/too-many-requests':
          return "Too many requests. Please try again later.";
        case 'auth/network-request-failed':
          return "A network error occurred. Please check your internet connection.";
        case 'auth/operation-not-allowed':
          return "This sign-in method is not enabled.";
        case 'auth/requires-recent-login':
          return "Please log in again to perform this sensitive action.";
        default:
          if (err.message && !err.message.includes('Firebase') && !err.message.includes('auth/')) {
            return err.message;
          }
          return "An unexpected error occurred. Please try again.";
      }
    }

    function showError(msg) {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
      setTimeout(() => { errorMsg.style.display = 'none'; }, 5000);
    }

    // ── Login brute-force lockout ──
    const MAX_LOGIN_ATTEMPTS = 5;
    const LOGIN_LOCKOUT_MS = 30000;

    function getLoginState() {
      const attempts = parseInt(localStorage.getItem('nk_login_attempts') || '0');
      const lockUntil = parseInt(localStorage.getItem('nk_login_lock_until') || '0');
      return { attempts, lockUntil };
    }

    function checkLoginLocked() {
      const { lockUntil } = getLoginState();
      const now = Date.now();
      if (now < lockUntil) {
        const secs = Math.ceil((lockUntil - now) / 1000);
        showError('Too many attempts. Try again in ' + secs + 's.');
        return true;
      }
      return false;
    }

    function recordFailedLogin() {
      const { attempts } = getLoginState();
      const next = attempts + 1;
      localStorage.setItem('nk_login_attempts', next);
      if (next >= MAX_LOGIN_ATTEMPTS) {
        localStorage.setItem('nk_login_lock_until', Date.now() + LOGIN_LOCKOUT_MS);
        localStorage.setItem('nk_login_attempts', '0');
        showError('Too many failed attempts. Locked for 30 seconds.');
      }
    }

    function clearLoginLock() {
      localStorage.removeItem('nk_login_attempts');
      localStorage.removeItem('nk_login_lock_until');
    }

    import { db } from './js/firebase-config.js';
    import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

    async function syncUserProfile(user) {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            isAdmin: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } else {
          await setDoc(userRef, {
            email: user.email || snap.data().email || '',
            displayName: user.displayName || snap.data().displayName || 'User',
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      } catch (err) {
        console.error("Error syncing user profile:", err);
      }
    }

    // Auth actions
    window.handleGoogleAuth = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(async (cred) => {
          await syncUserProfile(cred.user);
          window.location.href = 'index.html';
        })
        .catch(err => showError(getFriendlyErrorMessage(err)));
    };

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!turnstileVerified) {
        showError('Please complete the human verification.');
        return;
      }
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying...';
      const email = e.target.email.value;
      const pass = e.target.password.value;
      
      const turnstileToken = e.target.querySelector('[name="cf-turnstile-response"]')?.value || "";

      // Secure backend verification via serverless function
      fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken })
      })
      .then(res => {
        if (!res.ok) throw new Error('Verification request failed.');
        return res.json();
      })
      .then(data => {
        if (!data.success) {
          throw new Error('Human verification failed. Please refresh and try again.');
        }
        submitBtn.textContent = 'Creating account...';
        return createUserWithEmailAndPassword(auth, email, pass);
      })
      .then((userCredential) => {
        sendEmailVerification(userCredential.user);
        showVerificationScreen();
      })
      .catch(err => {
        showError(getFriendlyErrorMessage(err));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
        // Reset Turnstile so user must re-verify
        if (window.turnstile) window.turnstile.reset();
        turnstileVerified = false;
        updateSignupBtn();
      });
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (checkLoginLocked()) return;
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      const email = e.target.email.value;
      const pass = e.target.password.value;
      
      signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
          clearLoginLock();
          checkVerificationStatus();
        })
        .catch(err => {
          submitBtn.disabled = false;
          recordFailedLogin();
          showError(getFriendlyErrorMessage(err));
        });
    });

    let pollInterval = null;

    // ── Resend email — localStorage cooldown (real gate, not just UI) ──
    window.handleResendEmail = () => {
      const user = auth.currentUser;
      if (!user) return;
      const COOLDOWN = 60000;
      const lastSent = parseInt(localStorage.getItem('nk_last_verif_email') || '0');
      const now = Date.now();
      if (now - lastSent < COOLDOWN) {
        const remaining = Math.ceil((COOLDOWN - (now - lastSent)) / 1000);
        showError('Please wait ' + remaining + 's before resending.');
        return;
      }
      sendEmailVerification(user)
        .then(() => {
          localStorage.setItem('nk_last_verif_email', now.toString());
          const btn = document.getElementById('resendBtn');
          btn.disabled = true;
          btn.textContent = 'Sent! Wait 60s...';
          setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Resend Verification Email';
          }, COOLDOWN);
        })
        .catch(err => showError(getFriendlyErrorMessage(err)));
    };

    window.handleBackToLogin = () => {
      if (pollInterval) clearInterval(pollInterval);
      signOut(auth).then(() => {
        verificationOverlay.style.display = 'none';
      });
    };

    function showVerificationScreen() {
      verificationOverlay.style.display = 'flex';
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval(() => {
        if (auth.currentUser) {
          auth.currentUser.reload().then(() => {
            if (auth.currentUser.emailVerified) {
              clearInterval(pollInterval);
              window.location.href = 'index.html';
            }
          });
        }
      }, 3000);
    }

    function checkVerificationStatus() {
      const user = auth.currentUser;
      if (!user) return;
      const isGoogleUser = user.providerData && user.providerData.some(p => p.providerId === 'google.com');
      if (user.emailVerified || isGoogleUser) {
        window.location.href = 'index.html';
      } else {
        showVerificationScreen();
      }
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Google OAuth users are always verified (Google handles it)
        const isGoogleUser = user.providerData && user.providerData.some(p => p.providerId === 'google.com');
        if (user.emailVerified || isGoogleUser) {
          window.location.href = 'index.html';
        } else {
          showVerificationScreen();
        }
      } else {
        verificationOverlay.style.display = 'none';
      }
    });

    // Password Validation — button enabled only when rules pass AND Turnstile verified
    const signupPass = signupForm.querySelector('input[name="password"]');
    const signupBtn = signupForm.querySelector('button[type="submit"]');
    const rules = {
      length: document.getElementById('rule-len'),
      upper: document.getElementById('rule-upper'),
      lower: document.getElementById('rule-lower'),
      num: document.getElementById('rule-num')
    };
    let passwordValid = false;

    function updateSignupBtn() {
      const ok = passwordValid && turnstileVerified;
      signupBtn.disabled = !ok;
      signupBtn.style.opacity = ok ? '1' : '0.45';
    }

    if (signupPass) {
      signupPass.addEventListener('input', (e) => {
        const val = e.target.value;
        const results = {
          length: val.length >= 6,
          upper: /[A-Z]/.test(val),
          lower: /[a-z]/.test(val),
          num: /[0-9]/.test(val)
        };

        Object.keys(results).forEach(key => {
          if (results[key]) {
            rules[key]?.classList.add('met');
          } else {
            rules[key]?.classList.remove('met');
          }
        });

        passwordValid = Object.values(results).every(r => r);
        updateSignupBtn();
      });
    }
`;

const body = `
  <div class="auth-visual">
    <div class="auth-visual-content">
      <div class="auth-visual-badge">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
        NokorPass
      </div>
      <h1>Movies, Concerts<br>&amp; Live Events.</h1>
      <p>One pass for all your entertainment — book tickets instantly, anywhere in Cambodia.</p>
    </div>
  </div>

  <div class="auth-form-side">
    <div class="auth-container">

      <a href="index.html" class="auth-brand">
        <img src="assets/favicon.svg" alt="NokorPass">
        <span class="auth-brand-name">NokorPass</span>
      </a>

      <h2 class="auth-title">Welcome back</h2>
      <p id="authSubtitle" class="auth-subtitle">Sign in to your account</p>
      
      <div id="errorMsg" class="error-msg"></div>

      <!-- Login Form -->
      <form id="loginForm" class="auth-form">
        <button type="button" onclick="handleGoogleAuth()" class="btn-google">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google">
          Continue with Google
        </button>

        <div class="divider">or</div>

        <div class="input-group">
          <label>Email address</label>
          <input type="email" name="email" placeholder="you@example.com" required>
        </div>
        <div class="input-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••" required>
        </div>
        <button type="submit" class="btn-auth">Sign In</button>
        <p class="tos-note">
          By continuing, you agree to our
          <a href="terms.html">Terms</a> and <a href="privacy.html">Privacy Policy</a>.
        </p>
        <p class="toggle-auth">No account?<a href="#" id="signupToggle">Sign up free</a></p>
      </form>

      <!-- Signup Form -->
      <form id="signupForm" class="auth-form" style="display: none;">
        <div class="input-group">
          <label>Full name</label>
          <input type="text" name="name" placeholder="Jane Doe" required>
        </div>
        <div class="input-group">
          <label>Email address</label>
          <input type="email" name="email" placeholder="you@example.com" required>
        </div>
        <div class="input-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Min 6 chars" required>
          <div class="password-requirements">
            <div id="rule-len" class="pw-rule">Min 6 chars</div>
            <div id="rule-upper" class="pw-rule">1 Uppercase</div>
            <div id="rule-lower" class="pw-rule">1 Lowercase</div>
            <div id="rule-num" class="pw-rule">1 Number</div>
          </div>
        </div>
        <!-- Cloudflare Turnstile programmatic container -->
        <div id="turnstile-container" style="margin: 4px 0; min-height: 65px; display: flex; justify-content: center; align-items: center;"></div>
        <button type="submit" id="signupSubmitBtn" class="btn-auth" disabled style="opacity: 0.45;">Create Account</button>
        <p class="tos-note">
          By creating an account, you agree to our
          <a href="terms.html">Terms</a> and <a href="privacy.html">Privacy Policy</a>.
        </p>
        <p class="toggle-auth">Have an account?<a href="#" id="loginToggle">Sign in</a></p>
      </form>
    </div>
  </div>

  <div id="verificationOverlay" class="verification-overlay">
    <div class="verification-card">
      <div class="spinner"></div>
      <h2>Check your email</h2>
      <p>We sent a verification link to your inbox. This page will update automatically once verified.</p>
      <div class="verification-actions">
        <button id="resendBtn" onclick="handleResendEmail()" class="btn-auth">Resend Verification Email</button>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button onclick="window.location.reload()" class="btn-ghost-sm">Refresh Status</button>
          <button onclick="handleBackToLogin()" class="btn-ghost-sm">Back to Login</button>
        </div>
      </div>
    </div>
  </div>
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In — NokorPass</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/global.css" />
    <link rel="stylesheet" href="css/pages/auth.css" />
    <script type="module" src="js/legals-init.js"></script>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>
    </head>
<body>
    ${body}

    <script type="module">
      ${js}
    </script>
</body>
</html>`;

const root = path.resolve(__dirname, '../../');
const pagesDir = path.join(root, 'css', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

fs.writeFileSync(path.join(root, 'auth.html'), html, 'utf8');
fs.writeFileSync(path.join(pagesDir, 'auth.css'), css, 'utf8');
console.log('auth.html and css/pages/auth.css built successfully!');
