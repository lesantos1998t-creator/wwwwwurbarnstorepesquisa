
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
  ['Conjunto Mini Street', 'Infantil', 'R$ 129,90', '1519238263530-99bdd11df2ea']
];

// IMPORTANTE:
// Este endereço precisa existir no seu backend.
// Publicar apenas HTML, CSS e JavaScript não cria essa API.
const API_URL = '/api/submissions';

let category = 'Todos';
let selectedStars = 0;

const grid = document.querySelector('#products');
const searchInput = document.querySelector('#search');
const emptyMessage = document.querySelector('#empty');

const registerDialog = document.querySelector('#register');
const registerForm = document.querySelector('#registerForm');

const ratingDialog = document.querySelector('#rating');
const ratingForm = document.querySelector('#ratingForm');

const feedbackForm = document.querySelector('#feedbackForm');

// Obtém um elemento sem provocar erro se ele não existir.
function getElement(selector) {
  return document.querySelector(selector);
}

// Exibe uma mensagem de erro ou sucesso.
function showMessage(element, message = '') {
  if (!element) return;

  if (message) {
    element.textContent = message;
  }

  element.hidden = !message;
}

// Atualiza a seleção das estrelas.
function selectStars(value) {
  selectedStars = value;

  document.querySelectorAll('.stars button').forEach(button => {
    const starValue = Number(button.dataset.v);
    const selected = starValue <= value;

    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(starValue === value));
  });

  const hiddenRating = getElement('#ratingValue');

  if (hiddenRating) {
    hiddenRating.value = String(value);
  }
}

// Abre a janela de avaliação de um produto.
function openRating(productName) {
  if (!ratingDialog || !ratingForm) return;

  if (ratingForm.dataset.saving === 'true') return;

  ratingForm.reset();
  selectStars(0);

  ratingForm.dataset.product = productName;

  const title = getElement('#ratingName');

  if (title) {
    title.textContent = `Avaliar: ${productName}`;
  }

  showMessage(getElement('#ratingError'));
  showMessage(getElement('#ratingSuccess'));

  ratingDialog.showModal();
}

// Monta os produtos e aplica os filtros.
function render() {
  if (!grid || !searchInput) return;

  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');

  const filteredProducts = data.filter(product => {
    const matchesCategory =
      category === 'Todos' || product[1] === category;

    const searchableText = `${product[0]} ${product[1]}`
      .toLocaleLowerCase('pt-BR');

    const matchesSearch = searchableText.includes(query);

    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = filteredProducts.map(product => {
    const [name, productCategory, price, imagePath] = product;

    const imageUrl = imagePath.startsWith('/')
      ? imagePath
      : `https://images.unsplash.com/photo-${imagePath}?auto=format&fit=crop&w=900&q=80`;

    return `
      <article class="product-card">
        <div class="product-image">
          <img
            src="${imageUrl}"
            alt="${name}"
            loading="lazy"
            onerror="this.onerror=null;this.alt='Imagem indisponível';this.classList.add('image-error')"
          >

          <span class="tag">${productCategory.toUpperCase()}</span>

          <button
            type="button"
            class="rate"
            data-name="${name}"
            aria-label="Avaliar ${name}"
          >★</button>
        </div>

        <div class="product-info">
          <h3>${name}</h3>
          <p>${price} · Disponível para avaliação</p>
        </div>
      </article>
    `;
  }).join('');

  if (emptyMessage) {
    emptyMessage.hidden = filteredProducts.length > 0;
  }

  grid.querySelectorAll('.rate').forEach(button => {
    button.addEventListener('click', () => {
      openRating(button.dataset.name);
    });
  });
}

// Envia os dados ao backend e só confirma se o servidor confirmar.
async function saveSubmission(form, payload, errorElement, successElement) {
  if (!form || form.dataset.saving === 'true') return false;

  showMessage(errorElement);
  showMessage(successElement);

  form.dataset.saving = 'true';
  form.setAttribute('aria-busy', 'true');

  const controls = Array.from(
    form.querySelectorAll('input, select, textarea, button')
  );

  const originalDisabledStates = controls.map(control => control.disabled);

  const submitButton = form.querySelector(
    'button[type="submit"], button.button'
  );

  const originalButtonText = submitButton
    ? submitButton.textContent
    : '';

  controls.forEach(control => {
    control.disabled = true;
  });

  if (submitButton) {
    submitButton.textContent = 'Enviando...';
  }

  let saved = false;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let result = {};

    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'O serviço de recebimento ainda não está configurado. O site precisa de um backend para guardar as respostas.'
        );
      }

      throw new Error(
        result.error || `Erro no envio (código ${response.status}).`
      );
    }

    if (result.saved !== true) {
      throw new Error(
        'O servidor não confirmou o armazenamento dos dados.'
      );
    }

    showMessage(successElement, 'Enviado e confirmado pelo servidor. Obrigado!');
    saved = true;

  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Não foi possível enviar os dados. Tente novamente.';

    showMessage(errorElement, message);

  } finally {
    form.dataset.saving = 'false';
    form.setAttribute('aria-busy', 'false');

    controls.forEach((control, index) => {
      control.disabled = originalDisabledStates[index];
    });

    if (submitButton) {
      submitButton.textContent = originalButtonText;
    }
  }

  return saved;
}

