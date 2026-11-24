import { useMemo } from 'react';
import { Image as ExpoImage, type ImageSource } from 'expo-image';
import { Image, type ImageProps } from 'react-native';
import {
  currentAccessToken,
  isTrustedApiImageUrl,
  usePrivateReadScope,
} from '../api';
import {
  invalidatePrivateImageGeneration,
  usePrivateImageGeneration,
} from './private-image-cache';

export function clearPrivateImageCache() {
  void ExpoImage.clearMemoryCache().catch(() => {});
  invalidatePrivateImageGeneration();
}

type ApiImageProps = ImageProps & {
  retainInMemory?: boolean;
  onImageLoad?: () => void;
};

export function ApiImage({
  source,
  retainInMemory = true,
  onImageLoad,
  onLoad,
  ...props
}: ApiImageProps) {
  const scope = usePrivateReadScope();
  const generation = usePrivateImageGeneration();
  const token = currentAccessToken();
  const uri =
    source &&
    typeof source === 'object' &&
    'headers' in source &&
    source.headers
      ? source.uri
      : undefined;
  const authorizedSource = useMemo<ImageSource | undefined>(
    () =>
      uri && token && scope && isTrustedApiImageUrl(uri)
        ? {
            uri,
            cacheKey: JSON.stringify([generation, scope, uri]),
            headers: { Authorization: `Bearer ${token}` },
          }
        : undefined,
    [uri, token, scope, generation],
  );

  const handleLoad: ImageProps['onLoad'] = (event) => {
    onLoad?.(event);
    onImageLoad?.();
  };
  if (!uri) return <Image source={source} {...props} onLoad={handleLoad} />;

  return (
    <ExpoImage
      source={authorizedSource}
      cachePolicy={retainInMemory ? 'memory' : 'none'}
      recyclingKey={authorizedSource?.cacheKey ?? ''}
      key={authorizedSource?.cacheKey}
      contentFit={
        props.resizeMode === 'stretch'
          ? 'fill'
          : props.resizeMode === 'center' || props.resizeMode === 'repeat'
            ? 'none'
            : (props.resizeMode ?? 'cover')
      }
      style={props.style}
      accessibilityLabel={props.accessibilityLabel}
      onLoad={onImageLoad}
    />
  );
}
