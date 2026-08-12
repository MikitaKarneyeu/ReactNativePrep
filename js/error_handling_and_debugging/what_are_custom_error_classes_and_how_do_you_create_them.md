Custom error classes extend the built-in `Error` class to create domain-specific error types. This allows you to distinguish between different kinds of errors and handle them appropriately.

```js
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.id = id;
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}
```

Usage with targeted error handling:

```js
async function getUser(id) {
  if (!id) throw new ValidationError('id', 'ID is required');

  const user = await db.users.findById(id);
  if (!user) throw new NotFoundError('User', id);

  return user;
}

try {
  const user = await getUser(null);
} catch (err) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ field: err.field, message: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message });
  }
  throw err; // unknown error — rethrow
}
```

Important implementation details:

1. **Set `this.name`**: This ensures `error.name` reflects your custom type, which improves logging and serialization.

2. **Call `super()`**: Required to set the `message` property and capture the stack trace. Must be called before using `this`.

3. **Stack trace**: In V8 (Node.js/Chrome), you can capture a cleaner stack trace:

```js
class AppError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

4. **Extending built-in errors**: You can extend `TypeError`, `RangeError`, etc.:

```js
class InvalidEmailError extends TypeError {
  constructor(email) {
    super(`Invalid email: ${email}`);
    this.name = 'InvalidEmailError';
    this.email = email;
  }
}
```

Custom error classes enable expressive, self-documenting error handling where different error types trigger different recovery strategies.
