import { readFileSync } from "fs";
import { join } from "path";
import { RowDataPacket } from "mysql2";
import { pool } from "../db/database";

// Maps SQL session-variable names to incoming request param keys
const VAR_TO_PARAM: Record<string, string> = {
  "@loc_id": "location_id",
  "@location_id": "location_id",
  "@start_date": "start_date",
  "@end_date": "end_date",
};

function parseSqlBlocks(): Map<number, string> {
  const blocks = new Map<number, string>();
  try {
    const content = readFileSync(
      join(__dirname, "../../../../sql/03_queries.sql"),
      "utf-8",
    );
    // Matches: -- QUERY-N  /  -- Start Query  /  <sql>  /  -- End Query
    const blockRe =
      /^-- QUERY-(\d+)\s*\n-- Start Query\n([\s\S]*?)^-- End Query/gm;
    let m: RegExpExecArray | null;
    while ((m = blockRe.exec(content)) !== null) {
      const num = parseInt(m[1], 10);
      if (num >= 8 && num <= 19) {
        const sql = m[2]
          .split("\n")
          .filter((line) => !/^\s*(SET\s+@|USE\s+\w)/i.test(line))
          .join("\n")
          .trim();
        if (sql) blocks.set(num, sql);
      }
    }
  } catch (err) {
    console.error("[report.service] Failed to parse 03_queries.sql:", err);
  }
  return blocks;
}

// Parsed once at module load; served from memory at runtime
const sqlBlocks = parseSqlBlocks();

// Replaces @variable placeholders with ? and collects ordered values for mysql2
function buildQuery(
  sql: string,
  params: Record<string, unknown>,
): [string, unknown[]] {
  const values: unknown[] = [];
  const query = sql.replace(/@\w+/g, (v) => {
    const key = VAR_TO_PARAM[v];
    if (key !== undefined && params[key] !== undefined) {
      values.push(params[key]);
      return "?";
    }
    return v;
  });
  return [query, values];
}

const descriptions: Record<number, string> = {
  8: "Locations that have at least two distinct FIFA-participating members, with member counts and general manager",
  9: "Primary family members who have two or more associated club members that participated in a FIFA game",
  10: "All team formations (training and game sessions) at a given location within a date range",
  11: "Members who participated in at least five FIFA games, with first and last year played",
  12: "Training and game session totals per location for a given period, limited to locations with at least four game sessions",
  13: "Active club members who have never been assigned to any team formation but have participated in at least one FIFA game",
  14: "Major club members (18+) who were originally registered as minors",
  15: "Active club members who have only ever been assigned the Goalkeeper role across all team formation sessions",
  16: "Active club members who have been assigned at least once to each of five specific field positions",
  17: "Family members who are also active head coaches at a given location",
  18: "Active club members who participated in game sessions but have never been on the winning side",
  19: "Volunteer personnel who are family members of at least one minor member and have at least one associated FIFA-participating member",
};

const reportParameters: Record<
  number,
  Array<"location_id" | "start_date" | "end_date">
> = {
  10: ["location_id", "start_date", "end_date"],
  12: ["start_date", "end_date"],
  17: ["location_id"],
};

export function getReportCatalog() {
  return Array.from({ length: 12 }, (_, i) => i + 8).map((id) => ({
    id,
    status: sqlBlocks.has(id) ? "implemented" : "placeholder",
    description: descriptions[id] ?? `Q${id} — description pending`,
    required_params: reportParameters[id] ?? [],
  }));
}

export async function runReport(id: number, params: Record<string, unknown>) {
  const sql = sqlBlocks.get(id);
  if (!sql)
    return {
      id,
      status: "placeholder",
      params,
      rows: [],
      message: `Q${id} is intentionally scaffolded; add its SQL in 03_queries.sql.`,
    };
  const [query, values] = buildQuery(sql, params);
  const [rows] = await pool.query<RowDataPacket[]>(query, values);
  return { id, status: "implemented", params, rows };
}
