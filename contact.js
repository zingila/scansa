// Scansa · page contact
// Même branchement que la v1 : envoi AJAX vers Formspree (action du formulaire).

function showNotification(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  if (type === 'success') notification.classList.add('success');

  document.body.appendChild(notification);
  requestAnimationFrame(() => notification.classList.add('show'));

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        emailInput.setCustomValidity('Veuillez entrer une adresse email valide');
      } else {
        emailInput.setCustomValidity('');
      }
    });
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification('Veuillez remplir tous les champs requis');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showNotification('Message envoyé avec succès ! Nous vous répondrons prochainement.', 'success');
        contactForm.reset();
      } else {
        const errorData = await response.json();
        if (Object.hasOwn(errorData, 'errors')) {
          showNotification(errorData.errors.map(err => err.message).join(', '));
        } else {
          showNotification('Oups ! Une erreur est survenue lors de l\'envoi.');
        }
      }
    } catch (error) {
      showNotification('Oups ! Une erreur réseau est survenue.');
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', initContactForm);
