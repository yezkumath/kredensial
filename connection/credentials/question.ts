"use server";
import { GetLoginCookie } from "@/function/cookie/loginData";
import {
  getDataQuery, // untuk select
  getResultQuery, // untuk Input
  executeTransaction, // untuk Update dan Delete sehingga historynya terekam
} from "../sqlExecutor";

//VIEW ALL QUESTION LIST
export async function view_credential_question_list(id_document: number) {
  return await getDataQuery(
    `
    SELECT * FROM view_credential_question_list WHERE id_document = @id_document`,
    { id_document },
    `view_credential_question_list
    id_document = ${id_document}`
  );
}

//TABLE credential_question_chapter
export async function GET_chapter(id_document: number) {
  return await getDataQuery(
    `
    SELECT * FROM credential_question_chapter WHERE id_document = @id_document`,
    { id_document },
    `GET_chapter
    id_document = ${id_document}`
  );
}

export async function GET_chapter_number(id_document: number) {
  return await getDataQuery(
    `
    SELECT number FROM credential_question_chapter WHERE id_document = @id_document`,
    { id_document },
    `GET_chapter_number
    id_document = ${id_document}`
  );
}

export async function POST_chapter(
  id_document: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_question_chapter
    (id_document, number, 	question, create_nip)
    VALUES
    (@id_document, @number, @question, @create_nip)`,
    { id_document, number, question, create_nip },
    `POST_chapter
    id_document:${id_document}
    number:${number}	
    question:${question} 
    create_nip:${create_nip}`
  );
}

export async function PUT_chapter(
  id: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_question_chapter 
              SET number = @number, question = @question
              WHERE id = @id`,
        params: { number, question, id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_chapter",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE value",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_chapter
    id: ${id}
    number: ${number}
    question: ${question}
    create_nip: ${create_nip}`
  );
}
export async function DELETE_chapter(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                DELETE credential_question_chapter 
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES 
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_chapter",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE chapter",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_chapter
    id: ${id}
    create_nip: ${create_nip}`
  );
}
export async function DELETE_question_use_idchapter(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                DELETE FROM credential_question_question 
                WHERE id_chapter = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES 
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_question",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE question using id_chapter",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_question_use_idchapter
    id: ${id}
    create_nip: ${create_nip}`
  );
}
export async function DELETE_subquestion_use_idchapter(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                DELETE FROM credential_question_subquestion
                WHERE id_Question IN 
                (
                    SELECT id FROM credential_question_question 
                    WHERE id_Chapter = @id
                )`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES 
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_subquestion",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE subquestion using id_chapter",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_subquestion_use_idchapter
    id: ${id}
    create_nip: ${create_nip}`
  );
}
export async function PATCH_DELETE_chapter(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `
                DELETE FROM credential_question_subquestion
                WHERE id_Question IN 
                (
                    SELECT id FROM credential_question_question 
                    WHERE id_Chapter = @id
                )
                
                DELETE FROM credential_question_question 
                WHERE id_chapter = @id

                DELETE credential_question_chapter 
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES 
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: `
                    credential_question_subquestion, 
                    credential_question_question, 
                    credential_question_chapter`,
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE value",
          create_nip: create_nip,
        },
      },
    ],
    `PATCH_DELETE_chapter
    id: ${id}
    create_nip: ${create_nip}`
  );
}

//TABLE credential_question_question
export async function GET_question(id_chapter: number) {
  return await getDataQuery(
    `
    SELECT * FROM credential_question_question WHERE id_chapter = @id_chapter`,
    { id_chapter },
    `GET_question
    id_chapter = ${id_chapter}`
  );
}

export async function GET_question_number(id_chapter: number) {
  return await getDataQuery(
    `
    SELECT number FROM credential_question_question WHERE id_chapter = @id_chapter`,
    { id_chapter },
    `GET_question_number
    id_chapter = ${id_chapter}`
  );
}

export async function POST_question(
  id_chapter: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_question_question
    (id_chapter, number, 	question, create_nip)
    VALUES
    (@id_chapter, @number, @question, @create_nip)`,
    { id_chapter, number, question, create_nip },
    `POST_question
    id_chapter:${id_chapter}
    number:${number}	
    question:${question} 
    create_nip:${create_nip}`
  );
}
export async function PUT_question(
  id: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_question_question
              SET number = @number, question = @question
              WHERE id = @id`,
        params: { number, question, id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_question",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE value",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_question
    id: ${id}
    number: ${number}
    question: ${question}
    create_nip: ${create_nip}`
  );
}

export async function DELETE_question(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE credential_question_question
              WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_question",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE value",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_question
    id: ${id}
    create_nip: ${create_nip}`
  );
}

export async function DELETE_subquestion_use_idquestion(id_question: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE credential_question_subquestion
        
              WHERE id_question = @id_question`,
        params: { id_question },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_subquestion",
          id_data: id_question,
          action_ontable: "DELETE",
          action_detail: "DELETE subquestion using id qustion",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_question
    id_question: ${id_question}
    create_nip: ${create_nip}`
  );
}

//TABLE credential_question_subquestion
export async function GET_subquestion(id_question: number) {
  return await getDataQuery(
    `
    SELECT * FROM credential_question_subquestion WHERE id_question = @id_question`,
    { id_question },
    `GET_subquestion
    id_question = ${id_question}`
  );
}

export async function GET_subquestion_number(id_question: number) {
  return await getDataQuery(
    `
    SELECT number FROM credential_question_subquestion WHERE id_question = @id_question`,
    { id_question },
    `GET_subquestion_number
    id_question = ${id_question}`
  );
}

export async function POST_subquestion(
  id_question: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_question_subquestion
    (id_question, number, question, create_nip)
    VALUES
    (@id_question, @number, @question, @create_nip)`,
    { id_question, number, question, create_nip },
    `POST_subquestion
    id_question:${id_question}
    number:${number}	
    question:${question} 
    create_nip:${create_nip}`
  );
}

export async function PUT_subquestion(
  id: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_question_subquestion
                SET number = @number, question = @question
                WHERE id = @id`,
        params: { number, question, id },
      },
      {
        query: `INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_subquestion",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE value",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_subquestion
    id: ${id}
    number: ${number}
    question: ${question}
    create_nip: ${create_nip}`
  );
}

export async function DELETE_subquestion(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE credential_question_subquestion
              WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_question_subquestion",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE value",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_subquestion
    id: ${id}
    create_nip: ${create_nip}`
  );
}
