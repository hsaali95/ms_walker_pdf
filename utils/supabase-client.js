const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://adteqwnkqoxbzkxyfzkq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkdGVxd25rcW94YnpreHlmemtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczODc2MTYsImV4cCI6MjA1Mjk2MzYxNn0.iipVN56Kilii7MKbDYo9KxQDTiB_HhbK2PfLgvA6cyM"
);

module.exports = supabase;
