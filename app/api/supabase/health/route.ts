import { NextResponse } from 'next/server'
import { checkSupabaseConnection, getSupabaseServerClient } from '../../../../src/utils/supabase'

export async function GET() {
  try {
    const health = await checkSupabaseConnection()

    // Verificar buckets de storage
    let buckets: string[] = []
    try {
      const supabase = getSupabaseServerClient()
      const { data } = await supabase.storage.listBuckets()
      buckets = (data || []).map((b) => b.name)
    } catch {
      buckets = ['error listing buckets']
    }

    return NextResponse.json({
      status: health.connected ? 'ok' : 'error',
      supabase: {
        url: health.url,
        connected: health.connected,
        error: health.error,
        buckets,
        database: process.env.DATABASE_URI ? 'configured' : 'missing',
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
