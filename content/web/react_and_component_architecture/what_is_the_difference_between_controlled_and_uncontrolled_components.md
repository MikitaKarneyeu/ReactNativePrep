Controlled and uncontrolled components are two approaches to handling form inputs in React. The difference lies in who controls the form input's value — React (controlled) or the DOM (uncontrolled).

**Controlled components** — React controls the input value via state:

```jsx
function ControlledForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}           // Value comes from React state
        onChange={(e) => setName(e.target.value)} // State updates on every keystroke
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Uncontrolled components** — The DOM controls the value; you read it when needed:

```jsx
function UncontrolledForm() {
  const nameRef = useRef();
  const emailRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name: nameRef.current.value,
      email: emailRef.current.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={nameRef} defaultValue="" />
      <input type="email" ref={emailRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Key differences:**

| Aspect | Controlled | Uncontrolled |
|--------|-----------|--------------|
| Value source | React state | DOM |
| Value access | `useState` | `ref.current.value` |
| Validation | Real-time (on every keystroke) | On submit |
| Input modification | Easy (programmatic) | Requires DOM manipulation |
| Re-renders | On every keystroke | Only on submit |
| Dynamic behavior | Easy (conditional enabling, formatting) | Harder |
| Initial value | `value` prop | `defaultValue` prop |

**When to use controlled:**

- When you need real-time validation
- When you need to conditionally enable/disable submit
- When you need to format input (e.g., phone numbers, credit cards)
- When multiple inputs depend on each other
- When you need to programmatically modify input values
- Most forms in practice

```jsx
// Real-time validation
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleEmailChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  setError(value && !isValidEmail(value) ? 'Invalid email' : '');
};

// Dynamic formatting
const [phone, setPhone] = useState('');
const handlePhoneChange = (e) => {
  const formatted = formatPhoneNumber(e.target.value);
  setPhone(formatted);
};
```

**When to use uncontrolled:**

- When you only need the value on submit
- When integrating with non-React code
- When performance is critical (large forms with many inputs)
- When file inputs are needed (file inputs are always uncontrolled)
- When building simple forms quickly

```jsx
// File inputs must be uncontrolled
<input type="file" ref={fileRef} />

// Quick form with uncontrolled inputs
function QuickSearch() {
  const inputRef = useRef();
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      search(inputRef.current.value);
    }}>
      <input ref={inputRef} defaultValue="" />
      <button>Search</button>
    </form>
  );
}
```

**Hybrid approach:**

```jsx
// defaultValue for initial value, then controlled
const [name, setName] = useState(initialData?.name ?? '');

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

**File inputs are always uncontrolled** because their value is read-only for security reasons:

```jsx
function FileUpload() {
  const fileRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch('/api/upload', { method: 'POST', body: formData });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} />
      <button>Upload</button>
    </form>
  );
}
```

In practice, controlled components are the recommended default in React because they give you full control over the form state and enable real-time validation and dynamic behavior.
