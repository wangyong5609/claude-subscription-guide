const toc = document.querySelector('.toc');
const mobileQuery = window.matchMedia('(max-width: 780px)');
function syncToc() { toc.open = !mobileQuery.matches; }
syncToc();
mobileQuery.addEventListener('change', syncToc);
document.querySelectorAll('.toc a').forEach(link => link.addEventListener('click', () => {
  if (mobileQuery.matches) toc.open = false;
}));

const sections = [...document.querySelectorAll('.article-content h2')];
const tocLinks = [...document.querySelectorAll('.toc nav a')];
let scrollQueued = false;
function updateActive() {
  const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= 150) || sections[0];
  tocLinks.forEach(link => {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateActive); }
}, { passive: true });
updateActive();

const toast = document.querySelector('#toast');
let toastTimeout;
function notify(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 2600);
}
document.querySelectorAll('.copy-prompt').forEach(button => {
  button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.copy);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = '已复制 ✓';
      notify('提示词已复制');
      setTimeout(() => { button.textContent = '复制提示词'; }, 2300);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      notify('已选中提示词，请长按或按 Ctrl/Cmd+C 复制');
    }
  });
});

const dialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
document.querySelectorAll('.image-link').forEach(link => link.addEventListener('click', event => {
  if (!dialog.showModal || event.metaKey || event.ctrlKey || event.shiftKey) return;
  event.preventDefault();
  dialogImage.src = link.href;
  dialogImage.alt = link.querySelector('img').alt;
  document.querySelector('#original-image').href = link.href;
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
