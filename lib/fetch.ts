import { NextRouter } from 'next/router';

export const getRequest = async (url: string, router: NextRouter) => {
  const res = await fetch(url);
  if (res.redirected) {
    router.replace(res.url);
    return {};
  }
  if (res.ok) {
    return await res.json();
  }
  console.error(`Error al llamar a ${url}`);
};

export const postRequest = async (
  url: string,
  body: any,
  router: NextRouter,
) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.redirected) {
    router.replace(res.url);
    return {};
  }
  if (res.ok) {
    return await res.json();
  }
  console.error(`Error al llamar a ${url}`, body);
};
