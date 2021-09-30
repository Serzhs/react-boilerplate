import convertSecondsToHHMMSS from './convertSecondsToHHMMSS';

describe('convertSecondsToHHMMSS', () => {
  it('should return minutes and seconds', () => {
    const result = convertSecondsToHHMMSS(2000);

    expect(result).toEqual('33:20');
  });

  it('should return hours, minutes and seconds', () => {
    const result = convertSecondsToHHMMSS(20000);

    expect(result).toEqual('05:33:20');
  });
});
