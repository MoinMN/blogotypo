// Helper to get current IST time
const getISTTime = () => {
  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  return new Date(utc + istOffset);
};

export default getISTTime;