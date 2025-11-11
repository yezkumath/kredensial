"use server";
import {
  getDataQuery, // untuk select
} from "./sqlExecutor";
import { EmployeesData } from "./interface";

// TABLE tb_employees
export async function GET_data_employee(): Promise<EmployeesData[] | null> {
  return await getDataQuery(
    `
    SELECT nip, nama FROM tb_employees`,
    {},
    `GET_data_employee`
  );
}

// TABLE vEmployee db_HRPROJECT
export async function GET_data_employee_perawat(): Promise<
  EmployeesData[] | null
> {
  return await getDataQuery(
    `
    SELECT nip, nama, unit, profesi FROM vEmployee where profesi LIKE '%perawat%'`,
    {},
    `GET_data_employee_perawat`
  );
}

export async function GET_data_employee_farmasi(): Promise<
  EmployeesData[] | null
> {
  return await getDataQuery(
    `
    SELECT nip, nama, unit, profesi FROM vEmployee where profesi LIKE '%farmasi%'`,
    {},
    `GET_data_employee_farmasi`
  );
}

export async function GET_data_employee_fisioterapis(): Promise<
  EmployeesData[] | null
> {
  return await getDataQuery(
    `
    SELECT nip, nama, unit, profesi FROM vEmployee where profesi LIKE '%fisioterapis%'`,
    {},
    `GET_data_employee_fisioterapis`
  );
}
