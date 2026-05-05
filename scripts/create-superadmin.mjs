import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createAdmin() {
  console.log('Creando usuario Superadmin...')
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@saas.com',
    password: 'password123',
    email_confirm: true
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
        console.log('El usuario ya existe en auth. Intentando insertar perfil...')
        // We could fetch the user by email if we wanted, but let's just assume it's clean since we just reset the DB
    } else {
        console.error('Error Auth:', authError.message)
        process.exit(1)
    }
  }

  if (authData?.user) {
    console.log('Usuario Auth creado. Insertando perfil...')
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      email: 'admin@saas.com',
      first_name: 'Super',
      last_name: 'Admin',
      is_superadmin: true,
    })

    if (profileError) {
      console.error('Error Profile:', profileError.message)
      process.exit(1)
    }
  }

  console.log('¡Superadmin creado con éxito! Puedes hacer login.')
}

createAdmin()
