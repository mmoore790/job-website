const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
const enquiryForm = document.getElementById('enquiry-form');
const formFeedback = document.querySelector('.form-feedback');
const yearEl = document.getElementById('current-year');

const setNavState = (expanded) => {
  navToggle.setAttribute('aria-expanded', expanded.toString());
  navMenu.setAttribute('aria-hidden', (!expanded).toString());
};

if (navToggle && navMenu) {
  setNavState(false);

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setNavState(!expanded);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        setNavState(false);
      }
    });
  });
}

const validateForm = (form) => {
  const formData = new FormData(form);
  const entries = Object.fromEntries(formData.entries());
  const errors = [];

  if (!entries.name || entries.name.trim().length < 2) {
    errors.push('Please enter your full name.');
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!entries.email || !emailPattern.test(entries.email)) {
    errors.push('Please enter a valid work email.');
  }

  if (!entries.company || entries.company.trim().length < 2) {
    errors.push('Please tell us your company name.');
  }

  if (!entries.teamSize) {
    errors.push('Select your team size.');
  }

  if (!form.querySelector('#consent').checked) {
    errors.push('Please accept the consent checkbox.');
  }

  return { entries, errors };
};

if (enquiryForm && formFeedback) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formFeedback.textContent = '';
    formFeedback.style.color = 'var(--color-secondary)';

    const { errors } = validateForm(enquiryForm);

    if (errors.length) {
      formFeedback.textContent = errors[0];
      formFeedback.style.color = '#ff9494';
      return;
    }

    formFeedback.textContent = 'Thanks! A product specialist will reach out shortly.';
    enquiryForm.reset();
    setTimeout(() => {
      formFeedback.textContent = '';
    }, 6000);
  });
}

if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}
