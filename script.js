const data = [
  ['Camiseta Urban Basic', 'Roupas', 'R$ 89,90', '1521572163474-6864f9cf17ab'],
  ['Jaqueta Street Oversized', 'Masculino', 'R$ 249,90', '1551488831-00ddcb6c6bd3'],
  ['Moletom Urban Essential', 'Feminino', 'R$ 189,90', '1556821840-3a63f95609a7'],
  ['Calça Cargo City', 'Roupas', 'R$ 219,90', '/calca-cargo.svg'],
  ['Tênis Street Move', 'Calçados', 'R$ 299,90', '1542291026-7eec264c27ff'],
  ['Boné Logo Central', 'Acessórios', 'R$ 79,90', '1521369909029-2afed882baee'],
  ['Bolsa Crossbody Urban', 'Acessórios', 'R$ 139,90', '1584917865442-de89df76afd3'],
  ['Óculos City Frame', 'Acessórios', 'R$ 119,90', '1572635196237-14b3f281503f'],
  ['Relógio Minimal Urban', 'Acessórios', 'R$ 169,90', '1523170335258-f5ed11844a49'],
  ['Mochila Transit Daily', 'Acessórios', 'R$ 199,90', '1553062407-98eeb64c6a62'],
  ['Conjunto Mini Street', 'Infantil', 'R$ 129,90', '1519238263530-99bdd11df2ea'],
];
let category = 'Todos';
let selectedStars = 0;
const grid = document.querySelector('#products');
const registerDialog = document.querySelector('#register');
const registerForm = document.querySelector('#registerForm');
const ratingDialog = document.querySelector('#rating');
const ratingForm = document.querySelector('#ratingForm');
const feedbackForm = document.querySelector('#feedbackForm');

function selectStars(value) {
  selectedStars = value;
  document.querySelectorAll('.stars button').forEach(button => {
    button.classList.toggle('selected', Number(button.dataset.v) <= value);
    button.setAttribute('aria-pressed', String(Number(button.dataset.v) === value));
  });
}

function openRating(product) {
  if (ratingForm.dataset.saving === 'true') return;
  ratingForm.reset();
  selectStars(0);
  ratingForm.dataset.product = product;
  document.querySelector('#ratingName').textContent = 'Avaliar: ' + product;
  document.querySelector('#ratingError').hidden = true;
  document.querySelector('#ratingSuccess').hidden = true;
  ratingDialog.showModal();
}

function render() {
  const query = document.querySelector('#search').value.toLowerCase();
  const products = data.filter(product => (category === 'Todos' || product[1] === category)
    && (product[0] + ' ' + product[1]).toLowerCase().includes(query));
  grid.innerHTML = products.map(product => `<article class="product-card"><div class="product-image"><img src="${product[3].startsWith('/') ? product[3] : `https://images.unsplash.com/photo-${product[3]}?auto=format&fit=crop&w=900&q=80`}" alt="${product[0]}" loading="lazy"><span class="tag">${product[1].toUpperCase()}</span><button class="rate" data-name="${product[0]}" aria-label="Avaliar ${product[0]}">★</button></div><div class="product-info"><h3>${product[0]}</h3><p>${product[2]} · Disponível para avaliação</p></div></article>`).join('');
  document.querySelector('#empty').hidden = products.length > 0;
  document.querySelectorAll('.rate').forEach(button => {
    button.onclick = () => openRating(button.dataset.name);
  });
}

async function saveSubmission(form, payload, errorElement, successElement) {
  if (form.dataset.saving === 'true') return false;
  errorElement.hidden = true;
  successElement.hidden = true;
  form.dataset.saving = 'true';
  form.setAttribute('aria-busy', 'true');
  const button = form.querySelector('button[type="submit"], button.button');
  const originalLabel = button.textContent;
  const controls = [...form.querySelectorAll('input, select, textarea, button')];
  const disabledStates = controls.map(control => control.disabled);
  controls.forEach(control => { control.disabled = true; });
  button.textContent = 'Guardando...';
  try {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || result.saved !== true) {
      throw new Error(result.error || 'Não foi possível guardar os dados. Tente novamente.');
    }
    successElement.hidden = false;
    return true;
  } catch (error) {
    errorElement.textContent = error instanceof Error && error.message !== 'Failed to fetch'
      ? error.message : 'Não foi possível guardar os dados. Verifique sua conexão e tente novamente.';
    errorElement.hidden = false;
    return false;
  } finally {
    form.dataset.saving = 'false';
    form.setAttribute('aria-busy', 'false');
    controls.forEach((control, index) => { control.disabled = disabledStates[index]; });
    button.textContent = originalLabel;
  }
}

