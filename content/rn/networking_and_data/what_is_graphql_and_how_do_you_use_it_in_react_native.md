GraphQL is a query language for APIs that allows clients to request exactly the data they need in a single request. Unlike REST where endpoints return fixed data structures, GraphQL gives clients control over the shape and size of the response.

**Core concepts:**

- **Query**: Read data (GET equivalent)
- **Mutation**: Write data (POST/PUT/DELETE equivalent)
- **Subscription**: Real-time data updates via WebSocket
- **Schema**: Defines available types and operations
- **Resolver**: Server-side functions that fetch data

**Basic GraphQL query:**

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts {
      id
      title
    }
  }
}
```

**Using GraphQL in React Native with Apollo Client:**

```tsx
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
});

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

function UsersScreen() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data.users}
      renderItem={({ item }) => <UserCard user={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <UsersScreen />
    </ApolloProvider>
  );
}
```

**Mutations:**

```tsx
import { useMutation } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

function CreateUserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleSubmit = async () => {
    await createUser({ variables: { name, email } });
    navigation.goBack();
  };

  return (
    <View>
      <TextInput value={name} onChangeText={setName} placeholder="Name" />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <Button title="Create" onPress={handleSubmit} disabled={loading} />
    </View>
  );
}
```

**Subscriptions for real-time data:**

```tsx
import { useSubscription } from '@apollo/client';

const ON_NEW_MESSAGE = gql`
  subscription OnNewMessage($chatId: ID!) {
    messageAdded(chatId: $chatId) {
      id
      text
      sender { name }
      createdAt
    }
  }
`;

function ChatMessages({ chatId }) {
  const { data, loading } = useSubscription(ON_NEW_MESSAGE, {
    variables: { chatId },
  });

  // Handle new messages
}
```

**Caching with Apollo Client:**

```tsx
const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            // Merge paginated results
            keyArgs: ['filter'],
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
```

**Alternative: urql (lighter weight):**

```tsx
import { createClient, Provider, useQuery, gql } from 'urql';

const client = createClient({
  url: 'https://api.example.com/graphql',
});

function App() {
  return (
    <Provider value={client}>
      <UsersScreen />
    </Provider>
  );
}
```

**Alternative: TanStack Query with GraphQL:**

```tsx
import { useQuery } from '@tanstack/react-query';

function useGraphQLQuery(query, variables) {
  return useQuery({
    queryKey: [query, variables],
    queryFn: () =>
      fetch('https://api.example.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      }).then((res) => res.json()),
  });
}
```

**Advantages of GraphQL over REST:**
- Fetch exactly the data you need (no over-fetching)
- Single request for related data (no under-fetching)
- Strongly typed schema
- Built-in introspection
- Real-time subscriptions

**Challenges:**
- More complex setup than REST
- Caching is more complex (normalized cache)
- File uploads require multipart extensions
- Learning curve for the query language
- Server-side complexity for resolvers

**Best practices:**
- Use fragments for reusable field selections
- Implement proper error handling
- Use Apollo DevTools for debugging
- Keep queries close to components that use them
- Use code generation (GraphQL Code Generator) for TypeScript types
- Implement optimistic UI updates for mutations
