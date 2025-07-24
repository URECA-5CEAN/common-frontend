//이미지 URL 변경
export const getBucketUrl = (url: string) => {
  let filename: string;
  try {
    // URL에서 pathname만 추출
    const { pathname } = new URL(url);
    filename = pathname.split('/').pop() ?? '';
  } catch {
    // 예외 시에도 마지막 경로만
    filename = url.split('/').pop() ?? '';
  }
  // 확장자 제거
  const baseName = filename.replace(/\.[^.]+$/, '');
  // svg 확장자로 조합 최적화위해
  return `https://s3-ureca-final-project.s3.ap-northeast-2.amazonaws.com/${baseName}.svg`;
};
