import Database from "@tauri-apps/plugin-sql";

// Function to create tables in the database
export const createTable = async (
  db: Database,
  tableName: string,
  columns: DataColumnDict
): Promise<void> => {

  try {
    await db.execute(`DROP TABLE IF EXISTS ${tableName};`);
   
  } catch (error) {
    console.error(`Error dropping table '${tableName}':`, error);
    return;
  }


  // Dynamically construct the column definitions from DataColumnDict
  const columnDefinitions = Object.values(columns)
    .map((column) => `"${column.sqlTableHeader}" ${column.sqlText}`)
    .join(", ");

  // Construct the SQL command to create the table
  const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columnDefinitions}
      );
    `;

  try {
    // Execute the SQL command
    await db.execute(createTableSQL)
  } catch (error) {
    console.error(`Error creating table '${tableName}':`, error);
  }
};

export const getTableInfo = async (db: Database, tableName: string) => {
  const tableInfoSQL = `PRAGMA table_info(${tableName});`;
  try {
    const rows = await db.select(tableInfoSQL);
    return rows;
  } catch (error) {
    console.error(`Error fetching table info for '${tableName}':`, error);
    return [];
  }
};



export const insertOrUpdateRecords = async (
  db: Database,
  tab: TabOption,
  records: Record<string, any>[],
) => {
  if (records.length === 0) {
    console.warn("No records to insert or update.");
    return;
  }

  if (!tab.columnDict || tab.columnDict === undefined) {
    console.warn("No column mappings found.");
    return;
  }

 

  // Determine the conflict resolution column dynamically
  const conflictColumn = Object.values(tab.columnDict).find(
    (col) => col.sqlText.includes("UNIQUE")
  )?.sqlTableHeader;

  const transformedRecords = records.map((record) =>
    Object.keys(record).reduce((acc, key) => {
      const mappedColumn = tab.columnDict && Object.values(tab.columnDict).find(
        (col) => col.googleSheetHeader === key
      );
      if (mappedColumn) {
        acc[mappedColumn.sqlTableHeader] = record[key];
      } else {
        console.warn(`No mapping found for Google Sheet header: ${key}`);
      }
      return acc;
    }, {} as Record<string, any>)
  );

  if (transformedRecords.length === 0) {
    console.warn("No records transformed due to missing mappings.");
    return;
  }

  const columns = Object.keys(transformedRecords[0]).map((col) => `"${col}"`);
  const placeholders = columns.map(() => "?").join(", ");

  // Construct UPSERT SQL based on whether a conflict column exists
  const insertOrUpdateSQL = conflictColumn
    ? `
      INSERT INTO ${tab.sqlTableName} (${columns.join(", ")})
      VALUES (${placeholders})
      ON CONFLICT (${conflictColumn}) DO UPDATE SET
      ${columns.map((col) => `${col} = excluded.${col}`).join(", ")};
    `
    : `
      INSERT INTO ${tab.sqlTableName} (${columns.join(", ")})
      VALUES (${placeholders});
    `;

  try {
    for (const record of transformedRecords) {
      const values = Object.values(record);
      await db.execute(insertOrUpdateSQL, values);
    }
  } catch (error) {
    console.error(`Error inserting/updating records in '${tab.sqlTableName}':`, error);
  }
};

export const fetchRecords = async <T>(db: Database, tableName: string): Promise<T[]> => {
  const fetchSQL = `
    SELECT * FROM ${tableName};
  `;
  try {
    const rows = await db.select<T[]>(fetchSQL); // Ensure rows match the type `T[]`
    return rows;
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};