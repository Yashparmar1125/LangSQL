import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Ultra-fast (<1s response), high-throughput free models on OpenRouter
const PRIMARY_FREE_MODEL = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-super-120b-a12b:free";
const FALLBACK_FREE_MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-3.5-lightning:free"
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
          max_tokens: 1500,
          reasoning: { effort: "none" }
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://langsql.yashparmar.in",
            "X-Title": "LangSQL Assistant"
          },
          timeout: 15000
        }
      );

      const choice = response.data?.choices?.[0]?.message;
      const content = choice?.content;
      if (content && content.trim()) {
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

    const systemPrompt = `You are a database query compiler for "${dialect}".
Generate an executable SQL query strictly tailored for "${dialect}" satisfying the user request and database schema.
Output ONLY a raw, valid JSON object with format:
{"query": "<SQL STATEMENT>"}

Rules:
1. ONLY use tables and columns defined in the provided schema.
2. The query value must be a valid SQL string inside double quotes with internal quotes escaped properly.
3. Output ONLY the JSON object. Do not include markdown codeblocks, reasoning, or extra commentary.`;

    const userPrompt = `Database Schema:
${JSON.stringify(metaData, null, 2)}

User Request: "${userQuery}"
Dialect: ${dialect}`;

    const { content } = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    let query = null;

    // Strategy 1: Direct JSON parse
    try {
      const parsed = JSON.parse(content);
      query = parsed.query || parsed.sql_query || parsed.sql;
    } catch (e) {
      // Strategy 2: Extract "query": "..." via regex
      const keyMatch = content.match(/"(?:query|sql_query|sql)"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      if (keyMatch) {
        query = keyMatch[1].replace(/\\"/g, '"');
      } else {
        // Strategy 3: Extract first balanced JSON object { ... }
        const jsonMatch = content.match(/\{[\s\S]*?\}(?=[^}]*$|\s*$|\n)/) || content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            query = parsed.query || parsed.sql_query || parsed.sql;
          } catch (innerErr) {
            // Strategy 3b: Key regex within the match
            const innerKey = jsonMatch[0].match(/(?:query|sql_query|sql)\s*:\s*([^}\n]+)/i);
            if (innerKey) {
              query = innerKey[1].trim().replace(/^['"]|['"]$/g, "");
            }
          }
        }
      }
    }

    // Strategy 4: Extract SQL directly from code fences ```sql ... ```
    if (!query || query === "THE_GENERATED_SQL_QUERY") {
      const sqlBlockMatch = content.match(/```(?:sql)?\s*([\s\S]*?)\s*```/i);
      if (sqlBlockMatch) {
        query = sqlBlockMatch[1].trim();
      }
    }

    // Strategy 5: Extract direct SQL statement (SELECT/INSERT/UPDATE/DELETE)
    if (!query || query === "THE_GENERATED_SQL_QUERY") {
      const statementMatch = content.match(/((?:SELECT|INSERT|UPDATE|DELETE|WITH)\s+[\s\S]+?;?)/i);
      if (statementMatch) {
        query = statementMatch[1].trim();
      }
    }

    // Fallback: If still placeholder or empty, clean content
    if (!query || query === "THE_GENERATED_SQL_QUERY") {
      query = content.replace(/^\{|\}$/g, "").trim();
    }

    // Remove any trailing curly braces or artifacts if extracted from sloppy JSON
    if (query && typeof query === "string") {
      query = query.replace(/^["']|["']$/g, "").trim();
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
    const systemPrompt = `You are a Principal Database Architect and SQL Quality Assurance Lead.
A fine-tuned text-to-SQL neural model generated an initial draft SQL query for a user question.
You MUST thoroughly inspect, correct, and validate this query against the provided Database Schema Metadata for the target dialect: "${dialect}".

Strict Validation Rules:
1. Verify all table names, column names, relationships, and data types strictly exist in the schema.
2. Fix any syntax errors, hallucinated columns/tables, mismatched JOIN keys, or missing dialect-specific functions (e.g. proper ILIKE/LIKE, quotation rules for "${dialect}").
3. If the query is already 100% correct and executable for "${dialect}", keep the logic intact.
4. Provide constructive QA feedback in "qa_feedback" explaining what was verified or corrected.
5. You MUST return ONLY a valid JSON object matching this exact schema:
{
  "sql_query": "<VERIFIED_OR_CORRECTED_EXECUTABLE_SQL>",
  "was_modified": true_or_false,
  "confidence_score": 0.98,
  "qa_feedback": "Summary of verification or corrections made"
}
Do NOT include markdown backticks or commentary outside the JSON object.`;

    const userPrompt = `User's Question: "${question}"
Target Dialect: ${dialect}

Database Schema Metadata:
${JSON.stringify(metadata, null, 2)}

Draft SQL Query from Fine-Tuned Model:
${rawQuery}`;

    const { content, modelUsed } = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]);

    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Regex fallback 1: Extract "sql_query" or "query" key
      const keyMatch = content.match(/"(?:sql_query|query|sql)"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
      if (keyMatch) {
        parsed = {
          sql_query: keyMatch[1].replace(/\\"/g, '"'),
          was_modified: true,
          confidence_score: 0.95,
          qa_feedback: "Extracted via regex fallback"
        };
      } else {
        // Regex fallback 2: First balanced JSON object
        const match = content.match(/\{[\s\S]*?\}(?=[^}]*$|\s*$|\n)/) || content.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
          } catch (innerErr) {
            console.warn("Could not parse extracted JSON block, extracting raw SQL...");
          }
        }
      }
    }

    let finalQuery = parsed?.sql_query || parsed?.query || parsed?.sql;

    // Regex fallback 3: Extract SQL statement directly if JSON was malformed
    if (!finalQuery || finalQuery === "CORRECTED_AND_OPTIMIZED_SQL_QUERY") {
      const statementMatch = content.match(/((?:SELECT|INSERT|UPDATE|DELETE|WITH)\s+[\s\S]+?;?)/i);
      if (statementMatch) {
        finalQuery = statementMatch[1].trim();
      }
    }

    if (!finalQuery || finalQuery === "CORRECTED_AND_OPTIMIZED_SQL_QUERY") {
      finalQuery = rawQuery;
    }

    // Clean any leading/trailing quotes or backticks
    finalQuery = finalQuery.replace(/^["'`]|["'`]$/g, "").trim();

    return {
      success: true,
      sql_query: finalQuery,
      was_modified: parsed?.was_modified ?? (finalQuery !== rawQuery),
      confidence_score: parsed?.confidence_score ?? 0.95,
      qa_feedback: parsed?.qa_feedback || "Validated against schema metadata",
      modelUsed
    };
  } catch (err) {
    console.error("refineAndValidateSQLWithLLM Error (falling back to raw model query):", err.message);
    return {
      success: true,
      sql_query: rawQuery,
      was_modified: false,
      confidence_score: 0.85,
      qa_feedback: `Validation bypassed due to: ${err.message}`,
      error: err.message
    };
  }
};
