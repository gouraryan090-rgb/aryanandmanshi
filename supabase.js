const SUPABASE_URL =
    "https://xraebqnicnncuvjfweuv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_mkXa1PWBrzTox_jp_pBtHA_5J-SO5JC";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);