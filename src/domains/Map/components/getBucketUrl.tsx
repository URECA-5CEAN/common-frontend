//이미지 URL 변경
export const getBucketUrl = (url: string) => {
  try {
    const { pathname } = new URL(url);
    return `https://s3-ureca-final-project.s3.ap-northeast-2.amazonaws.com/${pathname.split('/').pop()}`;
  } catch {
    const p = url.split('/').pop();
    return `https://s3-ureca-final-project.s3.ap-northeast-2.amazonaws.com/${p}`;
  }
};
