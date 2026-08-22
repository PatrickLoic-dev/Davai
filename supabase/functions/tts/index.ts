// Supabase Edge Function: text-to-speech via ElevenLabs, with permanent
// caching in Supabase Storage so each distinct string is only ever
// synthesized once — subsequent requests (from any user) just get the
// cached file back, keeping ElevenLabs usage minimal.
//
// Deploy with:
//   supabase functions deploy tts
// Set the secret once with:
//   supabase secrets set ELEVENLABS_API_KEY=your-key-here

import { createClient } from 'jsr:@supabase/supabase-js@2';

const BUCKET = 'tts-cache';
// Multilingual model with solid Russian pronunciation.
const MODEL_ID = 'eleven_multilingual_v2';
// "Aria" — a clear default voice. Swap for any ElevenLabs voice id you prefer.
const VOICE_ID = '9BWtsMINqrJLrRacOk9x';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.length > 200) {
      return new Response(JSON.stringify({ error: 'Invalid "text" field.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const key = `${await sha256Hex(text)}.mp3`;

    // Already cached?
    const { data: existing } = supabase.storage.from(BUCKET).getPublicUrl(key);
    const headCheck = await fetch(existing.publicUrl, { method: 'HEAD' });
    if (headCheck.ok) {
      return new Response(JSON.stringify({ url: existing.publicUrl, cached: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Not cached — synthesize via ElevenLabs.
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'TTS not configured (missing ELEVENLABS_API_KEY).' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!ttsRes.ok) {
      const detail = await ttsRes.text();
      return new Response(JSON.stringify({ error: 'ElevenLabs request failed', detail }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audioBytes = new Uint8Array(await ttsRes.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(key, audioBytes, { contentType: 'audio/mpeg', upsert: true });

    if (uploadError) {
      return new Response(JSON.stringify({ error: 'Failed to cache audio', detail: uploadError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: existing.publicUrl, cached: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
