const state = {
  user: JSON.parse(localStorage.getItem('turnos_user') || 'null'),
  professionals: [],
};

const $ = (selector) => document.querySelector(selector);

const els = {
  message: $('#message'),
  sessionText: $('#sessionText'),
  roleLabel: $('#roleLabel'),
  logoutButton: $('#logoutButton'),
  loginForm: $('#loginForm'),
  registerForm: $('#registerForm'),
  professionalForm: $('#professionalForm'),
  appointmentForm: $('#appointmentForm'),
  professionalSelect: $('#professionalSelect'),
  professionalsList: $('#professionalsList'),
  myAppointmentsList: $('#myAppointmentsList'),
  adminAppointmentsList: $('#adminAppointmentsList'),
  loadMineButton: $('#loadMineButton'),
  filterSpecialty: $('#filterSpecialty'),
  filterProfessional: $('#filterProfessional'),
  filterStatus: $('#filterStatus'),
};

const formToObject = (form) => Object.fromEntries(new FormData(form).entries());

const showMessage = (text, type = 'success') => {
  els.message.textContent = text;
  els.message.classList.toggle('error', type === 'error');
  els.message.classList.remove('hidden');

  window.clearTimeout(showMessage.timeout);
  showMessage.timeout = window.setTimeout(() => {
    els.message.classList.add('hidden');
  }, 4200);
};

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    const validation = data.errors?.map((error) => error.message).join(', ');
    throw new Error(validation || data.message || 'No se pudo completar la accion');
  }

  return data;
};

const saveUser = (user) => {
  state.user = user;
  localStorage.setItem('turnos_user', JSON.stringify(user));
  renderSession();
};

const clearUser = () => {
  state.user = null;
  localStorage.removeItem('turnos_user');
  renderSession();
};

const renderSession = () => {
  document.body.classList.remove('is-authenticated', 'role-paciente', 'role-admin');

  if (!state.user) {
    els.sessionText.textContent = 'Sin sesion';
    els.roleLabel.classList.add('hidden');
    els.logoutButton.classList.add('hidden');
    return;
  }

  document.body.classList.add('is-authenticated');
  document.body.classList.add(`role-${state.user.role}`);
  els.sessionText.textContent = `${state.user.email || state.user.id} - ${state.user.role}`;
  els.roleLabel.classList.toggle('hidden', state.user.role !== 'admin');
  els.logoutButton.classList.remove('hidden');
};

const formatDate = (value) => new Intl.DateTimeFormat('es-AR').format(new Date(value));

const professionalName = (professional) => {
  if (!professional) return 'Sin profesional';
  if (typeof professional === 'string') return professional;
  return professional.name || 'Sin profesional';
};

const renderProfessionals = (professionals) => {
  if (!professionals.length) {
    els.professionalsList.innerHTML = '<div class="empty">No hay profesionales cargados.</div>';
    return;
  }

  const isAdmin = state.user?.role === 'admin';

  els.professionalsList.innerHTML = professionals
    .map(
      (professional) => `
        <article class="card">
          <h3>${professional.name}</h3>
          <p><strong>Especialidad:</strong> ${professional.specialty}</p>
          <p><strong>Email:</strong> ${professional.email}</p>
          <p><strong>Telefono:</strong> ${professional.phone || 'Sin telefono'}</p>
          <p class="muted">ID: ${professional._id}</p>
          ${
            isAdmin
              ? `<button class="danger-button" type="button" data-delete-professional="${professional._id}">Eliminar profesional</button>`
              : ''
          }
        </article>
      `
    )
    .join('');
};

const renderProfessionalOptions = (professionals) => {
  els.professionalSelect.innerHTML = '<option value="">Seleccionar profesional</option>';

  professionals.forEach((professional) => {
    const option = document.createElement('option');
    option.value = professional._id;
    option.textContent = `${professional.name} - ${professional.specialty}`;
    els.professionalSelect.appendChild(option);
  });
};

const loadProfessionals = async () => {
  const result = await api('/api/professionals');
  state.professionals = result.data;
  renderProfessionals(result.data);
  renderProfessionalOptions(result.data);
};

