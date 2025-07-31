import Logger from '../../logger.js';

function needsMigration(db) {
  try {
    const hasColumn = db
      .prepare(`
        SELECT COUNT(*) as count
        FROM pragma_table_info('snippets')
        WHERE name = 'display_username'
      `)
      .get();

    return hasColumn.count === 0;
  } catch (error) {
    Logger.error('v1.7.0-display-username - Error checking migration status:', error);
    throw error;
  }
}

async function up_v1_7_0_display_username(db) {
  if (!needsMigration(db)) {
    Logger.debug('v1.7.0-display-username - Migration not needed');
    return;
  }

  Logger.debug('v1.7.0-display-username - Starting migration...');

  try {
    db.exec(`
      ALTER TABLE snippets ADD COLUMN display_username TEXT;
    `);

    Logger.debug('v1.7.0-display-username - Migration completed successfully');
  } catch (error) {
    Logger.error('v1.7.0-display-username - Migration failed:', error);
    throw error;
  }
}

export { up_v1_7_0_display_username };