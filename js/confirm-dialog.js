/**
 * NokorPass custom confirm dialog (replaces window.confirm).
 * Usage: const ok = await confirmDialog({ title, message, confirmText, cancelText, variant: 'danger' });
 */
(function () {
  const ROOT_ID = 'nokorpass-confirm-root';

  function ensureRoot() {
    if (document.getElementById(ROOT_ID)) return;

    const root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'confirm-overlay';
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `
      <div class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirmDialogTitle" aria-describedby="confirmDialogMessage">
        <h3 id="confirmDialogTitle" class="confirm-dialog-title"></h3>
        <p id="confirmDialogMessage" class="confirm-dialog-message"></p>
        <div class="confirm-dialog-actions">
          <button type="button" class="btn-ghost confirm-dialog-cancel">Cancel</button>
          <button type="button" class="confirm-dialog-confirm">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    root.addEventListener('click', (e) => {
      if (e.target === root && root._resolve) {
        close(false);
      }
    });

    root.querySelector('.confirm-dialog-cancel').addEventListener('click', () => close(false));

    root.querySelector('.confirm-dialog-confirm').addEventListener('click', () => close(true));

    document.addEventListener('keydown', (e) => {
      if (!root.classList.contains('active')) return;
      if (e.key === 'Escape') close(false);
    });
  }

  function close(result) {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.classList.remove('active');
    root.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const resolve = root._resolve;
    root._resolve = null;
    if (resolve) resolve(result);
  }

  window.confirmDialog = function confirmDialog(options = {}) {
    ensureRoot();
    const root = document.getElementById(ROOT_ID);
    const {
      title = 'Are you sure?',
      message = '',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'default',
    } = options;

    const titleEl = root.querySelector('#confirmDialogTitle');
    const messageEl = root.querySelector('#confirmDialogMessage');
    const confirmBtn = root.querySelector('.confirm-dialog-confirm');
    const cancelBtn = root.querySelector('.confirm-dialog-cancel');
    const panel = root.querySelector('.confirm-dialog');

    titleEl.textContent = title;
    messageEl.textContent = message;
    confirmBtn.textContent = confirmText;
    cancelBtn.textContent = cancelText;

    panel.classList.remove('confirm-dialog--danger', 'confirm-dialog--default');
    panel.classList.add(variant === 'danger' ? 'confirm-dialog--danger' : 'confirm-dialog--default');

    return new Promise((resolve) => {
      root._resolve = resolve;
      root.classList.add('active');
      root.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      cancelBtn.focus();
    });
  };
})();
