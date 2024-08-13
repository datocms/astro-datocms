const bogusBaseUrl = 'https://example.com/';

export const buildSrcSet = (
  src: string | null | undefined,
  width: number | undefined,
  candidateMultipliers: number[],
) => {
  if (!(src && width)) {
    return undefined;
  }

  return (candidateMultipliers || [])
    .map((multiplier) => {
      const url = new URL(src, bogusBaseUrl);

      if (multiplier !== 1) {
        url.searchParams.set('dpr', `${multiplier}`);
        const maxH = url.searchParams.get('max-h');
        const maxW = url.searchParams.get('max-w');
        if (maxH) {
          url.searchParams.set('max-h', `${Math.floor(Number.parseInt(maxH) * multiplier)}`);
        }
        if (maxW) {
          url.searchParams.set('max-w', `${Math.floor(Number.parseInt(maxW) * multiplier)}`);
        }
      }

      const finalWidth = Math.floor(width * multiplier);

      if (finalWidth < 50) {
        return null;
      }

      return `${url.toString().replace(bogusBaseUrl, '/')} ${finalWidth}w`;
    })
    .filter(Boolean)
    .join(',');
};
