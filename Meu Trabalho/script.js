// ========= CONFIG =========
// Cole aqui a URL do seu Apps Script publicado como Web App (Google Sheets)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// Configurações
const CONFIG = {
  debounceTime: 300, // ms para debounce
  animationDuration: 200, // ms para animações
  maxRetries: 2, // tentativas de requisição
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

// Estado global
const STATE = {
  isSubmitting: false,
  retryCount: 0,
  formData: null,
};

// Elementos do DOM
const DOM = {
  form: document.getElementById('orcamentoForm'),
  submitBtn: document.getElementById('btnEnviar'),
  statusEl: document.getElementById('formStatus'),
  burger: document.getElementById('burger'),
  mobileMenu: document.getElementById('mobileMenu'),
  year: document.getElementById('year'),
};

// Inicialização
function init() {
  initApp();
  setupEventListeners();
  setupIntersectionObserver();
  registerServiceWorker();
  setupFormValidation();
  setupPrintStyles();
}

// Configuração inicial do app
function initApp() {
  // Atualiza o ano no footer
  DOM.year.textContent = new Date().getFullYear();
  
  // Verifica se o formulário existe
  if (!DOM.form) {
    console.warn('Formulário não encontrado');
    return;
  }
  
  // Verifica se o Google Script está configurado
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    console.warn('URL do Google Script não configurada');
    showStatus('⚠ Configure a URL do Google Script', 'warning');
  }
}

// Configura os event listeners
function setupEventListeners() {
  // Menu mobile
  if (DOM.burger) {
    DOM.burger.addEventListener('click', toggleMobileMenu);
  }
  
  // Fechar menu ao clicar em um link
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      DOM.mobileMenu.classList.remove('open');
      DOM.mobileMenu.style.display = 'none';
    });
  });
  
  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      DOM.mobileMenu.classList.remove('open');
      DOM.mobileMenu.style.display = 'none';
    }
  });
  
  // Envio do formulário
  if (DOM.form) {
    DOM.form.addEventListener('submit', handleFormSubmit);
  }
  
  // Validação em tempo real
  setupRealTimeValidation();
}

// Configura a validação em tempo real
function setupRealTimeValidation() {
  if (!DOM.form) return;
  
  const inputs = DOM.form.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('input', debounce(validateField, 300));
    input.addEventListener('blur', validateField);
  });
}

// Valida um campo do formulário
function validateField(e) {
  const input = e.target;
  const errorEl = input.nextElementSibling;
  
  // Remove mensagens de erro anteriores
  if (errorEl && errorEl.classList.contains('error-message')) {
    errorEl.remove();
  }
  
  // Validação específica por tipo de campo
  if (input.required && !input.value.trim()) {
    showFieldError(input, 'Este campo é obrigatório');
    return false;
  }
  
  if (input.type === 'email' && !isValidEmail(input.value)) {
    showFieldError(input, 'Por favor, insira um e-mail válido');
    return false;
  }
  
  if (input.type === 'tel' && !isValidPhone(input.value)) {
    showFieldError(input, 'Por favor, insira um telefone válido');
    return false;
  }
  
  return true;
}

// Mostra erro em um campo
function showFieldError(input, message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.style.color = '#ef4444';
  errorEl.style.fontSize = '0.875rem';
  errorEl.style.marginTop = '0.25rem';
  errorEl.textContent = message;
  
  input.insertAdjacentElement('afterend', errorEl);
  input.setAttribute('aria-invalid', 'true');
  
  return false;
}

// Validação de e-mail
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validação de telefone
function isValidPhone(phone) {
  return /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/.test(phone);
}

// Toggle do menu mobile
function toggleMobileMenu() {
  const isOpen = DOM.mobileMenu.classList.toggle('open');
  DOM.mobileMenu.style.display = isOpen ? 'block' : 'none';
  
  // Acessibilidade: atualiza o atributo aria-expanded
  DOM.burger.setAttribute('aria-expanded', isOpen);
}

// Configura o Intersection Observer para animações
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  // Observa todos os elementos com data-animate
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// Handler para o envio do formulário
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (STATE.isSubmitting) return;
  
  // Validação do formulário
  if (!isFormValid()) {
    showStatus('Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }
  
  // Prepara os dados do formulário
  const formData = new FormData(DOM.form);
  
  try {
    // Atualiza o estado
    STATE.isSubmitting = true;
    STATE.formData = formData;
    
    // Mostra estado de carregamento
    updateButtonState(true);
    showStatus('Enviando sua mensagem...', 'info');
    
    // Converte FormData para objeto simples
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });
    
    // Adiciona timestamp
    formDataObj.timestamp = new Date().toISOString();
    
    // Envia o formulário
    await submitForm(formDataObj);
    
  } catch (error) {
    console.error('Erro ao enviar o formulário:', error);
    handleFormError(error);
    
  } finally {
    // Restaura o estado
    STATE.isSubmitting = false;
    updateButtonState(false);
  }
}

