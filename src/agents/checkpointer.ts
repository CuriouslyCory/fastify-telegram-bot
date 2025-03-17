import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import log from "electron-log";
import pg from "pg";

const { Pool } = pg;

export async function getCheckpointer() {
  try {
    const pool = new Pool({
      user: process.env.TIMESCALE_DB_USER,
      password: process.env.TIMESCALE_DB_PASSWORD,
      host: process.env.TIMESCALE_DB_HOST,
      port: parseInt(process.env.TIMESCALE_DB_PORT!, 10),
      database: process.env.TIMESCALE_DB_DATABASE,
      max: 20,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 1000,
      maxUses: 7500,
    });

    const pgCheckpointSaver = new PostgresSaver(pool);

    return pgCheckpointSaver;
  } catch (error) {
    log.error("Error getting checkpointer", error);
    throw error;
  }
}
