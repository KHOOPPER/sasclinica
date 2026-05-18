'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'No autorizado' }
    }

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const imageUrl = formData.get('imageUrl') as string

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message }
    }

    // Also update Auth metadata for convenience
    await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        image_url: imageUrl
      }
    })

    revalidatePath('/admin')
    revalidatePath('/admin/perfil')
    
    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error updating profile:', err)
    return { success: false, error: 'Ocurrió un error inesperado' }
  }
}
