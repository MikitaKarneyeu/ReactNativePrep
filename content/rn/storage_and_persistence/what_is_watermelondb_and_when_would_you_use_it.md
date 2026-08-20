WatermelonDB is a high-performance, reactive database for React Native built on top of SQLite. It's designed for apps that need to handle large amounts of structured data with excellent performance and seamless React integration.

**Key features:**

1. **Lazy loading**: Records are only loaded into memory when accessed, making it possible to work with databases containing hundreds of thousands of records without memory issues.

2. **Reactive queries**: Queries automatically update your React components when data changes, similar to how React re-renders when state changes.

3. **Built on SQLite**: Uses SQLite under the hood for reliability, performance, and SQL query capabilities.

4. **Synchronous reads**: Data access is synchronous after initial load, avoiding async/await overhead in components.

5. **Batch operations**: Optimized for bulk inserts and updates (e.g., syncing thousands of records from a server).

**Basic setup:**

```bash
npm install @nozbe/watermelondb @nozbe/with-observables
```

**Defining a model:**

```tsx
import { Model } from '@nozbe/watermelondb';
import { field, date, children, text, relation } from '@nozbe/watermelondb/decorators';

class Post extends Model {
  static table = 'posts';
  static associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
    author: { type: 'belongs_to', key: 'author_id' },
  }

  @text('title') title;
  @text('body') body;
  @field('is_published') isPublished;
  @date('created_at') createdAt;
  @children('comments') comments;
  @relation('authors', 'author_id') author;
}
```

**Defining the schema:**

```tsx
import { appSchema, tableSchema } from '@nozbe/watermelondb';

const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'posts',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'body', type: 'string' },
        { name: 'is_published', type: 'boolean' },
        { name: 'author_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'comments',
      columns: [
        { name: 'body', type: 'string' },
        { name: 'post_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
```

**Using in components:**

```tsx
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';

// Reactive component - re-renders when posts change
const enhance = withObservables(['database'], ({ database }) => ({
  posts: database.get('posts').query(
    Q.where('is_published', true),
    Q.sortBy('created_at', Q.desc),
  ),
}));

const PostList = enhance(({ posts }) => (
  <FlatList
    data={posts}
    renderItem={({ item }) => <PostCard post={item} />}
    keyExtractor={(item) => item.id}
  />
));
```

**Writing data:**

```tsx
// Create
await database.write(async () => {
  await database.get('posts').create((post) => {
    post.title = 'Hello World';
    post.body = 'My first post';
    post.isPublished = true;
  });
});

// Update
await database.write(async () => {
  await post.update((p) => {
    p.title = 'Updated Title';
    p.isPublished = true;
  });
});

// Delete
await database.write(async () => {
  await post.destroyPermanently();
});

// Batch operations (fast!)
await database.write(async () => {
  const posts = database.get('posts');
  await database.batch(
    posts.prepareCreate((p) => { p.title = 'Post 1'; }),
    posts.prepareCreate((p) => { p.title = 'Post 2'; }),
    posts.prepareCreate((p) => { p.title = 'Post 3'; }),
  );
});
```

**When to use WatermelonDB:**

- **Large datasets**: 10,000+ records that need to be queried and displayed
- **Offline-first apps**: Data needs to be stored locally and synced with a server
- **Reactive UI**: Components should automatically update when data changes
- **Complex relationships**: Data has many-to-many or one-to-many relationships
- **Performance-critical**: You need fast reads and writes with large data

**When NOT to use WatermelonDB:**
- Simple key-value storage (use AsyncStorage/MMKV)
- Small datasets (< 1000 items) with no query needs
- Real-time sync with a backend (consider Realm with MongoDB sync)
- When you need raw SQL access (use SQLite directly)

**WatermelonDB vs alternatives:**

| Feature | WatermelonDB | SQLite (direct) | Realm |
|---|---|---|---|
| React integration | Excellent (reactive) | Manual | Good (live objects) |
| Lazy loading | Yes | No | Yes |
| Performance (large data) | Excellent | Good | Good |
| Learning curve | Moderate | Low | Moderate |
| Sync capabilities | Manual implementation | Manual | Built-in (MongoDB) |

WatermelonDB is my go-to choice for apps with significant local data requirements, especially offline-first applications with complex data models.
