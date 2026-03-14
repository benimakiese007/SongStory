const fs = require('fs');
const path = require('path');

const exportDir = path.join(__dirname, '../tmp/supabase_export');
const seedFile = path.join(exportDir, 'seed.sql');

function escapeString(str) {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''") + "'";
}

function jsonToInsert(tableName, data) {
    if (!data || data.length === 0) return '';
    const keys = Object.keys(data[0]);
    let sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES\n`;

    const values = data.map(row => {
        const vals = keys.map(k => {
            const val = row[k];
            if (val === null || val === undefined) return 'NULL';
            if (typeof val === 'number' || typeof val === 'boolean') return val;
            if (Array.isArray(val)) {
                if (val.length === 0) return "'{}'";
                const arrVals = val.map(v => escapeString(v)).join(', ');
                return `ARRAY[${arrVals}]`;
            }
            if (typeof val === 'object') return escapeString(JSON.stringify(val)) + '::jsonb';
            return escapeString(val);
        });
        return `(${vals.join(', ')})`;
    });

    sql += values.join(',\n') + ' ON CONFLICT DO NOTHING;\n\n';
    return sql;
}

const tables = ['artists', 'songs', 'song_contents', 'glossary'];
let finalSql = '';

tables.forEach(table => {
    const file = path.join(exportDir, `${table}.json`);
    if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        finalSql += '-- Seeding ' + table + '\n' + jsonToInsert(table, data);
    }
});

fs.writeFileSync(seedFile, finalSql, 'utf8');
console.log('Seed file generated: ' + seedFile);
