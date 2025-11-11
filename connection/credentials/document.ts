"use server";
import { GetLoginCookie } from "@/function/cookie/loginData";
import {
  getDataQuery, // untuk select
  getResultQuery, // untuk Input
  executeTransaction, // untuk Update dan Delete sehingga historynya terekam
  executeInsertWithId, // for input and get the id (primary key) of the input item
} from "../sqlExecutor";

//TABLE credential_document

export async function GET_credential_document(id: number) {
  return await getDataQuery(
    `
    SELECT * FROM credential_document 
    WHERE id = @id`,
    { id },
    `GET_credential_document
    id = ${id}`
  );
}

export async function GET_credential_document_use(id: number) {
  return await getDataQuery(
    `
    SELECT COUNT(a.id) as total
    FROM credential_application a
    JOIN credential_document d
    ON a.id_document = d.id
    WHERE d.id = @id`,
    { id },
    `GET_credential_document_use
    id = ${id}`
  );
}

export async function GET_credential_document_card() {
  return await getDataQuery(
    `
    SELECT 
      cd.id, 
      cd.short_name, 
      cd.name_document, 
      cd.pk_grade, 
      cd.status, 
      cd.create_date,
      la.last_update_date AS update_date
    FROM credential_document cd
    LEFT JOIN (
        SELECT 
            id_data,
            MAX(create_date) AS last_update_date
        FROM credential_log_activity 
        WHERE table_name = 'credential_document'
        GROUP BY id_data
    ) la ON cd.id = la.id_data`,
    {},
    `GET_credential_document_card`
  );
}

export async function GET_credential_category_on_document(id: number) {
  return await getDataQuery(
    `
   SELECT a.id_category, b.category_name  
    FROM  
    credential_category a JOIN 
    credential_document_category b 
    ON a.id_category = b.id 
    WHERE a.id_document = @id`,
    { id },
    `GET_credential_category_on_document
    id = ${id}`
  );
}

export async function POST_credential_document(
  short_name: string,
  name_document: string,
  pk_grade: string,
  status: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_document
    (short_name, name_document, pk_grade, status, create_nip)
    VALUES
    (@short_name, @name_document, @pk_grade, @status, @create_nip)`,
    { short_name, name_document, pk_grade, status, create_nip },
    `POST_credential_document
    short_name:${short_name} 
    name_document:${name_document} 
    pk_grade:${pk_grade} 
    status:${status}`
  );
}

export async function PUT_credential_document(
  id: number,
  short_name: string,
  name_document: string,
  pk_grade: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_document
              SET short_name = @short_name, name_document = @name_document, pk_grade = @pk_grade
              WHERE id = @id`,
        params: { short_name, name_document, pk_grade, id },
      },
      {
        query: `
                INSERT INTO credential_log_activity
                (table_name, id_data, action_ontable, action_detail, create_nip)
                VALUES
                (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_document",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "Update value",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_document
    id :${id}
    short_name :${short_name}
    name_document :${name_document}
    pk_grade :${pk_grade}
    create_nip :${create_nip}`
  );
}

export async function PUT_credential_document_activation(
  id: number,
  status: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_document
              SET status = @status
              WHERE id = @id`,
        params: { status, id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_document",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "Update status active or diactive",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_document_activation
    id :${id}
    status :${status}
    create_nip :${create_nip}`
  );
}

export async function DELETE_credential_document(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE credential_document
              WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_document",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE value",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_credential_document
    id :${id}
    create_nip :${create_nip}`
  );
}

//TABLE credential_document_category
export async function GET_credential_document_category() {
  return await getDataQuery(
    `
    SELECT id AS id_category, category_name 
    FROM credential_document_category`,
    {},
    `GET_credential_document_category`
  );
}

export async function POST_document_category(category_name: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `INSERT INTO credential_document_category
    (category_name, create_nip)
    VALUES
    (@category_name, @create_nip)`,
    { category_name, create_nip },
    `POST_document_category
    category_name:${category_name}
    create_nip: ${create_nip}`
  );
}

export async function PUT_document_category(id: number, category_name: string) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_document_category
              SET category_name = @category_name
              WHERE id = @id`,
        params: { category_name, id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_document_category",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "Update category name",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_document_category
    id: ${id}
    category_name: ${category_name}
    create_nip: ${create_nip}`
  );
}

export async function DELETE_document_category(id: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `DELETE credential_document_category
                WHERE id = @id`,
        params: { id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_document_category",
          id_data: id,
          action_ontable: "DELETE",
          action_detail: "DELETE value",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_document_category
    id: ${id}
    create_nip: ${create_nip}`
  );
}

