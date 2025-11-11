"use server";

import sql from "mssql";

import { getDbConnectionServer } from "@/lib/db";

// Secure SELECT/INPUT query with parameterized inputs
export async function getDataQuery<T = any>(
  query: string,
  params: Record<string, any> = {},
  functionName?: string
): Promise<T[] | null> {
  let pool;
  try {
    pool = await getDbConnectionServer();
    const request = new sql.Request(pool);

    // Add parameters safely
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    const errorMessage = functionName
      ? `Database Error on function ${functionName}: `
      : "Database Error: ";
    console.error(errorMessage, error);
    return null;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Secure INSERT that returns the new ID
export async function executeInsertWithId(
  query: string,
  params: Record<string, any> = {},
  functionName?: string
): Promise<number | null> {
  let pool;
  try {
    pool = await getDbConnectionServer();
    const request = new sql.Request(pool);

    // Add parameters safely
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset[0].id;
    }
    return null;
  } catch (error) {
    const errorMessage = functionName
      ? `Database Error on function ${functionName}: `
      : "Database Error: ";
    console.error(errorMessage, error);
    return null;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Secure non-query (UPDATE/DELETE) with parameterized inputs
export async function getResultQuery(
  query: string,
  params: Record<string, any> = {},
  functionName?: string
): Promise<boolean> {
  let pool;
  try {
    pool = await getDbConnectionServer();
    const request = new sql.Request(pool);

    // Add parameters safely
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });

    const result = await request.query(query);
    return result.rowsAffected && result.rowsAffected[0] > 0;
  } catch (error) {
    const errorMessage = functionName
      ? `Database Error on function ${functionName}: `
      : "Database Error: ";
    console.error(errorMessage, error);
    return false;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// Secure transaction execution for UPDATE and DELETE
export async function executeTransaction(
  queries: Array<{
    query: string;
    params: Record<string, any>;
    functionName?: string;
  }>,
  callingFunctionName?: string
): Promise<boolean> {
  let pool;
  let transaction;
  let currentQueryIndex = 0;

  try {
    pool = await getDbConnectionServer();
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    for (let i = 0; i < queries.length; i++) {
      currentQueryIndex = i;
      const queryObj = queries[i];
      const request = new sql.Request(transaction);

      // Add parameters safely
      Object.entries(queryObj.params).forEach(([key, value]) => {
        request.input(key, value);
      });

      await request.query(queryObj.query);
    }

    await transaction.commit();
    return true;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    const errorContext = callingFunctionName
      ? `Transaction Error on function ${callingFunctionName} (Query ${
          currentQueryIndex + 1
        }):`
      : `Transaction Error (Query ${currentQueryIndex + 1}):`;

    console.error(errorContext, error);
    return false;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}
