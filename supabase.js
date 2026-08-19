const SUPABASE_URL = "https://xraebqnicnncuvjfweuv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mkXa1PWBrzTox_jp_pBtHA_5J-SO5JC";

let supabaseClient = null;

function initSupabase() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
        console.log("Supabase initialized successfully!");
    } else {
        setTimeout(initSupabase, 100); // 100ms baad wapas try karega jab tak CDN load na ho
    }
}

initSupabase();