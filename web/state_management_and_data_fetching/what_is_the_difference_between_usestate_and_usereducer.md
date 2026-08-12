`useState` and `useReducer` are both React hooks for managing component state. They differ in complexity, the type of state transitions they handle well, and how state updates are triggered.

**`useState`** — Simple state with direct updates:

```javascript
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [items, setItems] = useState([]);

// Direct update
setCount(5);

// Functional update (when new state depends on previous)
setCount(prev => prev + 1);

// Object state
const [form, setForm] = useState({ name: '', email: '' });
setForm(prev => ({ ...prev, name: 'Alice' }));
```

**`useReducer`** — Complex state with dispatched actions:

```javascript
const initialState = { items: [], loading: false, error: null };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const [state, dispatch] = useReducer(cartReducer, initialState);

// Dispatch actions
dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Shirt', quantity: 1 } });
dispatch({ type: 'REMOVE_ITEM', payload: 1 });
dispatch({ type: 'UPDATE_QUANTITY', payload: { id: 1, quantity: 3 } });
```

**When to use each:**

| Use `useState` when | Use `useReducer` when |
|---------------------|----------------------|
| Simple state (numbers, strings, booleans) | Complex state (objects with many fields) |
| Independent state updates | Related state that changes together |
| Few state transitions | Many different state transitions |
| State is easy to manage | State logic is complex |
| Quick prototyping | Need predictable state transitions |

**`useState` becomes hard to manage when:**

```javascript
// Multiple related state values
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [total, setTotal] = useState(0);

// Complex updates with multiple set calls
async function addItem(newItem) {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/items', { method: 'POST', body: JSON.stringify(newItem) });
    const item = await response.json();
    setItems(prev => [...prev, item]);
    setTotal(prev => prev + item.price);
    setLoading(false);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
}
```

**The same logic with `useReducer`:**

```javascript
function itemsReducer(state, action) {
  switch (action.type) {
    case 'ADD_START':
      return { ...state, loading: true, error: null };
    case 'ADD_SUCCESS':
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price
      };
    case 'ADD_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(itemsReducer, {
  items: [], loading: false, error: null, total: 0
});

async function addItem(newItem) {
  dispatch({ type: 'ADD_START' });
  try {
    const response = await fetch('/api/items', { method: 'POST', body: JSON.stringify(newItem) });
    const item = await response.json();
    dispatch({ type: 'ADD_SUCCESS', payload: item });
  } catch (err) {
    dispatch({ type: 'ADD_ERROR', payload: err.message });
  }
}
```

**`useReducer` benefits:**

1. **Predictable updates** — All state changes go through the reducer, making them easy to trace and debug
2. **Testable** — Reducer is a pure function, easy to unit test
3. **Centralized logic** — All update logic is in one place
4. **Works well with Context** — Combine `useReducer` + `useContext` for simple global state management

**Equivalence:** `useState` is actually implemented using `useReducer` internally. You can always replace one with the other — the choice is about code organization and clarity.
