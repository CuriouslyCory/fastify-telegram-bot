import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import log from "electron-log";
import pg from "pg";
import { env } from "process";

const { Pool } = pg;

export async function getCheckpointer() {
  try {
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 1000,
      maxUses: 7500,
    });

    const pgCheckpointSaver = new PostgresSaver(pool);
    //pgCheckpointSaver.setup();

    return pgCheckpointSaver;
  } catch (error) {
    log.error("Error getting checkpointer", error);
    throw error;
  }
}
