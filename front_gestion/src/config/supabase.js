import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ozyjkmvsaogxrmewaafj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96eWprbXZzYW9neHJtZXdhYWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MDM0NTQsImV4cCI6MjA2MzE3OTQ1NH0.7SAA-89GrcIWfo4z02OfxfbrEfAJMktz8r44meUUPfA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 