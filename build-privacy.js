const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');

const navMatch = index.match(/<nav>[\s\S]*?<\/nav>/);
let nav = navMatch ? navMatch[0] : '';
nav = nav.replace('<li><a href="#">Account</a></li>', '<li><a href="account.html">Account</a></li>');
nav = nav.replace('class="active"', '');

const footerMatch = index.match(/<footer>[\s\S]*?<\/footer>/);
let footer = footerMatch ? footerMatch[0] : '';
footer = footer.replace('<li><a href="#">Privacy Policy</a></li>', '<li><a href="privacy.html">Privacy Policy</a></li>');
footer = footer.replace('<li><a href="#">Terms of Service</a></li>', '<li><a href="terms.html">Terms of Service</a></li>');

const privacyContent = `
  <section class="legal-section">
    <div class="legal-container">
      <div class="legal-header">
        <span class="section-tag">Compliance</span>
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: March 31, 2026</p>
      </div>

      <div class="legal-body">
        <h3>1. Introduction</h3>
        <p>Welcome to Cinemart. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our ticket booking service.</p>

        <h3>2. Information We Collect</h3>
        <p>To provide our services, we collect the following types of information via Firebase Authentication and Firestore:</p>
        <ul>
          <li><strong>Identity Data:</strong> Full name and email address provided during signup.</li>
          <li><strong>Authentication Data:</strong> Login credentials or Google profile information (if using Google Sign-In).</li>
          <li><strong>Transaction Data:</strong> Your movie booking history, seat selections, and ticket details.</li>
          <li><strong>Technical Data:</strong> Cookies and IP addresses used for session management.</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <p>We use your information exclusively to:</p>
        <ul>
          <li>Create and manage your Cinemart account.</li>
          <li>Process movie ticket bookings and generate digital QR codes.</li>
          <li>Provide access to your personalized "My Tickets" dashboard.</li>
          <li>Verify your email for security purposes.</li>
        </ul>

        <h3>4. Data Storage & Security</h3>
        <p>Your data is stored securely using <strong>Google Firebase</strong>. We leverage Firebase's industry-standard security protocols to ensure your information is encrypted and protected from unauthorized access.</p>

        <h3>5. Third-Party Services</h3>
        <p>We use the following third-party providers:</p>
        <ul>
          <li><strong>Firebase Authentication:</strong> For secure login and identity verification.</li>
          <li><strong>Cloud Firestore:</strong> For real-time database storage of your tickets.</li>
          <li><strong>Google Services:</strong> For OAuth 2.0 authentication and analytics.</li>
        </ul>

        <h3 id="cookies-section">6. Cookies & Local Data</h3>
        <p>Cinemart uses essential cookies and local storage to securely maintain your login session via Firebase Authentication. These professional standards ensure you don't have to re-authenticate every time you visit. You can manage your preferences through our consent banner or browser settings.</p>

        <h3>7. Your Rights</h3>
        <p>You have the right to access, update, or request the deletion of your personal data. You can manage most of this directly through your account settings or by contacting our support team.</p>

        <h3>8. Contact Us</h3>
        <p>If you have questions about this policy, please contact us at <strong>privacy@cinemart.com</strong>.</p>
      </div>
    </div>
  </section>
`;

const css = `
  .legal-section { padding: 120px 60px; background: var(--black); min-height: 100vh; }
  .legal-container { max-width: 880px; margin: 0 auto; }
  .legal-header { border-bottom: 1px solid var(--border); padding-bottom: 48px; margin-bottom: 52px; }
  .legal-header h1 { font-family: 'Syne', sans-serif; font-size: 3.5rem; font-weight: 800; color: #fff; margin-bottom: 12px; }
  .last-updated { color: var(--muted); font-size: 0.9rem; }
  
  .legal-body { color: rgba(255,255,255,0.8); line-height: 1.8; }
  .legal-body h3 { font-family: 'Syne', sans-serif; color: #fff; font-size: 1.4rem; margin-top: 48px; margin-bottom: 20px; }
  .legal-body p { margin-bottom: 24px; font-size: 1.05rem; }
  .legal-body ul { margin-bottom: 24px; padding-left: 24px; }
  .legal-body li { margin-bottom: 12px; }
  .legal-body strong { color: var(--accent); }

  @media (max-width: 768px) {
    .legal-section { padding: 80px 24px; }
    .legal-header h1 { font-size: 2.5rem; }
  }
`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy — Cinemart</title>
    <link rel="icon" type="image/png" href="favicon.png">
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <script type="module" src="auth-guard.js"></script>
    <script type="module" src="legals-init.js"></script>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
            --black: #000000;
            --dark: #0d0d0d;
            --card: #1a1a1a;
            --border: #2a2a2a;
            --text: #ffffff;
            --muted: #b0b0b8;
            --accent: #e8490f;
            --white: #ffffff;
        }
        html { -ms-overflow-style: none; scrollbar-width: none; }
        html::-webkit-scrollbar { display: none; }
        body { font-family: 'DM Sans', sans-serif; background: var(--black); color: var(--text); line-height: 1.6; overflow-x: hidden; }
        nav { position: sticky; top: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 0 60px; height: 64px; background: rgba(0,0,0,0.95); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
        .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.35rem; color: var(--white); letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .logo img { height: 28px; width: auto; }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { text-decoration: none; color: var(--muted); font-size: 0.875rem; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: #fff; }
        .btn-ghost { background: rgba(255, 255, 255, 0.08); color: var(--text); border: 1px solid var(--border); padding: 12px 28px; border-radius: 8px; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; text-decoration: none; }
        
        footer { background: var(--dark); border-top: 1px solid var(--border); padding: 52px 60px 36px; margin-top: 0; }
        .footer-grid { display: grid; grid-template-columns: 1.2fr 1.5fr auto; gap: 40px; margin-bottom: 48px; }
        .footer-payments h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--white); margin-bottom: 16px; }
        .payment-icons { display: flex; gap: 12px; flex-wrap: wrap; }
        .payment-icons img { height: 36px; width: auto; border-radius: 4px; transition: transform 0.2s; }
        .payment-icons img:hover { transform: translateY(-2px); }
        .footer-links-group { display: flex; gap: 60px; justify-content: flex-end; }
        .footer-brand .logo { font-size: 1.2rem; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
        .footer-brand p { font-size: 0.82rem; color: var(--muted); line-height: 1.65; max-width: 260px; margin-bottom: 20px; }
        .social-links { display: flex; gap: 12px; }
        .social-links a { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--muted); text-decoration: none; font-size: 0.9rem; transition: border-color 0.2s, color 0.2s; }
        .social-links a:hover { border-color: var(--accent); color: var(--accent); }
        .footer-col h4 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--white); margin-bottom: 16px; }
        .footer-col ul { list-style: none; }
        .footer-col ul li+li { margin-top: 10px; }
        .footer-col ul a { text-decoration: none; font-size: 0.82rem; color: var(--muted); transition: color 0.2s; }
        .footer-col ul a:hover { color: var(--text); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; border-top: 1px solid var(--border); font-size: 0.78rem; color: var(--muted); }
        .footer-bottom a { color: inherit; text-decoration: none; transition: color 0.2s; }
        .footer-bottom a:hover { color: var(--white); }
        
        .section-tag { display: inline-block; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); background: rgba(232, 73, 15, 0.15); border: 1px solid rgba(232, 73, 15, 0.3); padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; }

        ${css}
    </style>
</head>
<body>
    ${nav}
    ${privacyContent}
    ${footer}
</body>
</html>`;

fs.writeFileSync('privacy.html', html);
console.log('privacy.html built successfully!');
