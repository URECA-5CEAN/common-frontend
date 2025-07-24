//이미지 URL 변경
const bucketUrlCache = new Map<string, string>();

export const getBucketUrl = (url: string) => {
  // 캐시에 있으면 바로 반환
  const cached = bucketUrlCache.get(url);
  if (cached) return cached;

  // URL 파싱 없이 정규표현식으로 파일명+확장자 추출
  const match = url.match(/\/([^\/?#]+?)(\.[^\/?#]+)?(?:[?#]|$)/);
  const filename = match ? match[1] : url.split('/').pop() || url;

  // .png 확장자로 재조합
  const result = `https://s3-ureca-final-project.s3.ap-northeast-2.amazonaws.com/${filename}.png`;

  //  캐시에 저장
  bucketUrlCache.set(url, result);
  return result;
};
