import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfpwujyopyhgbroirxmd.supabase.co'; // Tu URL de Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHd1anlvcHloZ2Jyb2lyeG1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NTYzNjAsImV4cCI6MjA0NzEzMjM2MH0.MZiqZ9S0fZFdJexJvf0VhTHfbZJHDrCTODJMMcVT2ww"
export const supabase = createClient(supabaseUrl, supabaseKey);
