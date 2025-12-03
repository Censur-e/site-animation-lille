import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase URL:", url ? "✓ Set" : "✗ Missing")
  console.log("[v0] Supabase Key:", key ? "✓ Set" : "✗ Missing")

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your project settings.",
    )
  }

  return createBrowserClient(url, key)
}
