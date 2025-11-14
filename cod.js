const whatsappNumber = "+5531971294253";
let lastFocusedElement = null;

// Garantir que as funções estejam disponíveis globalmente
window.scrollToSection = scrollToSection;
window.scrollToForm = scrollToForm;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.submitForm = submitForm;
window.openTermsModal = openTermsModal;
window.closeTermsModal = closeTermsModal;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    scrollToSection(targetId);
  });
});

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

function scrollToForm() {
  scrollToSection("form");
}

// Menu Mobile Toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("active");
  }
}

// Fechar Menu Mobile
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.classList.remove("active");
  }
}

function openTermsModal() {
  const modal = document.getElementById("termsModal");
  if (!modal) {
    return;
  }

  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement) {
    lastFocusedElement = activeElement;
  } else {
    lastFocusedElement = null;
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) {
    closeButton.focus();
  }

  document
    .querySelectorAll('[data-modal-target="termsModal"]')
    .forEach((button) => {
      button.setAttribute("aria-expanded", "true");
    });
}

function closeTermsModal() {
  const modal = document.getElementById("termsModal");
  if (!modal) {
    return;
  }

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus({ preventScroll: true });
    lastFocusedElement = null;
  }

  document
    .querySelectorAll('[data-modal-target="termsModal"]')
    .forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
}

function updateSubmitState() {
  const submitBtn = document.querySelector(".btn-submit");
  const termsCheckbox = document.getElementById("aceito");
  if (!submitBtn) {
    return;
  }

  const requiredIds = [
    "name",
    "material",
    "weight",
    "street",
    "neighborhood",
    "number",
  ];

  const allFieldsFilled = requiredIds.every((id) => {
    const field = document.getElementById(id);
    if (!field) {
      return false;
    }

    const value =
      typeof field.value === "string" ? field.value.trim() : field.value;
    return Boolean(value);
  });

  const termsAccepted = termsCheckbox ? termsCheckbox.checked : false;
  const isValid = allFieldsFilled && termsAccepted;

  submitBtn.disabled = !isValid;
  submitBtn.classList.toggle("btn-disabled", !isValid);
  submitBtn.setAttribute("aria-disabled", String(!isValid));
}