//TABLE credential_category
export async function GET_credential_category() {
  return await getDataQuery(
    `
    SELECT c.id, c.id_document, d.short_name, c.id_category, dc.
    FROM credential_category c
    LEFT JOIN  credential_document d
    ON c.id_document = d.id
    LEFT JOIN credential_document_category dc.category_name
    ON c.id_category = dc.id`,
    {},
    `GET_credential_category`
  );
}

export async function POST_credential_category(
  id_document: number,
  id_category: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await getResultQuery(
    `
    INSERT INTO credential_category
    (id_document, id_category, create_nip)
    VALUES
    (@id_document, @id_category, @create_nip)`,
    { id_document, id_category, create_nip },
    `POST_credential_category
    id_document:${id_document}
    id_category:${id_category}
    create_nip:${create_nip}`
  );
}

export async function PUT_credential_category(id: number, id_category: number) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  return await executeTransaction(
    [
      {
        query: `UPDATE credential_category
                SET id_category = @id_category
                WHERE id=@id`,
        params: { id_category, id },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_category",
          id_data: id,
          action_ontable: "UPDATE",
          action_detail: "UPDATE value",
          create_nip: create_nip,
        },
      },
    ],
    `PUT_credential_category
    id: ${id_category}
    id_category: ${id_category}
    create_nip: ${create_nip}`
  );
}
export async function DELETE_credential_category(
  id_document: number,
  id_category: number
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  const id_2_data = Number(`${id_document}0${id_category}`);
  return await executeTransaction(
    [
      {
        query: `DELETE credential_category 
                WHERE id_document=@id_document AND id_category = @id_category`,
        params: { id_document, id_category },
      },
      {
        query: `INSERT INTO credential_log_activity
              (table_name, id_data, action_ontable, action_detail, create_nip)
              VALUES
              (@table_name, @id_data, @action_ontable, @action_detail, @create_nip)`,
        params: {
          table_name: "credential_category",
          id_data: id_2_data,
          action_ontable: "DELETE",
          action_detail: "DELETE using Number(id_document + 0 + id_category)",
          create_nip: create_nip,
        },
      },
    ],
    `DELETE_credential_category
    id_document: ${id_document}
     id_category: ${id_category}
    create_nip: ${create_nip}
    id_2_data: ${id_2_data}`
  );
}

export async function POST_credential_document_and_category_with_id(
  short_name: string,
  name_document: string,
  pk_grade: string,
  category: number[]
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;
  const id = await executeInsertWithId(
    `
    INSERT INTO credential_document 
    (short_name, name_document, pk_grade, status, create_nip) 
    OUTPUT INSERTED.id VALUES 
    (@short_name, @name_document, @pk_grade, 0, @create_nip)`,
    { short_name, name_document, pk_grade, create_nip },
    `
    POST_credential_document_and_category_with_id
    short_name:${short_name} 
    name_document:${name_document} 
    pk_grade:${pk_grade} 
    status:0 --default disable
    category: ${JSON.stringify(category)}`
  );
  console.log("New Document ID:", id);
  console.log("Categories to add:", category);
  if (id !== null) {
    if (category.length > 0) {
      const promises = category.map((cat) => POST_credential_category(id, cat));
      await Promise.all(promises);
      return { id, categories: category }; // Return both the ID and categories
    } else {
      return id; // Return the ID even if no categories are provided
    }
  } else {
    return null;
  }
}
//----------------------------------------------------------------
// GET functions for retrieving hierarchical data

