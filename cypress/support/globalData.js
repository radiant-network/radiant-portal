const globalData = {
  Authorization: {
    token: null, // Will be set by initializeGlobalData
  },
};

function getGlobalData() {
  return globalData;
}

export default {
  getGlobalData,
  globalData,
};
