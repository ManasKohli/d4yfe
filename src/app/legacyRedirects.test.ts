import { getLegacyRedirect, programDetailsRedirect } from '@/app/legacyRedirects';

describe('getLegacyRedirect', () => {
  it.each([
    ['#module-01', '/modules/applicant-strategy'],
    ['#module-02', '/modules/casper'],
    ['#module-05', '/modules/final-check-in'],
    ['#module-09', '/#modules'],
    ['#approach', '/#how-it-works'],
    ['#program-model', '/how-it-works'],
    ['#goals', '/how-it-works'],
    ['#community', '/mentors#community'],
    ['#module-00', '/#modules'],
    ['#home', '/'],
    ['#application-support', '/#modules'],
  ])('maps %s to %s', (hash, target) => {
    expect(getLegacyRedirect('/', hash)).toBe(target);
  });

  it('leaves current section anchors alone', () => {
    expect(getLegacyRedirect('/', '#modules')).toBeNull();
  });

  it('ignores unknown hashes, including built-in object keys', () => {
    expect(getLegacyRedirect('/', '#not-a-section')).toBeNull();
    expect(getLegacyRedirect('/', '#constructor')).toBeNull();
    expect(getLegacyRedirect('/', '#__proto__')).toBeNull();
  });

  it('only redirects from the home page', () => {
    expect(getLegacyRedirect('/program-details', '#module-02')).toBeNull();
    expect(getLegacyRedirect('/', '')).toBeNull();
  });
});

describe('programDetailsRedirect', () => {
  it.each([
    ['#options', '/packages'],
    ['#pilot', '/packages#pilot'],
    ['#mentors', '/mentors'],
    ['#community', '/mentors#community'],
    ['#how-it-works', '/how-it-works'],
    ['#goals', '/how-it-works'],
    ['', '/how-it-works'],
    ['#__proto__', '/how-it-works'],
  ])('maps /program-details%s to %s', (hash, target) => {
    expect(programDetailsRedirect(hash)).toBe(target);
  });
});
