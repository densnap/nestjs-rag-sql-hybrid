# nestjs-rag-sql-hybrid
Project made to implement NestJS concepts.

# 🚀 Hybrid RAG + SQL Assistant (POC)

A **proof-of-concept (POC)** AI assistant that combines:

* 🔎 **Vector Search (RAG)** using embeddings
* 🧠 **LLM (Azure via APIM)** for reasoning & responses
* 🗄️ **Supabase (PostgreSQL + pgvector)** for storage
* 🔀 **Intent-based routing** (SQL vs RAG)

---

# 📌 Architecture Overview

```
            ┌──────────────┐
            │  User Query  │
            └──────┬───────┘
                   ↓
        ┌─────────────────────┐
        │ Intent Classifier   │
        └──────┬───────┬──────┘
               │       │
        ┌──────▼───┐   ┌───────────────┐
        │ SQL Path │   │   RAG Path    │
        └──────┬───┘   └──────┬────────┘
               │              │
        ┌──────▼──────┐   ┌──────────────────────────┐
        │  DB Query   │   │ Embedding → Retrieval    │
        │             │   │           → Context      │
        └──────┬──────┘   └──────────┬───────────────┘
               │                     │
               └──────────┬──────────┘
                          ↓
            ┌──────────────────────────┐
            │   Response Generator     │
            └──────────┬───────────────┘
                       ↓
                ┌──────────────┐
                │ Final Answer │
                └──────────────┘

---

# 🧱 Tech Stack

* **Backend**: NestJS
* **LLM + Embeddings**: Azure OpenAI (via APIM)
* **Database**: Supabase (PostgreSQL + pgvector)
* **HTTP Client**: Axios
* **Language**: TypeScript

---

# ⚙️ Setup Instructions

## 1. Clone Repo

```
git clone <your-repo-url>
cd rag-sql-hybrid
```

---

## 2. Install Dependencies

```
npm install
```

---

## 3. Environment Variables

Create a `.env` file:

```
CHAT_URL=https://ai-api-dev.dentsu.com/openai/deployments/GPT35Turbo/chat/completions

EMBED_URL=https://ai-api-dev.dentsu.com/openai/deployments/TextEmbeddingAda2/embeddings?api-version=2025-04-01-preview

CHAT_API_KEY=your_key_here

X_SERVICE_LINE=cxm
X_BRAND=dentsu
X_PROJECT=aiassistant

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

---

# 🔐 Azure APIM Headers

All requests must include:

```
Content-Type: application/json
x-service-line: cxm
x-brand: dentsu
x-project: aiassistant
Ocp-Apim-Subscription-Key: <your-key>
```

⚠️ Notes:

* Headers are **case-sensitive**
* Missing/incorrect headers → **404 errors**
* `api-version` must be present in the URL

---

# 🗄️ Database Schema

This project uses a **hybrid data model**:

* Structured data → SQL tables
* Unstructured data → RAG (embeddings)

---

## 🔵 1. `shops`

```
create table shops (
  shop_id int primary key,
  shop_name text,
  city text,
  state text,
  country text,
  email text,
  shop_state text
);
```

---

## 🟢 2. `orders`

```
create table orders (
  order_id int primary key,
  shop_id int references shops(shop_id),
  amount numeric,
  status text,
  created_at timestamp
);
```

---

## 🟣 3. `documents` (RAG Table)

```
create table documents (
  id uuid primary key default gen_random_uuid(),
  content text,
  embedding vector(1536),
  metadata jsonb
);
```

---

## 🔗 Relationships

* `orders.shop_id → shops.shop_id`
* `documents` is independent (used for semantic search)

---

# 🧠 How RAG Works

### 1. Embed Query

Query → embedding vector (Azure)

### 2. Retrieve

* Fetch all rows from `documents`
* Compute cosine similarity in Node.js

### 3. Rank

Top-K relevant chunks selected

### 4. Build Context

Chunks combined into context

### 5. LLM Call

Context + query → GPT response

---

# 📂 Project Structure

```
src/
│
├── rag/
│   └── rag.service.ts
│
├── sql/
│   └── sql.service.ts
│
├── orchestrator/
│   └── query-orchestrator.service.ts
│
├── classifier/
│   └── intent.classifier.service.ts
│
├── response/
│   └── response.generator.service.ts
│
└── common/
    └── supabase/
        └── supabase.service.ts
```


# 🚀 Running the Project

## Start Backend

```
npm run start:dev
```

---

## Run CLI

```
npm run cli
```