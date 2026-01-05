import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (supabaseClient) {
        return supabaseClient;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key are required. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
}

// Export a proxy that lazily creates the client
export const supabase = {
    get auth() {
        return getSupabaseClient().auth;
    },
    get storage() {
        return getSupabaseClient().storage;
    },
    from: (table: string) => getSupabaseClient().from(table),
};

// Auth helpers
export async function signUp(email: string, password: string, username: string) {
    const { data, error } = await getSupabaseClient().auth.signUp({
        email,
        password,
        options: {
            data: { username }
        }
    });
    return { data, error };
}

export async function signIn(email: string, password: string) {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await getSupabaseClient().auth.signOut();
    return { error };
}

export async function getSession() {
    const { data: { session } } = await getSupabaseClient().auth.getSession();
    return session;
}

export async function getUser() {
    const { data: { user } } = await getSupabaseClient().auth.getUser();
    return user;
}