export async function GET_credential_chapters_by_document(id_document: number) {
  return await getDataQuery(
    `
    SELECT id, number, question 
    FROM credential_question_chapter 
    WHERE id_document = @id_document 
    ORDER BY number`,
    { id_document },
    `GET_credential_chapters_by_document
    id_document: ${id_document}`
  );
}

export async function GET_credential_questions_by_chapter(id_chapter: number) {
  return await getDataQuery(
    `
    SELECT id, number, question 
    FROM credential_question_question 
    WHERE id_chapter = @id_chapter 
    ORDER BY number`,
    { id_chapter },
    `GET_credential_questions_by_chapter
    id_chapter: ${id_chapter}`
  );
}

export async function GET_credential_subquestions_by_question(
  id_question: number
) {
  return await getDataQuery(
    `
    SELECT id, number, question 
    FROM credential_question_subquestion 
    WHERE id_question = @id_question 
    ORDER BY number`,
    { id_question },
    `GET_credential_subquestions_by_question
    id_question: ${id_question}`
  );
}

// POST functions with ID return for copying

export async function POST_credential_chapter_with_id(
  id_document: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;

  return await executeInsertWithId(
    `
    INSERT INTO credential_question_chapter 
    (id_document, number, question, create_nip) 
    OUTPUT INSERTED.id 
    VALUES (@id_document, @number, @question, @create_nip)`,
    { id_document, number, question, create_nip },
    `POST_credential_chapter_with_id
    id_document: ${id_document}
    number: ${number}
    question: ${question}`
  );
}

export async function POST_credential_question_with_id(
  id_chapter: number,
  number: number,
  question: string
) {
  const loginData = await GetLoginCookie();
  const create_nip = loginData?.nip;

  return await executeInsertWithId(
    `
    INSERT INTO credential_question_question 
    (id_chapter, number, question, create_nip) 
    OUTPUT INSERTED.id 
    VALUES (@id_chapter, @number, @question, @create_nip)`,
    { id_chapter, number, question, create_nip },
    `POST_credential_question_with_id
    id_chapter: ${id_chapter}
    number: ${number}
    question: ${question}`
  );
}

export async function POST_credential_subquestion(
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
    VALUES (@id_question, @number, @question, @create_nip)`,
    { id_question, number, question, create_nip },
    `POST_credential_subquestion
    id_question: ${id_question}
    number: ${number}
    question: ${question}`
  );
}

// Main function to copy entire hierarchy
export async function POST_copy_credential_hierarchy(
  old_document_id: number,
  new_document_id: number
) {
  try {
    // Get all chapters from old document
    const oldChapters = await GET_credential_chapters_by_document(
      old_document_id
    );

    if (!oldChapters || oldChapters.length === 0) {
      return { success: true, message: "No chapters to copy" };
    }

    // Copy each chapter and its nested structure
    for (const oldChapter of oldChapters) {
      // Insert new chapter
      const newChapterId = await POST_credential_chapter_with_id(
        new_document_id,
        oldChapter.number,
        oldChapter.question
      );

      if (newChapterId) {
        // Get all questions from old chapter
        const oldQuestions = await GET_credential_questions_by_chapter(
          oldChapter.id
        );

        if (oldQuestions && oldQuestions.length > 0) {
          for (const oldQuestion of oldQuestions) {
            // Insert new question
            const newQuestionId = await POST_credential_question_with_id(
              newChapterId,
              oldQuestion.number,
              oldQuestion.question
            );

            if (newQuestionId) {
              // Get all subquestions from old question
              const oldSubquestions =
                await GET_credential_subquestions_by_question(oldQuestion.id);

              if (oldSubquestions && oldSubquestions.length > 0) {
                for (const oldSubquestion of oldSubquestions) {
                  // Insert new subquestion
                  await POST_credential_subquestion(
                    newQuestionId,
                    oldSubquestion.number,
                    oldSubquestion.question
                  );
                }
              }
            }
          }
        }
      }
    }

    return { success: true, message: "Hierarchy copied successfully" };
  } catch (error) {
    console.error("Error copying credential hierarchy:", error);
    return { success: false, message: "Failed to copy hierarchy", error };
  }
}
