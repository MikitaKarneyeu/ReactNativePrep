SQLite and AsyncStorage serve different purposes. AsyncStorage is a simple key-value store, while SQLite is a full relational database. The choice depends on the complexity and scale of your data.

**Use SQLite when:**

**1. You need complex queries**: SQLite supports SQL, allowing you to filter, sort, join, and aggregate data efficiently:

```sql
-- Find all orders over $100 from the last 30 days, sorted by date
SELECT * FROM orders
WHERE total > 100 AND created_at > datetime('now', '-30 days')
ORDER BY created_at DESC;

-- Count orders per customer
SELECT customer_id, COUNT(*) as order_count, SUM(total) as total_spent
FROM orders
GROUP BY customer_id
HAVING total_spent > 500;
```

With AsyncStorage, you'd have to load all data and filter in JavaScript, which is extremely slow for large datasets.

**2. You have large datasets**: SQLite handles thousands or millions of records efficiently through indexing and query optimization. AsyncStorage degrades significantly beyond a few hundred keys.

**3. You need indexing**: SQLite indexes make lookups by specific fields fast:

```sql
CREATE INDEX idx_users_email ON users(email);
-- Now SELECT * FROM users WHERE email = ? is fast
```

**4. You need relationships between data**: Foreign keys and joins let you model relationships:

```sql
CREATE TABLE authors (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author_id INTEGER,
  FOREIGN KEY (author_id) REFERENCES authors(id));

SELECT books.title, authors.name
FROM books
JOIN authors ON books.author_id = authors.id;
```

**5. You need transactions**: SQLite provides ACID transactions for data consistency:

```sql
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

**6. You need full-text search**: SQLite has FTS5 for fast text searching:

```sql
CREATE VIRTUAL TABLE articles USING fts5(title, content);
SELECT * FROM articles WHERE articles MATCH 'react native';
```

**Using SQLite in React Native:**

```tsx
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'app.db', location: 'default' });

// Create table
db.executeSql(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert
db.executeSql('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Buy milk', 0]);

// Query
const [results] = await db.executeSql(
  'SELECT * FROM todos WHERE completed = ? ORDER BY created_at DESC',
  [0]
);
const todos = results.rows.raw();
```

**Use AsyncStorage when:**
- Simple key-value pairs (settings, flags, small caches)
- Data doesn't need querying or relationships
- Fewer than 100-200 keys
- Quick prototyping
- Simple state persistence

**Use MMKV when:**
- AsyncStorage's use case but you need better performance
- Synchronous access is needed
- Frequently accessed key-value data

**Summary table:**

| Feature | AsyncStorage | MMKV | SQLite |
|---|---|---|---|
| Data model | Key-value | Key-value | Relational |
| Querying | None | None | Full SQL |
| Indexing | No | No | Yes |
| Transactions | No | No | Yes |
| Performance (large data) | Poor | Good | Excellent |
| Complexity | Very low | Very low | Moderate |
| Best for | Simple settings | Fast settings | Structured data |

For most apps, I use MMKV for settings/state persistence and SQLite for business data that needs querying.