// Fechar menu ao clicar fora
document.addEventListener("click", function (event) {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuBtn = document.querySelector(".mobile-menu-btn");

  if (mobileMenu && mobileMenu.classList.contains("active")) {
    if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
      closeMobileMenu();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("termsModal");
  if (!modal) {
    return;
  }

  const openButtons = document.querySelectorAll('[data-modal-target="termsModal"]');
  const closeButtons = modal.querySelectorAll("[data-modal-close]");

  openButtons.forEach(button => {
    button.addEventListener("click", openTermsModal);
  });

  closeButtons.forEach(button => {
    button.addEventListener("click", closeTermsModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("active")) {
      closeTermsModal();
    }
  });
});

function handleFieldError(fieldId, message) {
  alert(message);
  const field = document.getElementById(fieldId);
  if (!field) {
    return;
  }

  const wrapper = field.closest(".input-wrapper");
  if (wrapper) {
    wrapper.classList.add("error");
  }

  field.focus();
  updateSubmitState();
}

// Validação e Envio do Formulário
function submitForm(event) {
  event.preventDefault();

  console.log("Formulário enviado!");

  // Coleta os dados do formulário
  const formData = {
    name: document.getElementById("name").value.trim(),
    material: document.getElementById("material").value,
    weight: document.getElementById("weight").value,
    observation: document.getElementById("observation").value.trim(),
    street: document.getElementById("street").value.trim(),
    neighborhood: document.getElementById("neighborhood").value.trim(),
    number: document.getElementById("number").value.trim(),
    complement: document.getElementById("complement").value.trim(),
  };

  console.log("Dados coletados:", formData);

  // Validação dos campos obrigatórios
  if (!formData.name) {
    handleFieldError("name", "Por favor, preencha seu nome.");
    return;
  }

  if (!formData.material) {
    handleFieldError("material", "Por favor, selecione o tipo de material.");
    return;
  }

  if (!formData.weight) {
    handleFieldError("weight", "Por favor, selecione o peso estimado.");
    return;
  }

  if (!formData.street) {
    handleFieldError("street", "Por favor, preencha o nome da rua.");
    return;
  }

  if (!formData.neighborhood) {
    handleFieldError("neighborhood", "Por favor, preencha o bairro.");
    return;
  }

  if (!formData.number) {
    handleFieldError("number", "Por favor, preencha o número.");
    return;
  }

  const termsCheckbox = document.getElementById("aceito");
  const termsContainer = document.querySelector(".termos");
  if (termsCheckbox && !termsCheckbox.checked) {
    if (termsContainer) {
      termsContainer.classList.add("error");
    }
    alert("Por favor, leia e aceite os termos de uso antes de continuar.");
    termsCheckbox.focus();
    return;
  }

  if (termsContainer) {
    termsContainer.classList.remove("error");
  }

  // Monta o endereço completo
  let address = `${formData.street}, ${formData.neighborhood}, ${formData.number}`;
  if (formData.complement) {
    address += `, ${formData.complement}`;
  }

  // Monta a mensagem para o WhatsApp
  const currentDateTime = new Date().toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const message = `*NOVO AGENDAMENTO - ASCAM*

📅 *Data/Hora:* ${currentDateTime}

👤 *Nome:* ${formData.name}
♻️ *Material:* ${formData.material}
⚖️ *Peso Estimado:* ${formData.weight}
📍 *Endereço:* ${address}
📝 *Observação:* ${formData.observation || "Nenhuma"}

_Aguardamos a confirmação da coleta!_`;

  console.log("Mensagem montada:", message);

  // Remove caracteres não numéricos do número do WhatsApp
  const phoneDigits = whatsappNumber.replace(/\D/g, "");
  console.log("Número formatado:", phoneDigits);

  // Monta a URL do WhatsApp
  const whatsappUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    message
  )}`;
  console.log("URL do WhatsApp:", whatsappUrl);

  // Feedback visual
  const submitBtn = event.target.querySelector(".btn-submit");
  if (submitBtn) {
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-icon">✓</span> ENVIANDO...';
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-disabled", "true");

    // Abre o WhatsApp
    setTimeout(() => {
      console.log("Abrindo WhatsApp...");

      // Tenta abrir o WhatsApp
      const opened = window.open(whatsappUrl, "_blank");

      if (!opened || opened.closed || typeof opened.closed == "undefined") {
        // Se bloqueado por popup
        alert(
          "⚠️ Pop-up bloqueado!\n\nPor favor, permita pop-ups para este site ou clique OK para abrir o WhatsApp."
        );
        // Tenta redirecionamento direto
        window.location.href = whatsappUrl;
      }

      // Reseta o botão
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.setAttribute("aria-disabled", "false");

      // Limpa o formulário
      document.getElementById("agendamentoForm").reset();
      document.querySelectorAll(".input-wrapper.error").forEach((wrapper) => {
        wrapper.classList.remove("error");
      });
      const termsGroup = document.querySelector(".termos");
      if (termsGroup) {
        termsGroup.classList.remove("error");
      }

      updateSubmitState();

      // Mensagem de sucesso com instruções
      setTimeout(() => {
        alert(
          "✅ WhatsApp aberto!\n\n📱 IMPORTANTE: Clique no botão ENVIAR dentro do WhatsApp para completar seu agendamento.\n\nAguarde nosso retorno para confirmar a coleta."
        );
      }, 300);
    }, 500);
  }
}

// Efeito de scroll no header
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header-container");
  if (header) {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.15)";
    } else {
      header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    }

    lastScroll = currentScroll;
  }
});

// Animação ao scroll (aparecer elementos)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observar elementos para animação
document.addEventListener("DOMContentLoaded", () => {
  // Animações
  const animatedElements = document.querySelectorAll(
    ".material-card, .dica-card, .form-wrapper, .sobre-content"
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Adicionar event listener ao formulário
  const form = document.getElementById("agendamentoForm");
  if (form) {
    form.addEventListener("submit", submitForm);
    console.log("✅ Event listener adicionado ao formulário!");
  } else {
    console.error("❌ Formulário não encontrado!");
  }

  // Validação em tempo real dos campos
  const inputs = document.querySelectorAll(".form-input");

  inputs.forEach((input) => {
    const getWrapper = () => input.closest(".input-wrapper");
    const normalizeValue = () =>
      typeof input.value === "string" ? input.value.trim() : input.value;

    const validateRequired = () => {
      const wrapper = getWrapper();
      if (!wrapper) {
        return;
      }

      if (input.hasAttribute("required") && !normalizeValue()) {
        wrapper.classList.add("error");
      } else {
        wrapper.classList.remove("error");
      }
    };

    const clearError = () => {
      const wrapper = getWrapper();
      if (wrapper) {
        wrapper.classList.remove("error");
      }
    };

    input.addEventListener("blur", () => {
      validateRequired();
      updateSubmitState();
    });

    input.addEventListener("focus", () => {
      clearError();
    });

    input.addEventListener("input", () => {
      if (normalizeValue()) {
        clearError();
      }
      updateSubmitState();
    });

    input.addEventListener("change", () => {
      if (normalizeValue()) {
        clearError();
      }
      updateSubmitState();
    });
  });

  const termsCheckbox = document.getElementById("aceito");
  const termsGroup = document.querySelector(".termos");
  if (termsCheckbox && termsGroup) {
    termsCheckbox.addEventListener("change", () => {
      if (termsCheckbox.checked) {
        termsGroup.classList.remove("error");
      }
      updateSubmitState();
    });
  }

  updateSubmitState();
});

// Teste rápido do WhatsApp (apenas para debug)
console.log("✅ Script carregado! Número WhatsApp:", whatsappNumber);
