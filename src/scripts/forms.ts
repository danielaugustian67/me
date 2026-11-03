/** Posts to the configured endpoint, or opens the visitor's mail app when there is none. */
export function initForms() {
  const talk = document.querySelector<HTMLFormElement>('[data-talk]');
  if (talk) {
    const status = talk.querySelector('[data-talk-status]')!;
    talk.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(talk);
      const endpoint = talk.dataset.endpoint;
      if (!endpoint) {
        const body = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join('\n');
        location.href = `mailto:${talk.dataset.email}?subject=${encodeURIComponent('New project enquiry')}&body=${encodeURIComponent(body)}`;
        return;
      }
      status.textContent = 'Sending…';
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        talk.reset();
        status.textContent = 'Thanks! Your message is on its way.';
      } catch {
        status.textContent = `Something went wrong. Please email ${talk.dataset.email} instead.`;
      }
    });
  }

  for (const form of document.querySelectorAll<HTMLFormElement>('[data-newsletter]')) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = new FormData(form).get('email');
      location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Newsletter')}&body=${encodeURIComponent(`Please add ${email} to your list.`)}`;
    });
  }
}
