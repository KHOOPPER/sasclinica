import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clinicId = searchParams.get('clinicId')

    if (!clinicId) {
      return NextResponse.json({ error: 'clinicId required' }, { status: 400 })
    }

    // Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: settings } = await adminClient
      .from('public_clinic_settings')
      .select('clinic_logo, logo_url')
      .eq('clinic_id', clinicId)
      .maybeSingle()

    let logo = settings?.clinic_logo || settings?.logo_url || null

    // Si el logo es una URL externa (no Base64), lo convertimos en el servidor
    // El servidor no tiene restricciones CORS, así que puede descargar cualquier imagen
    if (logo && !logo.startsWith('data:')) {
      try {
        const imgResponse = await fetch(logo)
        if (imgResponse.ok) {
          const buffer = await imgResponse.arrayBuffer()
          const contentType = imgResponse.headers.get('content-type') || 'image/png'
          const base64 = Buffer.from(buffer).toString('base64')
          logo = `data:${contentType};base64,${base64}`
        }
      } catch (fetchError) {
        console.error('Could not fetch external logo URL:', fetchError)
        // Dejamos logo como la URL original como fallback
      }
    }

    return NextResponse.json({ logo })
  } catch (error: any) {
    console.error('Clinic logo API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
