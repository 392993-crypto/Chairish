document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  document.getElementById('add-chair-form').addEventListener('submit', handleAddChair);
  document.getElementById('chairImageFile').addEventListener('change', handleFileChange);
  document.getElementById('remove-image-btn').addEventListener('click', clearImage);
  document.getElementById('url-toggle-btn').addEventListener('click', toggleUrlFallback);
  document.getElementById('chairImageUrl').addEventListener('input', handleUrlInput);

  const zone = document.getElementById('upload-zone');
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  });
});

async function fetchCategories() {
  try {
    const res = await fetch('categories.json');
    if (!res.ok) throw new Error();
    populateCategories(await res.json());
  } catch {
    populateCategories([
      { id: 'cat_01', name: 'Ergonomic' },
      { id: 'cat_02', name: 'Lounge' },
      { id: 'cat_03', name: 'Dining' },
      { id: 'cat_04', name: 'Accent' },
      { id: 'cat_05', name: 'Outdoor' },
    ]);
  }
}

function populateCategories(cats) {
  const sel = document.getElementById('chairCategory');
  sel.innerHTML = '<option value="" disabled selected>— Select a Category —</option>';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id || c.name;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });
}

function setStatus(msg, type) {
  const el = document.getElementById('upload-status');
  el.textContent = msg;
  el.className = type || '';
}

function setPreview(src) {
  const previewWrap = document.getElementById('image-preview-wrap');
  const img = document.getElementById('image-preview');
  const zone = document.getElementById('upload-zone');
  img.src = src;
  previewWrap.style.display = 'block';
  zone.style.display = 'none';
}

function clearImage() {
  document.getElementById('chairImageFinal').value = '';
  document.getElementById('chairImageUrl').value = '';
  document.getElementById('chairImageFile').value = '';
  document.getElementById('image-preview-wrap').style.display = 'none';
  document.getElementById('upload-zone').style.display = 'block';
  setStatus('', '');
}

function toggleUrlFallback() {
  const group = document.getElementById('url-fallback-group');
  const visible = group.style.display === 'block';
  group.style.display = visible ? 'none' : 'block';
  document.getElementById('url-toggle-btn').querySelector('span').textContent =
    visible ? 'Or paste a URL instead' : 'Hide URL input';
}

function handleUrlInput() {
  const url = document.getElementById('chairImageUrl').value.trim();
  if (url) {
    document.getElementById('chairImageFinal').value = url;
    setPreview(url);
    setStatus('', '');
  }
}

async function handleFileChange(e) {
  const file = e.target.files[0];
  if (file) await uploadFile(file);
}

async function uploadFile(file) {
  setStatus('Uploading…', 'uploading');
  document.getElementById('submit-btn').disabled = true;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Upload failed');
    }
    const { url } = await res.json();
    document.getElementById('chairImageFinal').value = url;
    setPreview(url);
    setStatus('✓ Image uploaded', 'done');
  } catch (err) {
    setStatus('Upload failed: ' + err.message, 'error');
    clearImage();
  } finally {
    document.getElementById('submit-btn').disabled = false;
  }
}

async function handleAddChair(e) {
  e.preventDefault();

  const imageUrl = document.getElementById('chairImageFinal').value.trim();
  if (!imageUrl) {
    alert('Please add a chair photo or image URL.');
    return;
  }

  let activeUser = null;
  try { activeUser = JSON.parse(localStorage.getItem('currentUser')); } catch {}

  const chair = {
    name: document.getElementById('chairName').value,
    brand: document.getElementById('chairBrand').value,
    image: imageUrl,
    categoryId: document.getElementById('chairCategory').value,
    description: document.getElementById('chairDescription').value,
    userId: activeUser ? (activeUser.id || activeUser.userId) : 'guest',
    tags: document.getElementById('chairTags').value
      .split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
  };

  try {
    const res = await fetch('/api/chairs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chair),
    });
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    alert('Chair posted successfully!');
    window.location.href = 'home.html';
  } catch (err) {
    alert('Failed to post chair: ' + err.message);
  }
}
