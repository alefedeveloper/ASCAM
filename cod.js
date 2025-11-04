const whatsappNumber = "+5531999228922";

// Garantir que as funções estejam disponíveis globalmente
window.scrollToSection = scrollToSection;
window.scrollToForm = scrollToForm;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.submitForm = submitForm;

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
    alert("Por favor, preencha seu nome.");
    document.getElementById("name").focus();
    return;
  }

  if (!formData.material) {
    alert("Por favor, selecione o tipo de material.");
    document.getElementById("material").focus();
    return;
  }

  if (!formData.weight) {
    alert("Por favor, selecione o peso estimado.");
    document.getElementById("weight").focus();
    return;
  }

  if (!formData.street) {
    alert("Por favor, preencha o nome da rua.");
    document.getElementById("street").focus();
    return;
  }

  if (!formData.neighborhood) {
    alert("Por favor, preencha o bairro.");
    document.getElementById("neighborhood").focus();
    return;
  }

  if (!formData.number) {
    alert("Por favor, preencha o número.");
    document.getElementById("number").focus();
    return;
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

      // Limpa o formulário
      document.getElementById("agendamentoForm").reset();

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
    input.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderColor = "#dc2626";
      } else {
        this.style.borderColor = "#e0e0e0";
      }
    });

    input.addEventListener("focus", function () {
      this.style.borderColor = "#228b22";
    });
  });
});

// Teste rápido do WhatsApp (apenas para debug)
console.log("✅ Script carregado! Número WhatsApp:", whatsappNumber);
