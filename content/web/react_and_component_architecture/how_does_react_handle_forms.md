React handles forms by providing a declarative approach where form elements are controlled by React state. Instead of the DOM managing form data, React state becomes the "single source of truth," enabling real-time validation, conditional rendering, and dynamic behavior.

**Controlled forms (recommended approach):**

```jsx
function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
      </div>

      <label>
        <input
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleChange}
        />
        I agree to the terms
      </label>

      <button type="submit" disabled={!formData.agreeToTerms}>
        Sign Up
      </button>
    </form>
  );
}
```

**Custom form hooks:**

```javascript
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validate({ [name]: values[name] });
    setErrors(prev => ({ ...prev, ...fieldErrors }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit };
}
```

**Form libraries:**

```jsx
// React Hook Form — popular library for forms
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password', { required: true, minLength: 8 })} />
      {errors.password && <span>Password must be at least 8 characters</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

**Handling file uploads:**

```jsx
function FileUpload() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    await fetch('/api/upload', { method: 'POST', body: formData });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Upload</button>
    </form>
  );
}
```

**Multi-step forms:**

```jsx
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  switch (step) {
    case 1: return <Step1 onNext={nextStep} data={formData} />;
    case 2: return <Step2 onNext={nextStep} onBack={prevStep} data={formData} />;
    case 3: return <Step3 data={formData} />;
  }
}
```

**Key points:**

1. Always use `e.preventDefault()` on form submission to prevent page reload
2. Use `onChange` handlers to update state on every keystroke for controlled inputs
3. Validate on submit and optionally on blur (real-time validation on every keystroke can be annoying)
4. For complex forms, use libraries like React Hook Form or Formik
5. Use the `FormData` API for file uploads
6. Disable the submit button while submitting to prevent double submissions
