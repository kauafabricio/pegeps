import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'pegeps_session';

const PUBLIC_ROUTES = ['/cadastro', '/login'];
const PROTECTED_PREFIXES = [
  '/diagnostico',
  '/escolher-trilha',
  '/onboarding',
  '/trilha',
  '/tutor',
  '/avaliacoes',
  '/adaptar-trilha',
  '/adaptar',
  '/perfil',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(AUTH_COOKIE_NAME);

  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/cadastro';
    return NextResponse.redirect(url);
  }

  if (isPublic && hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/trilha';
    return NextResponse.redirect(url);
  }

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = hasSessionCookie ? '/trilha' : '/cadastro';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
