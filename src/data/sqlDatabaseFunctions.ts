// import Database from "@tauri-apps/plugin-sql";

// // Function to create tables in the database
// export const createTable = async (
//   db: Database,
//   tableName: string,
//   columns: DataColumnDict
// ): Promise<void> => {
//   try {
//     await db.execute(`DROP TABLE IF EXISTS ${tableName};`);
//   } catch (error) {
//     console.error(`Error dropping table '${tableName}':`, error);
//     return;
//   }

//   // Dynamically construct the column definitions from DataColumnDict
//   const columnDefinitions = Object.values(columns)
//     .map((column) => `"${column.sqlTableHeader}" ${column.sqlText}`)
//     .join(", ");

//   // Construct the SQL command to create the table
//   const createTableSQL = `
//       CREATE TABLE IF NOT EXISTS ${tableName} (
//         ${columnDefinitions}
//       );
//     `;

//   try {
//     // Execute the SQL command
//     await db.execute(createTableSQL);
//   } catch (error) {
//     console.error(`Error creating table '${tableName}':`, error);
//   }
// };

// export const getTableInfo = async (db: Database, tableName: string) => {
//   const tableInfoSQL = `PRAGMA table_info(${tableName});`;
//   try {
//     const rows = await db.select(tableInfoSQL);
//     return rows;
//   } catch (error) {
//     console.error(`Error fetching table info for '${tableName}':`, error);
//     return [];
//   }
// };
// export const insertOrUpdateRecords = async (
//   db: Database,
//   sqlTableName: string,
//   columnDict: DataColumnDict,
//   headers: string[],
//   records: DataRowT[]
// ) => {
//   if (records.length === 0) {
//     console.warn("No records to insert or update.");
//     return;
//   }

//   // Identify conflict resolution column dynamically
//   const conflictColumn = Object.values(columnDict).find((col) =>
//     col.sqlText.includes("UNIQUE")
//   )?.sqlTableHeader;

//   // Map headers to SQL table columns
//   const mappedColumns = headers.reduce((acc, header) => {
//     const mappedColumn = Object.values(columnDict).find(
//       (col) =>
//         col.googleSheetHeader?.trim().toLowerCase() ===
//         header.trim().toLowerCase()
//     );
//     if (mappedColumn) {
//       acc.push(mappedColumn.sqlTableHeader);
//     } else {
//       console.warn(`No mapping found for header: ${header}`);
//     }
//     return acc;
//   }, [] as string[]);

//   if (mappedColumns.length === 0) {
//     console.error(
//       `No valid columns were mapped for tab: ${columnDict.sqlTableName}. Check columnDict mappings.`
//     );
//     return;
//   }

//   // Prepare SQL columns and placeholders
//   const sqlColumns = mappedColumns.map((col) => `"${col}"`).join(", ");
//   const placeholders = mappedColumns.map(() => "?").join(", ");

//   const insertOrUpdateSQL = conflictColumn
//     ? `
//       INSERT INTO ${sqlTableName} (${sqlColumns})
//       VALUES (${placeholders})
//       ON CONFLICT (${conflictColumn}) DO UPDATE SET
//       ${mappedColumns.map((col) => `${col} = excluded.${col}`).join(", ")};
//     `
//     : `
//       INSERT INTO ${sqlTableName} (${sqlColumns})
//       VALUES (${placeholders});
//     `;

//   // Process each row
//   for (const row of records) {
//     const transformedRow = mappedColumns.map((col) => {
//       if (!col) {
//         console.warn("No column found for header:", col);
//         return null;
//       }
//       const colDict = Object.values(columnDict).find(
//         (colDef) => colDef.sqlTableHeader === col
//       );

//       const rawValue = colDict ? row[colDict.id] : null
//       if (rawValue === undefined || rawValue === "N/A") {
//         return colDict && colDict.columnDef && colDict.columnDef.cell ? colDict.columnDef.cell.value.default : null; // Provide default values if needed
//       }
//       // Ensure rawValue is a string for the toSqlConverter
//       const stringValue =
//         typeof rawValue === "string" ? rawValue : JSON.stringify(rawValue);

//       return colDict?.toSqlConverter
//         ? colDict.toSqlConverter(stringValue)
//         : stringValue;
//     });

//     try {
//       await db.execute(insertOrUpdateSQL, transformedRow);
//     } catch (error) {
//       console.error(
//         `Error inserting/updating record in '${sqlTableName}':`,
//         transformedRow,
//         error
//       );
//     }
//   }
// };

// export const fetchRecords = async <T>(
//   db: Database,
//   tableName: string
// ): Promise<T[]> => {
//   const fetchSQL = `
//     SELECT * FROM ${tableName};
//   `;
//   try {
//     const rows = await db.select<T[]>(fetchSQL); // Ensure rows match the type `T[]`
//     return rows;
//   } catch (error) {
//     console.error("Error fetching records:", error);
//     return [];
//   }
// };

// export const deleteRecord = async (
//   db: Database,
//   tableName: string,
//   id: string
// ) => {
//   const deleteSQL = `
//     DELETE FROM ${tableName}
//     WHERE id = ?;
//   `;
//   try {
//     await db.execute(deleteSQL, [id]);
//   } catch (error) {
//     console.error(`Error deleting record from '${tableName}':`, error);
//   }
// };
