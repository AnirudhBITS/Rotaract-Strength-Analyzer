const API_URL = import.meta.env.VITE_API_URL || 'https://rotaract3234strengthanalyser-backend.blackitechs.org/api';
const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
};

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(method, path, body, options = {}) {
  const url = path.startsWith('http') ? path : API_URL + path;
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const config = { method, headers };

  if (body instanceof FormData) {
    config.body = body;
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);

  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    }
    throw { response: { status: 401, data: { error: 'Unauthorized' } } };
  }

  if (options.responseType === 'arraybuffer') {
    const buffer = await res.arrayBuffer();
    if (!res.ok) throw { response: { status: res.status, data: {} } };
    return { data: buffer, status: res.status };
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { response: { status: res.status, data }, message: data.error || 'Request failed' };
  }

  return { data, status: res.status };
}

function buildQuery(params) {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
}

export const applicationApi = {
  getQuestions: () => request('GET', '/application/questions'),
  getPositions: () => request('GET', '/application/positions'),
  getClubs: () => request('GET', '/application/clubs'),
  checkDuplicate: (data) => request('POST', '/application/check-duplicate', data),
  sendOTP: (data) => request('POST', '/application/send-otp', data),
  verifyOTP: (data) => request('POST', '/application/verify-otp', data),
  submit: (data) => request('POST', '/application/submit', data),
};

export const uploadApi = {
  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return request('POST', '/upload/photo', formData);
  },
};

export const adminApi = {
  login: (credentials) => request('POST', '/admin/login', credentials),
  getDashboard: () => request('GET', '/admin/dashboard'),
  getApplicants: (params) => request('GET', '/admin/applicants' + buildQuery(params)),
  getApplicant: (id) => request('GET', '/admin/applicants/' + id),
  updateStatus: (id, data) => request('PATCH', '/admin/applicants/' + id + '/status', data),
  exportAll: () => request('GET', '/admin/export', null, { responseType: 'arraybuffer' }),
};

export const allocationApi = {
  getPositions: () => request('GET', '/allocation/positions'),
  getSummary: () => request('GET', '/allocation/summary'),
  getCandidates: (positionId) => request('GET', '/allocation/positions/' + positionId + '/candidates'),
  allocate: (positionId, data) => request('POST', '/allocation/positions/' + positionId + '/allocate', data),
  deallocate: (positionId, applicantId) => request('DELETE', '/allocation/positions/' + positionId + '/deallocate/' + applicantId),
  searchApplicants: (q) => request('GET', '/allocation/search-applicants?q=' + encodeURIComponent(q)),
  getUnallocated: () => request('GET', '/allocation/unallocated-applicants'),
};
