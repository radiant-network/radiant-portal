const globalData = {
  Authorization: {
    token: null, // Will be set by initializeGlobalData
  },
  BatchesId: {
    patientPending: '19cc572a-1472-4081-92d5-4edab37d35c9',
    patientNotFound: '19cc572a-1472-4081-92d5-4edab37d35c0',
  },
};

function getGlobalData() {
  return globalData;
}

export default {
  getGlobalData,
  globalData,
};
