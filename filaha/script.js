const langButton = document.querySelector('.lang-button');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

langButton.addEventListener('click', () => {
  const french = document.body.classList.toggle('lang-fr');
  document.documentElement.lang = french ? 'fr' : 'ar';
  document.documentElement.dir = french ? 'ltr' : 'rtl';
  document.querySelector('.lang-active').textContent = french ? 'FR' : 'AR';

  document.querySelectorAll('[data-ar][data-fr]').forEach((element) => {
    element.textContent = french ? element.dataset.fr : element.dataset.ar;
  });

  const name = document.querySelector('#name');
  const phone = document.querySelector('#phone');
  const message = document.querySelector('#message');
  name.placeholder = french ? 'Votre nom complet' : 'اكتب اسمك';
  phone.placeholder = french ? 'Numéro de téléphone' : '0550 00 00 00';
  message.placeholder = french ? 'Décrivez votre projet' : 'اشرح مختصرًا فكرة المشروع أو النشاط المطلوب';
});

document.querySelector('#contact-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type="submit"]');
  const payload = Object.fromEntries(new FormData(form));
  submit.disabled = true;

  try {
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    status.textContent = document.documentElement.lang === 'fr'
      ? 'Votre demande a été enregistrée.'
      : 'تم تسجيل طلبكم بنجاح.';
    form.reset();
  } catch (error) {
    status.textContent = document.documentElement.lang === 'fr'
      ? 'Impossible d’envoyer le formulaire. Vous pouvez nous contacter via Facebook.'
      : 'تعذر إرسال الطلب. يمكنكم التواصل معنا عبر فيسبوك.';
  } finally {
    submit.disabled = false;
  }
});
