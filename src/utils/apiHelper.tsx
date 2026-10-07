import { Storage } from '@ionic/storage';

const store = new Storage();
let storageInitialized = false;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiKey = '86556c5a3e15475962aa181be0c9bc18';

const ensureStorage = async () => {
  if (!storageInitialized) {
    await store.create();
    storageInitialized = true;
  }
};

// const encodeData = (data: object) => {
//   return btoa(JSON.stringify(data));
// };

// ---- AUTH ----

const login = async (email: string, password: string) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('email', email);
  urlencoded.append('password', password);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  const data = await fetch(`${API_BASE_URL}/login?apikey=${apiKey}`, requestOptions)
    .then((response) => response.json())
    .then(async (result) => {
      if (result.type === 'success') {
        await ensureStorage();
        // TODO: confirm actual field name once you share api_authentication_login()
        await store.set('access_token', result.data?.accesstoken ?? result.accesstoken);
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return { type: 'error', message: 'Network error' };
    });

  return data;
};

const checkToken = async () => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const result = await fetch(
    `${API_BASE_URL}/checktoken?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => result.type === 'success')
    .catch(() => false);

  return result;
};

const logout = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  await fetch(`${API_BASE_URL}/logout?accesstoken=${access_token}&apikey=${apiKey}`)
    .catch((error) => console.log('error', error));

  await store.remove('access_token');
  history.push('/login');
};

// ---- ATTENDANCE ----

const viewAttendance = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/viewattendance?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const addTimeIn = async (history: any, payload: { type: string; location: string; reason: string }) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('data', btoa(JSON.stringify(payload)));

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  const data = await fetch(
    `${API_BASE_URL}/addtimein?type=${payload.type}&accesstoken=${access_token}&apikey=${apiKey}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const addTimeOut = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/addtimeout?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'POST' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const viewAttendanceMonthly = async (history: any, month: string, year: string) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/viewattendancemonthly?accesstoken=${access_token}&apikey=${apiKey}&month=${month}&year=${year}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const getCheckInOut = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/getcheckinout?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

// ---- JUSTIFICATION ----

const viewAllJustification = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/viewalljustification?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const addJustification = async (history: any, attendanceId: string, justificationText: string) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('data', btoa(JSON.stringify({ justification: justificationText })));

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  const data = await fetch(
    `${API_BASE_URL}/addjustification?id=${attendanceId}&accesstoken=${access_token}&apikey=${apiKey}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

// ---- WHEREABOUTS ----

const viewWhereabout = async (history: any, date: string) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/viewwhereabout?accesstoken=${access_token}&apikey=${apiKey}&date=${date}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

// ---- LEAVE ----

const addLeave = async (
  history: any,
  payload: {
    fldDatefrom: string;
    fldDateto: string;
    fldHalfday: string;
    fldHalfdaysession: string;
    fldReason: string;
    fldType: string;
  }
) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('data', btoa(JSON.stringify(payload)));

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  const data = await fetch(
    `${API_BASE_URL}/addleave?accesstoken=${access_token}&apikey=${apiKey}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const deleteLeave = async (history: any, id: string) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/deleteleave?accesstoken=${access_token}&apikey=${apiKey}&id=${encodeURIComponent(id)}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const viewLeave = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/viewleave?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

const getFuturePlans = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/getfutureplans?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

// ---- PROFILE ----

const viewUserProfile = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/viewuserprofile?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

// ---- NOTIFICATION ----

const viewNotification = async (history: any) => {
  await ensureStorage();
  const access_token = await store.get('access_token');

  const data = await fetch(
    `${API_BASE_URL}/viewnotification?accesstoken=${access_token}&apikey=${apiKey}`,
    { method: 'GET' }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.type === 'error' && result.message === 'Invalid Access Token') {
        store.remove('access_token');
        history.push('/login');
        return null;
      }
      return result;
    })
    .catch((error) => {
      console.log('error', error);
      return null;
    });

  return data;
};

export {
  login,
  logout,
  checkToken,
  addTimeIn,
  addTimeOut,
  viewAttendance,
  viewAttendanceMonthly,
  viewAllJustification,
  addJustification,
  viewWhereabout,
  getCheckInOut,
  addLeave,
  deleteLeave,
  viewLeave,
  getFuturePlans,
  viewUserProfile,
  viewNotification,
};