// Envia o formulário para o Google Script
async function submitForm(formData) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData).toString(),
      mode: 'no-cors',
    });
    
    // Como estamos usando 'no-cors', não podemos verificar o status da resposta
    // Mas podemos verificar se a requisição foi feita
    if (!response) {
      throw new Error('Erro ao enviar o formulário');
    }
    
    // Sucesso!
    showStatus('✅ Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
    DOM.form.reset();
    
    // Rola para o topo do formulário
    DOM.form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (error) {
    // Tenta novamente se ainda houver tentativas
    if (STATE.retryCount < CONFIG.maxRetries) {
      STATE.retryCount++;
      console.log(`Tentativa ${STATE.retryCount} de ${CONFIG.maxRetries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return submitForm(STATE.formData);
    }
    
    // Se esgotar as tentativas, lança o erro
    throw error;
  } finally {
    // Reseta o contador de tentativas
    STATE.retryCount = 0;
  }
}

// Verifica se o formulário é válido
function isFormValid() {
  let isValid = true;
  const requiredFields = DOM.form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      showFieldError(field, 'Este campo é obrigatório');
    }
  });
  
  return isValid;
}

// Atualiza o estado do botão de envio
function updateButtonState(isLoading) {
  if (!DOM.submitBtn) return;
  
  if (isLoading) {
    DOM.submitBtn.disabled = true;
    DOM.submitBtn.textContent = 'Enviando...';
    DOM.submitBtn.setAttribute('aria-busy', 'true');
  } else {
    DOM.submitBtn.disabled = false;
    DOM.submitBtn.textContent = 'Enviar';
    DOM.submitBtn.removeAttribute('aria-busy');
  }
}

// Manipula erros do formulário
function handleFormError(error) {
  console.error('Erro no formulário:', error);
  
  let errorMessage = 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.';
  
  if (error.message.includes('network')) {
    errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
  }
  
  showStatus(`❌ ${errorMessage}`, 'error');
  
  // Rola para a mensagem de erro
  DOM.statusEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Mostra mensagem de status
function showStatus(message, type = 'info') {
  if (!DOM.statusEl) return;
  
  // Remove classes de tipo anteriores
  DOM.statusEl.className = 'status-message';
  
  // Adiciona a classe do tipo
  DOM.statusEl.classList.add(type);
  
  // Define a mensagem
  DOM.statusEl.textContent = message;
  
  // Adiciona ícone baseado no tipo
  let icon = '';
  switch (type) {
    case 'success':
      icon = '✅ ';
      break;
    case 'error':
      icon = '❌ ';
      break;
    case 'warning':
      icon = '⚠️ ';
      break;
    default:
      icon = 'ℹ️ ';
  }
  
  DOM.statusEl.innerHTML = `${icon}${message}`;
  
  // Esconde a mensagem após 5 segundos (exceto para erros)
  if (type !== 'error') {
    setTimeout(() => {
      DOM.statusEl.textContent = '';
      DOM.statusEl.className = 'status-message';
    }, 5000);
  }
}

// Register Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration.scope);
        })
        .catch(error => {
          console.error('Falha ao registrar o Service Worker:', error);
        });
    });
  }
}

// Configura estilos para impressão
function setupPrintStyles() {
  // Adiciona uma classe ao body quando a página for impressa
  window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
  });
  
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
  });
}

// Helper: Debounce para eventos
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Helper: Throttle para eventos
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Atualiza automaticamente o canonical para ambiente local
(function updateCanonical() {
  const link = document.querySelector('link[rel="canonical"]');
  if (link && (location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    link.href = location.origin;
  }
})();

// Monitora erros não tratados
window.addEventListener('error', (event) => {
  console.error('Erro não tratado:', event.error || event.message, event);
  
  // Aqui você pode enviar o erro para um serviço de monitoramento
  // ex: Sentry.captureException(event.error);
  
  return false;
});

// Monitora promessas não tratadas
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promessa não tratada:', event.reason);
  
  // Aqui você pode enviar o erro para um serviço de monitoramento
  // ex: Sentry.captureException(event.reason);
  
  event.preventDefault();
});

document.addEventListener('DOMContentLoaded', init);
