
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkColumns() {
  const { data, error } = await supabase
    .from('public_clinic_settings')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching data:', error)
    return
  }

  if (data && data.length > 0) {
    console.log('Columns in public_clinic_settings:', Object.keys(data[0]))
  } else {
    console.log('No data found in public_clinic_settings to infer columns.')
    // Fallback: try to get column info from information_schema if possible
    const { data: cols, error: colError } = await supabase
      .rpc('get_table_columns', { table_name: 'public_clinic_settings' })
    
    if (colError) {
      console.error('Error fetching columns via RPC:', colError)
    } else {
      console.log('Columns via RPC:', cols)
    }
  }
}

checkColumns()
