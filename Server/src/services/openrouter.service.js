import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ultra-fast, high-throughput free models on OpenRouter with fallback
const PRIMARY_FREE_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
const FALLBACK_FREE_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen-2.5-coder-32b-instruct:free"
];

/**
 * Call OpenRouter with prompt and optional model fallback
 */
async function callOpenRouter(messages, temperature = 0.1) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  const candidateModels = [PRIMARY_FREE_MODEL, ...FALLBACK_FREE_MODELS.filter(m => m !== PRIMARY_FREE_MODEL)];
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await axios.post(
        OPENROUTER_API_URL,
        {
          model,
          messages,
          temperature,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://langsql.yashparmar.in",
            "X-Title": "LangSQL Assistant"
          },
          timeout: 25000
        }
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (content) {
        return { content, modelUsed: model };
      }
    } catch (err) {
      console.warn(`OpenRouter model ${model} failed:`, err.response?.data?.error?.message || err.message);
      lastError = err;
    }
  }

  throw new Error(`All OpenRouter free models failed. Last error: ${lastError?.message || "Unknown error"}`);
}

/**
 * Substitute for LangFlowService: Generate SQL for any dialect (Spark, Trino, Postgres, MySQL)
 */
export const generateSQLWithOpenRouter = async (body, metaData) => {
  try {
    const userQuery = body.message;
    const dialect = body.dialect || "sql";

    const systemPrompt = `You are an expert SQL engineer specializing in high-performance ${dialect} queries.
You must return a valid JSON object matching this schema:
{
  "query": "THE_GENERATED_SQL_QUERY"
}
Rules:
1. Generate strictly valid syntax for the "${dialect}" dialect.
2. Only reference existing tables and columns provided in the schema metadata.
3. Do NOT include markdown code fences (no \`\`\`sql) inside the JSON string value.
4. Output raw valid JSON only.`;

    const userPrompt = `Database Schema Metadata:
${JSON.stringify(metaData, null, 2)}

User Request: "${userQuery}"
Dialect: ${dialect}`;

    const { content } = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Fallback extraction if model wraps in code fences
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON response received from OpenRouter LLM");
      }
    }

    const query = parsed.query || parsed.sql_query || parsed.sql;
    if (!query) {
      throw new Error("No SQL query returned in JSON response");
    }

    return {
      success: true,
      data: { query }
    };
  } catch (error) {
    console.error("generateSQLWithOpenRouter Error:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Substitute for LangFlow schema generation: Create DDL tables from natural language description
 */
export const generateSchemaWithOpenRouter = async (description, dialect = "postgresql") => {
  try {
    const systemPrompt = `You are a database architect.
Given a description of a business or application, generate a production-ready DDL schema for ${dialect}.
Return a valid JSON object matching this schema:
{
  "schema": "CREATE TABLE ... (full DDL statements separated by semicolons)"
}
Rules:
1. Target dialect: ${dialect}.
2. Include primary keys, foreign keys, sensible data types, and indexes.
3. Return raw valid JSON only without explanation.`;

    const userPrompt = `Application/Business Description:
${description}

Target Dialect: ${dialect}`;

    const { content } = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON response received from OpenRouter LLM");
      }
    }

    const schema = parsed.schema || parsed.ddl || content;
    return {
      success: true,
      schema
    };
  } catch (error) {
    console.error("generateSchemaWithOpenRouter Error:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Validate, fix, and refine raw SQL from DRF or other models using OpenRouter LLM
 */
export const refineAndValidateSQLWithLLM = async ({ rawQuery, question, dialect = "sql", metadata }) => {
  try {
    const systemPrompt = `You are a Principal Database Architect and SQL QA Lead.
Your job is to inspect an AI-generated SQL query draft for accuracy, syntax errors, hallucinations, and incompleteness.
Return a valid JSON object matching this schema:
{
  "sql_query": "CORRECTED_AND_OPTIMIZED_SQL_QUERY",
  "was_modified": true,
  "confidence_score": 0.95
}
Rules:
1. Verify tables, columns, and joins against the provided Database Schema Metadata.
2. If the query draft is incomplete, truncated, or syntactically invalid for "${dialect}", fix it completely.
3. If the query draft is already correct, keep it as is.
4. Output raw valid JSON only without markdown code blocks.`;

    const userPrompt = `User's Request: "${question}"
Target Dialect: ${dialect}

Database Schema Metadata:
${JSON.stringify(metadata, null, 2)}

Draft SQL Query from DRF:
${rawQuery}`;

    const { content, modelUsed } = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        // If parsing fails, fall back to the raw query
        return {
          success: true,
          sql_query: rawQuery,
          modelUsed
        };
      }
    }

    const finalQuery = parsed.sql_query || parsed.query || parsed.sql || rawQuery;
    return {
      success: true,
      sql_query: finalQuery,
      was_modified: parsed.was_modified ?? true,
      confidence_score: parsed.confidence_score ?? 0.95,
      modelUsed
    };
  } catch (err) {
    console.error("refineAndValidateSQLWithLLM Error (falling back to raw query):", err.message);
    return {
      success: true,
      sql_query: rawQuery,
      error: err.message
    };
  }
};