function openRegister() {
  if (registerForm.dataset.saving === 'true') return;
  document.querySelector('#formError').hidden = true;
  document.querySelector('#success').hidden = true;
  registerDialog.showModal();
}

document.querySelector('#openRegister').onclick = openRegister;
document.querySelector('#openRegister2').onclick = openRegister;
registerForm.onsubmit = async event => {
  event.preventDefault();
  const fields = registerForm.elements;
  const saved = await saveSubmission(registerForm, {
    type: 'registration',
    name: fields.nome.value.trim(),
    ageRange: fields.idade.value,
    gender: fields.genero.value,
    email: fields.email.value.trim(),
    address: fields.endereco.value.trim(),
    houseNumber: fields.numero.value.trim(),
    truthfulData: fields.truthfulData.checked,
    voluntaryParticipation: fields.voluntaryParticipation.checked,
    privacyConsent: fields.privacyConsent.checked,
    academicUseConsent: fields.academicUseConsent.checked,
  }, document.querySelector('#formError'), document.querySelector('#success'));
  if (saved) registerForm.reset();
};

document.querySelectorAll('.stars button').forEach(button => {
  button.onclick = () => selectStars(Number(button.dataset.v));
});
ratingForm.onsubmit = async event => {
  event.preventDefault();
  const errorElement = document.querySelector('#ratingError');
  if (!selectedStars) {
    document.querySelector('#ratingSuccess').hidden = true;
    errorElement.textContent = 'Selecione uma nota de 1 a 5 estrelas.';
    errorElement.hidden = false;
    return;
  }
  const saved = await saveSubmission(ratingForm, {
    type: 'rating',
    product: ratingForm.dataset.product,
    stars: selectedStars,
    comment: ratingForm.elements.comment.value.trim(),
  }, errorElement, document.querySelector('#ratingSuccess'));
  if (saved) {
    ratingForm.reset();
    selectStars(0);
  }
};

feedbackForm.onsubmit = async event => {
  event.preventDefault();
  const saved = await saveSubmission(feedbackForm, {
    type: 'feedback',
    email: feedbackForm.elements.feedbackEmail.value.trim(),
    message: feedbackForm.elements.feedbackText.value.trim(),
  }, document.querySelector('#feedbackError'), document.querySelector('#feedbackSuccess'));
  if (saved) feedbackForm.reset();
};

document.querySelectorAll('.close').forEach(button => {
  button.onclick = () => button.closest('dialog').close();
});
function showTerms(event) {
  event.preventDefault();
  alert('Termos de consentimento — versão 2026-10-09: participação voluntária para pesquisa acadêmica sobre preferências de moda. Os dados do cadastro, os consentimentos, as avaliações e os feedbacks enviados são armazenados no banco de dados do projeto na Netlify. Não inclua dados pessoais nos comentários. Os dados não serão vendidos. Para acesso, correção, exclusão ou revogação, contate o responsável pelo projeto. Consulte o responsável para a versão completa do aviso de privacidade.');
}
document.querySelectorAll('#terms, .policies a').forEach(link => {
  link.onclick = showTerms;
});
document.querySelector('#search').oninput = render;
document.querySelectorAll('.cats button').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('.cats button').forEach(categoryButton => categoryButton.classList.remove('active'));
    button.classList.add('active');
    category = button.dataset.cat;
    render();
    document.querySelector('#catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.querySelector('#search').focus();
  }
});
render();
