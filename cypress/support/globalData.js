const globalData = {
  Authorization: {
    token: null, // Will be set by initializeGlobalData
  },
  BatchesId: {
    patientPending: '760b1d91-7c9e-427a-8fcf-c08de7fd6aa2',
    patientNotFound: '00000000-0000-0000-0000-000000000000',
  },
};

function getGlobalData() {
  return globalData;
}

export default {
  getGlobalData,
  globalData,
};
