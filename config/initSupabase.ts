import 'react-native-url-polyfill/auto'

import { createClient } from '@supabase/supabase-js'

const url = "https://sakovsazciadirzdbahs.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNha292c2F6Y2lhZGlyemRiYWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkxNzg4MjUsImV4cCI6MjAzNDc1NDgyNX0.Zr8btHp-q5CUfmLV7qvi_TG_ePWe9MDBpDylYiN_PxY"

// Initialize the Supabase client
export const supabase = createClient(url, key, {
  auth: {
    detectSessionInUrl: false,
  },
})