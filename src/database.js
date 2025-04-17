import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

function getClient () {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

async function getPotatoes (dbClient) {
  // Add your implementation here
  // Example implementation:
  try {
    const {
      data,
      error
    } = await dbClient
      .from('Potatoes')
      .select('*')
    return data
  } catch (e) {
    console.error(e)
    return false
  }
}

export { getClient, getPotatoes }
