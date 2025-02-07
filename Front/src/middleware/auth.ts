import type { APIContext } from 'astro';

// Sem precisar explicitamente `: MiddlewareHandler`
export async function onRequest({ request, redirect }: APIContext) {
  const isAuthenticated = request.headers.get('cookie')?.includes('authToken');

  if (!isAuthenticated && !request.url.includes('/login')) {
    return redirect('/login', 307);
  }
}