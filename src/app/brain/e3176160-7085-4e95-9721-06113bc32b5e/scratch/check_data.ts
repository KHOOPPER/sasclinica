
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function checkData() {
  const { data, error } = await supabase
    .from('public_clinic_settings')
    .select('*')
    .ilike('slug', 'clinica-dr-portillo')
    .maybeSingle()

  if (error) {
    console.error('Error fetching data:', error)
    return
  }

  if (data) {
    console.log('Data for clinica-dr-portillo:', JSON.stringify(data, null, 2))
  } else {
    console.log('No data found for slug: clinica-dr-portillo')
  }
}

checkData()
