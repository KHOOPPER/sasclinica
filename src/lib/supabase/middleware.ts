import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isSuperadminRoute = request.nextUrl.pathname.startsWith('/superadmin')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isStaffRoute = request.nextUrl.pathname.startsWith('/staff')
  const isProtectedRoute = isSuperadminRoute || isAdminRoute || isStaffRoute

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user) {
    const supabaseAdmin = createAdminClient()
    
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    console.log('MIDDLEWARE DEBUG: user id:', user.id)
    console.log('MIDDLEWARE DEBUG: profile role:', profile?.role, 'error:', error)
    
    const role = profile?.role

    if (request.nextUrl.pathname === '/login' && role) {
      const url = request.nextUrl.clone()
      if (role === 'superadmin') {
        url.pathname = '/superadmin'
      } else if (role === 'admin' || role === 'doctor' || role === 'receptionist' || role === 'staff') {
        url.pathname = '/admin'
      } else {
        url.pathname = '/login' // Unknown role: force re-authentication
      }
      return NextResponse.redirect(url)
    }

    if (isSuperadminRoute && role !== 'superadmin') {
      console.log('MIDDLEWARE DEBUG: Blocking access to /superadmin. Found role:', role)
      const url = request.nextUrl.clone()
      url.pathname = (role === 'admin' || role === 'doctor' || role === 'receptionist' || role === 'staff') ? '/admin' : '/login'
      return NextResponse.redirect(url)
    }

    if (isAdminRoute && role !== 'admin' && role !== 'superadmin' && role !== 'doctor' && role !== 'receptionist' && role !== 'staff') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // STRICT INTERCEPT: Prevent superadmins from loading /admin Layout which causes white flashes
    // EXCEPTION: Allow access if impersonating a specific clinic (Modo Dios)
    if (isAdminRoute && role === 'superadmin' && !request.nextUrl.searchParams.has('clinicId')) {
      const url = request.nextUrl.clone()
      url.pathname = '/superadmin'
      return NextResponse.redirect(url)
    }

    if (isStaffRoute && role !== 'staff' && role !== 'admin' && role !== 'superadmin' && role !== 'doctor' && role !== 'receptionist') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Pass the full URL to server components via header (needed for clinicId param in admin layout)
  supabaseResponse.headers.set('x-url', request.nextUrl.toString())

  return supabaseResponse
}
