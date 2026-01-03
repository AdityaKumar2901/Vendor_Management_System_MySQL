const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let db = null;
const dbPath = path.join(__dirname, '../../vendor_management.db');

// Initialize database
async function initDatabase() {
  try {
    const SQL = await initSqlJs();
    
    // Check if database file exists
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
      console.log('✅ Database loaded from file');
    } else {
      db = new SQL.Database();
      console.log('✅ New database created');
      
      // Initialize schema
      const schemaPath = path.join(__dirname, '../../database/schema.sqlite.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema);
        saveDatabase();
        console.log('✅ Database schema initialized');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    fs.writeFileSync(dbPath, data);
  }
}

// Query helper (compatible with MySQL-style placeholders)
async function query(sql, params = []) {
  if (!db) {
    await initDatabase();
  }
  
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  // Convert MySQL ? placeholders to sql.js $1, $2, etc
  let paramIndex = 1;
  const sqliteSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
  
  // Convert null/undefined to proper SQLite NULL
  const cleanParams = params.map(param => {
    if (param === null || param === undefined) {
      return null;
    }
    return param;
  });
  
  try {
    const stmt = db.prepare(sqliteSql);
    stmt.bind(cleanParams);
    
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    
    // Save after modifications
    if (sql.trim().toUpperCase().startsWith('INSERT') || 
        sql.trim().toUpperCase().startsWith('UPDATE') ||
        sql.trim().toUpperCase().startsWith('DELETE')) {
      
      let insertId = null;
      
      // Get last insert ID for INSERT statements
      if (sql.trim().toUpperCase().startsWith('INSERT')) {
        try {
          const lastIdStmt = db.prepare('SELECT last_insert_rowid() as id');
          lastIdStmt.step();
          const result = lastIdStmt.getAsObject();
          insertId = result.id;
          lastIdStmt.free();
        } catch (err) {
          console.error('Error getting last insert id:', err);
        }
      }
      
      saveDatabase();
      
      // Return format similar to MySQL
      if (sql.trim().toUpperCase().startsWith('INSERT')) {
        return [[{ insertId: insertId, affectedRows: 1 }], null];
      }
      return [[{ affectedRows: 1 }], null];
    }
    
    return [results, null];
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Test database connection
async function testConnection() {
  return await initDatabase();
}

// Get database instance
function getDB() {
  return db;
}

module.exports = { query, testConnection, getDB, saveDatabase, initDatabase };
