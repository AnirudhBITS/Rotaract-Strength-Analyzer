const API_URL = import.meta.env.VITE_API_URL || 'https://rotaract3234strengthanalyser-backend.blackitechs.org/api';
const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('data:')) return path;
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
};

// Use the global __api function defined in index.html (works on mobile)
async function request(method, path, body, options = {}) {
  const res = await window.__api(method, path, body);

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
  deleteApplicant: (id) => request('DELETE', '/admin/applicants/' + id),
  sendBulkEmail: () => request('POST', '/admin/send-bulk-email'),
};

export const allocationApi = {
  getPositions: () => request('GET', '/allocation/positions'),
  getSummary: () => request('GET', '/allocation/summary'),
  getCandidates: (positionId) => request('GET', '/allocation/positions/' + positionId + '/candidates'),
  allocate: (positionId, data) => request('POST', '/allocation/positions/' + positionId + '/allocate', data),
  deallocate: (positionId, applicantId) => request('DELETE', '/allocation/positions/' + positionId + '/deallocate/' + applicantId),
  searchApplicants: (q) => request('GET', '/allocation/search-applicants?q=' + encodeURIComponent(q)),
  exportPositionCandidates: (positionId) => request('GET', '/allocation/positions/' + positionId + '/export', null, { responseType: 'arraybuffer' }),
  scheduleMeeting: (data) => request('POST', '/allocation/schedule-meeting', data),
  getUnallocated: () => request('GET', '/allocation/unallocated-applicants'),
  getAllAllocations: () => request('GET', '/allocation/all-allocations'),
  confirmAllocation: (allocationId) => request('POST', '/allocation/confirm/' + allocationId),
  removeConfirmation: (allocationId) => request('DELETE', '/allocation/confirm/' + allocationId),
  getFinalisedOfficials: (params) => request('GET', '/allocation/finalised' + buildQuery(params)),
  exportFinalisedOfficials: (params) => request('GET', '/allocation/finalised/export' + buildQuery(params), null, { responseType: 'arraybuffer' }),
};
