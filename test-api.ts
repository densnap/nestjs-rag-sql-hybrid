import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function embed(text: string) {
  const url =
    "https://ai-api-dev.dentsu.com/openai/deployments/TextEmbeddingAda2/embeddings?api-version=2025-04-01-preview";

  const headers = {
    "x-service-line": process.env.X_SERVICE_LINE,
    "x-brand": process.env.X_BRAND,
    "x-project": process.env.X_PROJECT,

    // keeping your structure (even though it's not used by Azure)
    "api-version": "v15",

    "Ocp-Apim-Subscription-Key": process.env.CHAT_API_KEY,
    "Content-Type": "application/json",
  };

  const res = await axios.post(
    url,
    { input: text },
    { headers }
  );

  return res.data?.data?.[0]?.embedding;
}

async function run() {
  console.log("🚀 Starting embedding backfill...");

  // 1. fetch documents WITHOUT embedding
  const { data: docs, error } = await supabase
    .from("documents")
    .select("id, content")
    .is("embedding", null);

  if (error) {
    console.error("Supabase fetch error:", error);
    return;
  }

  console.log(`📄 Found ${docs?.length || 0} documents`);

  for (const doc of docs || []) {
    try {
      console.log(`⚙️ Processing id=${doc.id}`);

      const vector = await embed(doc.content);

      if (!vector) {
        console.log(`❌ No embedding for id=${doc.id}`);
        continue;
      }

      // 2. update supabase
      const { error: updateError } = await supabase
        .from("documents")
        .update({ embedding: vector })
        .eq("id", doc.id);

      if (updateError) {
        console.error(`❌ Supabase update failed id=${doc.id}`, updateError);
        continue;
      }

      console.log(`✅ Updated id=${doc.id}`);
    } catch (err: any) {
      console.error(`❌ Error id=${doc.id}`, err.response?.data || err.message);
    }
  }

  console.log("🎉 Backfill completed");
}

run();