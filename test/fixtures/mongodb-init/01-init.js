// MongoDB initialization script for testing
// This runs automatically when MongoDB container starts

db = db.getSiblingDB('notion_calendar_test');

// Create collections
db.createCollection('test_users');
db.createCollection('test_events');
db.createCollection('test_sessions');

// Create indexes
db.test_users.createIndex({ email: 1 }, { unique: true });
db.test_events.createIndex({ userId: 1 });
db.test_events.createIndex({ startTime: 1, endTime: 1 });
db.test_sessions.createIndex({ userId: 1 });
db.test_sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Insert sample test data
db.test_users.insertMany([
  {
    email: 'mongo_test1@example.com',
    name: 'MongoDB Test User 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'mongo_test2@example.com',
    name: 'MongoDB Test User 2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);

print('MongoDB test database initialized successfully');
