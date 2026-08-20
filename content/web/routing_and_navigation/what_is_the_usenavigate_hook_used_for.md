`useNavigate` is a React Router hook that returns a function for programmatic navigation. It allows you to navigate users to different routes from JavaScript code — after form submissions, authentication, button clicks, or any other event — without using `<Link>` or `<NavLink>` components.

**Basic usage:**

```jsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      navigate('/dashboard'); // Navigate to dashboard after login
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Navigation methods:**

```jsx
const navigate = useNavigate();

// Navigate to a path
navigate('/dashboard');
navigate('/users/123');

// Navigate with query params
navigate('/search?q=react&page=2');

// Navigate relative to current route
navigate('..');          // Go up one level
navigate('../settings'); // Sibling route

// Navigate with replace (no new history entry)
navigate('/login', { replace: true });

// Navigate with state (invisible to the URL)
navigate('/dashboard', { state: { from: 'login', message: 'Welcome!' } });

// Go back/forward in history
navigate(-1); // Go back
navigate(1);  // Go forward
```

**Accessing navigation state:**

```jsx
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const message = location.state?.message;

  return message ? <div className="alert">{message}</div> : null;
}
```

**Common use cases:**

**1. After authentication:**
```jsx
function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (credentials) => {
    await login(credentials);
    const returnTo = location.state?.from?.pathname || '/dashboard';
    navigate(returnTo, { replace: true });
  };
}
```

**2. After form submission:**
```jsx
function CreatePost() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const post = await createPost(data);
    navigate(`/posts/${post.id}`); // Navigate to the new post
  };
}
```

**3. Redirecting conditionally:**
```jsx
function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart, navigate]);

  return <CheckoutForm />;
}
```

**4. Confirmation dialogs:**
```jsx
function DeleteButton({ itemId }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure?');
    if (confirmed) {
      await deleteItem(itemId);
      navigate('/items', { replace: true });
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

**5. Multi-step forms (wizard):**
```jsx
function Step1() {
  const navigate = useNavigate();

  const handleNext = (data) => {
    saveStepData(1, data);
    navigate('/checkout/step-2');
  };

  return <Step1Form onNext={handleNext} />;
}

function Step2() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/checkout/step-1');
  const handleNext = (data) => {
    saveStepData(2, data);
    navigate('/checkout/step-3');
  };

  return <Step2Form onBack={handleBack} onNext={handleNext} />;
}
```

**Preventing navigation (unsaved changes):**

```jsx
import { useBlocker } from 'react-router-dom';

function EditForm() {
  const [isDirty, setIsDirty] = useState(false);

  // React Router v6.4+ blocker
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return isDirty && currentLocation.pathname !== nextLocation.pathname;
  });

  if (blocker.state === 'blocked') {
    return (
      <div>
        <p>You have unsaved changes. Leave anyway?</p>
        <button onClick={() => blocker.proceed()}>Leave</button>
        <button onClick={() => blocker.reset()}>Stay</button>
      </div>
    );
  }
}
```

**`useNavigate` vs `<Link>` vs `<Navigate>`:**

| Approach | Use case |
|----------|----------|
| `<Link>` / `<NavLink>` | User-initiated navigation (clicking a link) |
| `useNavigate()` | Programmatic navigation (after events, conditionally) |
| `<Navigate>` | Declarative redirect in JSX (component-level redirect) |

Prefer `<Link>` for navigation that users initiate directly. Use `useNavigate()` for navigation triggered by logic (form submission, authentication check, etc.).
