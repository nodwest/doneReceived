import { describe, expect, it } from 'vitest';
import { API_URL } from '../config';
import { authorizedImage, isTrustedApiImageUrl } from './http';

describe('private image sources', () => {
  it('marks API images without putting credentials in the source', () => {
    const source = authorizedImage('/users/avatars/example');
    expect(source).toEqual({
      uri: API_URL + '/users/avatars/example',
      headers: {},
    });
    expect(isTrustedApiImageUrl(source.uri)).toBe(true);
  });

  it('rejects a different origin, URL userinfo, and non-HTTP URLs', () => {
    const api = new URL(API_URL);
    expect(
      authorizedImage('https://external.invalid/photo').headers,
    ).toBeUndefined();
    expect(
      isTrustedApiImageUrl(`${api.protocol}//other@${api.host}/photo`),
    ).toBe(false);
    expect(isTrustedApiImageUrl('file:///photo.png')).toBe(false);
  });
});