// Abre o cadastro voluntário.
function openRegister() {
  if (!registerDialog || !registerForm) return;
  if (registerForm.dataset.saving === 'true') return;

  showMessage(getElement('#formError'));
  showMessage(getElement('#success'));

  registerDialog.showModal();
}

getElement('#openRegister')?.addEventListener('click', openRegister);
getElement('#openRegister2')?.addEventListener('click', openRegister);

// Processa o cadastro, respeitando os campos existentes no HTML.
if (registerForm) {
  registerForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!registerForm.reportValidity()) return;

    const fields = new FormData(registerForm);

    const payload = {
      type: 'registration',
      name: String(fields.get('nome') || '').trim(),
      ageRange: String(fields.get('idade') || ''),
      email: String(fields.get('email') || '').trim(),
      truthfulData: fields.get('truthfulData') === 'on',
      voluntaryParticipation:
        fields.get('voluntaryParticipation') === 'on',
      privacyConsent: fields.get('privacyConsent') === 'on',
      academicUseConsent: fields.get('academicUseConsent') === 'on'
    };

    // Inclui gênero apenas se o formulário possuir esse campo.
    if (registerForm.elements.genero) {
      payload.gender = String(fields.get('genero') || '');
    }

    const saved = await saveSubmission(
      registerForm,
      payload,
      getElement('#formError'),
      getElement('#success')
    );

    if (saved) {
      registerForm.reset();
    }
  });
}

// Ativa as estrelas na janela de avaliação.
document.querySelectorAll('.stars button').forEach(button => {
  button.addEventListener('click', () => {
    selectStars(Number(button.dataset.v));
  });
});

// Envia a avaliação.
if (ratingForm) {
  ratingForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!ratingForm.reportValidity()) return;

    const errorElement = getElement('#ratingError');
    const successElement = getElement('#ratingSuccess');

    if (selectedStars < 1 || selectedStars > 5) {
      showMessage(successElement);
      showMessage(errorElement, 'Selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    const payload = {
      type: 'rating',
      product: ratingForm.dataset.product || '',
      stars: selectedStars,
      comment: String(
        new FormData(ratingForm).get('comment') || ''
      ).trim()
    };

    const saved = await saveSubmission(
      ratingForm,
      payload,
      errorElement,
      successElement
    );

    if (saved) {
      ratingForm.reset();
      selectStars(0);
    }
  });
}

// Envia o feedback.
if (feedbackForm) {
  feedbackForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!feedbackForm.reportValidity()) return;

    const fields = new FormData(feedbackForm);

    const payload = {
      type: 'feedback',
      email: String(fields.get('feedbackEmail') || '').trim(),
      message: String(fields.get('feedbackText') || '').trim()
    };

    const saved = await saveSubmission(
      feedbackForm,
      payload,
      getElement('#feedbackError'),
      getElement('#feedbackSuccess')
    );

    if (saved) {
      feedbackForm.reset();
    }
  });
}

// Fecha as janelas pelos botões de fechar.
document.querySelectorAll('.close').forEach(button => {
  button.addEventListener('click', () => {
    button.closest('dialog')?.close();
  });
});

// Aviso provisório de privacidade.
function showTerms(event) {
  event.preventDefault();

  alert(
    'Aviso de privacidade — Urban Store\n\n' +
    'A participação na pesquisa é voluntária. ' +
    'Antes de enviar seus dados, consulte o responsável pelo projeto ' +
    'para conhecer a finalidade, o prazo de armazenamento, ' +
    'quem poderá acessar as respostas e como solicitar acesso, ' +
    'correção ou exclusão dos dados.\n\n' +
    'Não envie informações pessoais nos comentários das avaliações.'
  );
}

document.querySelectorAll('#terms, .policies a').forEach(link => {
  link.addEventListener('click', showTerms);
});

// Campo de pesquisa.
searchInput?.addEventListener('input', render);

// Filtros por categoria.
document.querySelectorAll('.cats button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.cats button').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');

    category = button.dataset.cat || 'Todos';

    render();

    getElement('#catalogo')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Atalho Ctrl+K ou Command+K para pesquisar.
document.addEventListener('keydown', event => {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === 'k'
  ) {
    event.preventDefault();
    searchInput?.focus();
  }
});

// Inicializa a loja.
render();
