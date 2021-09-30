const convertSecondsToHHMMSS = (seconds: number) => {
  const time = new Date(seconds * 1000).toISOString();

  if (seconds < 3600) {
    return time.substr(14, 5);
  }

  return time.substr(11, 8);
};

export default convertSecondsToHHMMSS;
