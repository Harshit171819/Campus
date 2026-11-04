(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const state = { events: [], registrations: [], category: 'all', query: '', page: 'explore', selectedEvent: null, authMode: 'signin', supabase: null, session: null };
  const colors = ['violet', 'mint', 'peach', 'blue'];
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const first = (obj, keys, fallback = '') => { for (const key of keys) if (obj?.[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key]; return fallback; };
  const titleOf = (event) => first(event, ['title', 'name', 'event_name'], 'Campus event');
  const descOf = (event) => first(event, ['description', 'details', 'summary'], 'Join your campus community for an event full of ideas, new connections, and good energy.');
  const dateOf = (event) => first(event, ['starts_at', 'start_at', 'event_date', 'date', 'start_time']);
  const imageOf = (event) => first(event, ['image_url', 'cover_image', 'banner_url', 'image', 'photo_url']);
  const categoryOf = (event) => first(event, ['category', 'type', 'tag'], 'Campus');
  const organizerOf = (event) => first(event, ['organizer_name', 'organizer', 'club_name', 'host'], 'CampusConnect');
  const formatDate = (value, withTime = true) => { if (!value) return 'Date to be announced'; const d = new Date(value); if (Number.isNaN(d.getTime())) return String(value); return new Intl.DateTimeFormat(undefined, withTime ? { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } : { month: 'short', day: 'numeric', year: 'numeric' }).format(d); };
  const isFree = (event) => { const value = first(event, ['price', 'cost', 'ticket_price'], ''); return event.is_free === true || String(value).toLowerCase() === 'free' || value === 0 || value === ''; };
  const eventId = (event) => first(event, ['id', 'event_id']);
  const imageMarkup = (event, extra = '') => imageOf(event) ? `<img class="${extra}" src="${escapeHtml(imageOf(event))}" alt="${escapeHtml(titleOf(event))}" loading="lazy">` : `<div class="cover-placeholder ${extra}" aria-hidden="true">${escapeHtml((titleOf(event).match(/[A-Z]/g) || ['✳']).slice(0, 2).join(''))}</div>`;
  const toast = (message) => { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2800); };
  const token = () => state.session?.access_token || '';
  async function api(path, options = {}) {
    const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...(options.headers || {}) };
    const response = await fetch(path, { ...options, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(body.error || `Request failed (${response.status})`); error.status = response.status; throw error; }
    return body;
  }
  function cardMarkup(event, index) {
    const id = eventId(event); const category = categoryOf(event); const price = first(event, ['price', 'cost', 'ticket_price']);
    return `<article class="event-card" tabindex="0" role="button" data-event-id="${escapeHtml(id)}" aria-label="View ${escapeHtml(titleOf(event))}">
      <div class="event-cover" data-tone="${colors[index % colors.length]}">${imageMarkup(event)}<span class="category-tag">${escapeHtml(category)}</span></div>
      <div class="event-body"><div class="event-meta"><span>${escapeHtml(formatDate(dateOf(event)))}</span><span class="date-dot">•</span><span>${escapeHtml(first(event, ['location', 'venue'], 'Campus'))}</span></div>
      <h3 class="event-title">${escapeHtml(titleOf(event))}</h3><p class="event-description">${escapeHtml(descOf(event))}</p>
      <div class="event-foot"><div class="organizer"><span class="organizer-avatar">${escapeHtml(organizerOf(event).slice(0, 1).toUpperCase())}</span><span>${escapeHtml(organizerOf(event))}</span></div><span class="price-tag ${!isFree(event) ? 'paid' : ''}">${isFree(event) ? 'Free' : escapeHtml(price ? `₹${price}` : 'Tickets')}</span></div></div></article>`;
  }
  function visibleEvents() {
    const now = new Date(); const endWeek = new Date(now); endWeek.setDate(now.getDate() + 7);
    return state.events.filter((event) => {
      const date = dateOf(event) ? new Date(dateOf(event)) : null;
      const matchesCategory = state.category === 'all' || (state.category === 'free' ? isFree(event) : state.category === 'today' ? date?.toDateString() === now.toDateString() : state.category === 'week' ? date && date >= now && date <= endWeek : categoryOf(event).toLowerCase() === state.category);
      const haystack = `${titleOf(event)} ${descOf(event)} ${categoryOf(event)} ${organizerOf(event)} ${first(event, ['location', 'venue'])}`.toLowerCase();
      return matchesCategory && haystack.includes(state.query.toLowerCase());
    });
  }
  function renderEvents() {
    const events = visibleEvents(); $('#events-grid').innerHTML = events.map(cardMarkup).join('');
    $('#event-count').textContent = `${events.length} ${events.length === 1 ? 'event' : 'events'} to explore`;
    $('#empty-state').classList.toggle('hidden', events.length > 0); $('#events-grid').classList.toggle('hidden', events.length === 0);
    document.querySelectorAll('.event-card').forEach((card) => {
      const open = () => showEvent(state.events.find((item) => String(eventId(item)) === card.dataset.eventId));
      card.addEventListener('click', open); card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
    });
  }
  async function loadEvents() {
    $('#events-grid').innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    try { state.events = await api('/api/events?limit=100'); renderEvents(); }
    catch (error) { $('#events-grid').innerHTML = `<div class="empty-registrations"><h3>We couldn’t load events</h3><p>${escapeHtml(error.message)}. Check that the backend is running and your events table has data.</p><button class="button button-outline" id="retry-events">Try again</button></div>`; $('#event-count').textContent = ''; $('#retry-events')?.addEventListener('click', loadEvents); }
  }
  function showEvent(event) {
    if (!event) return; state.selectedEvent = event; const price = first(event, ['price', 'cost', 'ticket_price']);
    $('#event-detail').innerHTML = `<div class="detail-cover">${imageMarkup(event)}</div><div class="detail-content"><span class="detail-category">${escapeHtml(categoryOf(event))}</span><h2>${escapeHtml(titleOf(event))}</h2><p class="detail-description">${escapeHtml(descOf(event))}</p>
      <div class="detail-facts"><div class="fact"><span>WHEN</span><strong>${escapeHtml(formatDate(dateOf(event)))}</strong></div><div class="fact"><span>WHERE</span><strong>${escapeHtml(first(event, ['location', 'venue'], 'Campus venue to be announced'))}</strong></div><div class="fact"><span>HOSTED BY</span><strong>${escapeHtml(organizerOf(event))}</strong></div><div class="fact"><span>ADMISSION</span><strong>${isFree(event) ? 'Free' : escapeHtml(price ? `₹${price}` : 'Paid admission')}</strong></div></div>
      <div class="detail-actions"><button id="register-button" class="button button-primary">${state.session ? 'Register for this event' : 'Sign in to register'} <span>→</span></button><button class="button button-outline" data-close>Maybe later</button></div></div>`;
    $('#register-button').addEventListener('click', registerForEvent); $('#event-dialog').showModal();
  }
  async function registerForEvent() {
    if (!state.session) { $('#event-dialog').close(); openAuth(); return; }
    const button = $('#register-button'); button.disabled = true; button.textContent = 'Saving your spot…';
    try { await api('/api/registrations', { method: 'POST', body: JSON.stringify({ event_id: eventId(state.selectedEvent) }) }); $('#event-dialog').close(); toast('You’re registered! See you there.'); await loadRegistrations(); }
    catch (error) { if (error.status === 409) toast('You’re already registered for this event.'); else toast(error.message); button.disabled = false; button.innerHTML = 'Register for this event <span>→</span>'; }
  }
  async function loadRegistrations() {
    const list = $('#registrations-list');
    if (!state.session) { list.innerHTML = `<div class="empty-registrations"><div class="empty-icon">✳</div><h3>Your next favorite event is waiting.</h3><p>Sign in to see your registrations and save your spot.</p><button class="button button-primary" id="registration-signin">Sign in</button></div>`; $('#registration-signin').addEventListener('click', openAuth); return; }
    list.innerHTML = '<div class="skeleton"></div>';
    try {
      const registrations = await api('/api/me/registrations'); state.registrations = await Promise.all(registrations.map(async (registration) => {
        const id = first(registration, ['event_id']); let event = state.events.find((item) => String(eventId(item)) === String(id));
        if (!event && id !== '') { try { event = await api(`/api/events/${encodeURIComponent(id)}`); } catch { event = null; } }
        return { registration, event };
      })); renderRegistrations();
    } catch (error) { list.innerHTML = `<div class="empty-registrations"><h3>Couldn’t load your registrations</h3><p>${escapeHtml(error.message)}</p></div>`; }
  }
  function renderRegistrations() {
    const list = $('#registrations-list');
    if (!state.registrations.length) { list.innerHTML = `<div class="empty-registrations"><div class="empty-icon">✳</div><h3>A little room for something great.</h3><p>You haven’t registered for any events yet. Your next campus memory is out there.</p><a href="#explore" class="button button-primary">Find an event</a></div>`; return; }
    list.innerHTML = state.registrations.map(({ registration, event }) => {
      const display = event || { title: 'Campus event', description: 'Event details are currently unavailable.', id: registration.event_id, starts_at: registration.created_at };
      return `<article class="registration-card" data-event-id="${escapeHtml(eventId(display))}" tabindex="0">${imageMarkup(display, 'registration-image')}<div class="registration-info"><h3>${escapeHtml(titleOf(display))}</h3><p>${escapeHtml(formatDate(dateOf(display)))}</p><p>${escapeHtml(first(display, ['location', 'venue'], 'Campus'))}</p></div><span class="registered-badge">✓ Registered</span></article>`;
    }).join('');
    list.querySelectorAll('.registration-card').forEach((card, i) => { const open = () => { const item = state.registrations[i]?.event; if (item) showEvent(item); }; card.addEventListener('click', open); card.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); }); });
  }
  function setPage(page) {
    state.page = page; $('#explore-page').classList.toggle('hidden', page !== 'explore'); $('#registrations-page').classList.toggle('hidden', page !== 'registrations');
    document.querySelectorAll('.nav-link').forEach((link) => { link.classList.toggle('active', link.dataset.page === page); if (link.dataset.page === page) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
    if (page === 'registrations') loadRegistrations(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function syncPage() { setPage(location.hash === '#registrations' ? 'registrations' : 'explore'); }
  function openAuth(mode = 'signin') { state.authMode = mode; $('#auth-title').textContent = mode === 'signin' ? 'Good to see you.' : 'Come on in.'; $('#auth-copy').textContent = mode === 'signin' ? 'Sign in to save your spot at the events you love.' : 'Create an account and find your campus community.'; $('#auth-submit').textContent = mode === 'signin' ? 'Sign in' : 'Create account'; $('#auth-switch-text').textContent = mode === 'signin' ? 'New to CampusConnect?' : 'Already have an account?'; $('#auth-switch').textContent = mode === 'signin' ? 'Create an account' : 'Sign in'; $('#auth-error').textContent = ''; $('#auth-dialog').showModal(); }
  function updateAccount() { $('#account-label').textContent = state.session?.user?.email || 'Guest'; $('#auth-button').textContent = state.session ? 'Sign out' : 'Sign in'; }
  async function initAuth() {
    try {
      const config = await api('/api/config');
      if (!window.supabase?.createClient) throw new Error('Sign-in library did not load.');
      state.supabase = window.supabase.createClient(config.supabase_url, config.supabase_publishable_key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
      const { data } = await state.supabase.auth.getSession(); state.session = data.session; updateAccount();
      state.supabase.auth.onAuthStateChange((_event, session) => { state.session = session; updateAccount(); if (state.page === 'registrations') loadRegistrations(); if ($('#event-dialog').open && state.selectedEvent) showEvent(state.selectedEvent); });
    } catch (error) { console.warn('Supabase sign-in is not ready:', error.message); $('#auth-button').title = 'Configure Supabase auth to sign in'; }
  }
  async function submitAuth(event) {
    event.preventDefault(); const email = $('#auth-email').value.trim(); const password = $('#auth-password').value; const button = $('#auth-submit'); button.disabled = true; $('#auth-error').textContent = '';
    try {
      if (!state.supabase) throw new Error('Sign-in is unavailable. Check the Supabase client configuration.');
      const result = state.authMode === 'signin' ? await state.supabase.auth.signInWithPassword({ email, password }) : await state.supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      state.session = result.data.session; updateAccount(); $('#auth-dialog').close(); $('#auth-form').reset();
      if (state.authMode === 'signup' && !state.session) toast('Check your email to confirm your account.'); else toast(state.authMode === 'signin' ? 'Welcome back!' : 'Your account is ready.');
      if (state.page === 'registrations') loadRegistrations(); if ($('#event-dialog').open && state.session) showEvent(state.selectedEvent);
    } catch (error) { $('#auth-error').textContent = error.message || 'Could not sign in.'; } finally { button.disabled = false; }
  }
  function bind() {
    document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => setTimeout(syncPage, 0)));
    window.addEventListener('hashchange', syncPage); $('#search-input').addEventListener('input', (event) => { state.query = event.target.value.trim(); renderEvents(); });
    $('#filters').addEventListener('click', (event) => { const button = event.target.closest('[data-category]'); if (!button) return; state.category = button.dataset.category; document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button)); renderEvents(); });
    $('#clear-filters').addEventListener('click', () => { state.category = 'all'; state.query = ''; $('#search-input').value = ''; document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item.dataset.category === 'all')); renderEvents(); });
    document.body.addEventListener('click', (event) => { if (event.target.closest('[data-close]')) event.target.closest('dialog')?.close(); });
    $('#auth-button').addEventListener('click', async () => { if (state.session) { await state.supabase?.auth.signOut(); state.session = null; updateAccount(); toast('You’ve signed out.'); if (state.page === 'registrations') loadRegistrations(); } else openAuth(); });
    $('#auth-form').addEventListener('submit', submitAuth); $('#auth-switch').addEventListener('click', () => openAuth(state.authMode === 'signin' ? 'signup' : 'signin'));
    document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#search-input').focus(); } });
  }
  bind(); initAuth(); loadEvents(); syncPage();
})();