const appointmentCard = (appointment, isAdmin = false) => {
  const patient = appointment.patient?.name ? `<p><strong>Paciente:</strong> ${appointment.patient.name}</p>` : '';
  const notes = appointment.notes ? `<p><strong>Notas:</strong> ${appointment.notes}</p>` : '';

  return `
    <article class="card">
      <div class="appointment-top">
        <div>
          <h3>${appointment.specialty}</h3>
          <p><strong>Profesional:</strong> ${professionalName(appointment.professional)}</p>
          ${patient}
          <p><strong>Fecha:</strong> ${formatDate(appointment.date)}</p>
          <p><strong>Hora:</strong> ${appointment.time}</p>
          ${notes}
        </div>
        <span class="badge ${appointment.status}">${appointment.status}</span>
      </div>
      ${
        isAdmin
          ? `<div class="appointment-actions">
              <select data-status-id="${appointment._id}">
                <option value="pendiente" ${appointment.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="confirmado" ${appointment.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                <option value="cancelado" ${appointment.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
              </select>
              <button class="secondary" type="button" data-delete-id="${appointment._id}">Eliminar</button>
            </div>`
          : ''
      }
    </article>
  `;
};

const renderAppointments = (container, appointments, isAdmin = false) => {
  if (!appointments.length) {
    container.innerHTML = '<div class="empty">No hay turnos para mostrar.</div>';
    return;
  }

  container.innerHTML = appointments.map((appointment) => appointmentCard(appointment, isAdmin)).join('');
};

const loadMyAppointments = async () => {
  const result = await api('/api/appointments/me');
  renderAppointments(els.myAppointmentsList, result.data);
};

const loadAdminAppointments = async () => {
  const params = new URLSearchParams();

  if (els.filterSpecialty.value) params.set('specialty', els.filterSpecialty.value);
  if (els.filterProfessional.value) params.set('professional', els.filterProfessional.value);
  if (els.filterStatus.value) params.set('status', els.filterStatus.value);

  const query = params.toString();
  const result = await api(`/api/appointments${query ? `?${query}` : ''}`);
  renderAppointments(els.adminAppointmentsList, result.data, true);
};

els.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const result = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(formToObject(els.loginForm)),
    });

    saveUser(result.data.user);
    els.loginForm.reset();
    showMessage('Sesion iniciada correctamente.');
    await loadProfessionals();
    if (result.data.user.role === 'paciente') {
      await loadMyAppointments();
    }
    if (result.data.user.role === 'admin') {
      await loadAdminAppointments();
    }
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

els.registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = { ...formToObject(els.registerForm), role: 'paciente' };
    const result = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    saveUser(result.data.user);
    els.registerForm.reset();
    showMessage('Paciente registrado correctamente.');
    await loadProfessionals();
    await loadMyAppointments();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

els.logoutButton.addEventListener('click', async () => {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } finally {
    clearUser();
    showMessage('Sesion cerrada.');
  }
});

els.professionalsList.addEventListener('click', async (event) => {
  const id = event.target.dataset.deleteProfessional;
  if (!id) return;

  try {
    await api(`/api/professionals/${id}`, {
      method: 'DELETE',
    });

    showMessage('Profesional eliminado correctamente.');
    await loadProfessionals();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

els.loadMineButton.addEventListener('click', () => {
  loadMyAppointments().catch((error) => showMessage(error.message, 'error'));
});

els.appointmentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    await api('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(formToObject(els.appointmentForm)),
    });

    els.appointmentForm.reset();
    showMessage('Turno creado correctamente.');
    await loadMyAppointments();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

els.professionalForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = formToObject(els.professionalForm);
    payload.availableDays = payload.availableDays
      ? payload.availableDays.split(',').map((day) => day.trim()).filter(Boolean)
      : [];

    await api('/api/professionals', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    els.professionalForm.reset();
    showMessage('Profesional creado correctamente.');
    await loadProfessionals();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

els.filterSpecialty.addEventListener('input', () => {
  loadAdminAppointments().catch(() => {});
});

els.filterProfessional.addEventListener('input', () => {
  loadAdminAppointments().catch(() => {});
});

els.filterStatus.addEventListener('change', () => {
  loadAdminAppointments().catch(() => {});
});

els.adminAppointmentsList.addEventListener('change', async (event) => {
  const id = event.target.dataset.statusId;
  if (!id) return;

  try {
    await api(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: event.target.value }),
    });
    showMessage('Estado actualizado.');
    await loadAdminAppointments();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

els.adminAppointmentsList.addEventListener('click', async (event) => {
  const id = event.target.dataset.deleteId;
  if (!id) return;

  try {
    await api(`/api/appointments/${id}`, { method: 'DELETE' });
    showMessage('Turno eliminado.');
    await loadAdminAppointments();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

renderSession();
loadProfessionals().catch(() => {});
