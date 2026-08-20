CSS-in-JS is an approach to styling where CSS is written directly in JavaScript. Styled Components is the most popular CSS-in-JS library, but others include Emotion, Stitches, and Vanilla Extract. These approaches scope styles to components, support dynamic styling based on props, and eliminate class name conflicts.

**Styled Components basics:**

```jsx
import styled from 'styled-components';

// Create a styled component
const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
`;

// Dynamic styles with props
const PrimaryButton = styled(Button)`
  background: ${props => props.variant === 'danger' ? '#e74c3c' : '#3498db'};
  color: white;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

// Usage
function App() {
  return (
    <div>
      <Button>Default</Button>
      <PrimaryButton variant="danger">Delete</PrimaryButton>
      <PrimaryButton disabled>Disabled</PrimaryButton>
    </div>
  );
}
```

**Emotion (alternative):**

```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';

// CSS prop
const styles = css`
  background: #3498db;
  color: white;
  padding: 8px 16px;
`;

// Styled component
const Button = styled.button`
  background: ${props => props.primary ? '#3498db' : '#95a5a6'};
  color: white;
`;

function App() {
  return <Button primary css={styles}>Click</Button>;
}
```

**Dynamic styling:**

```jsx
const Card = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ $variant }) =>
    $variant === 'error' ? '#e74c3c' :
    $variant === 'success' ? '#2ecc71' :
    '#ddd'
  };
  padding: ${({ $size }) =>
    $size === 'large' ? '32px' :
    $size === 'small' ? '8px' :
    '16px'
  };
`;

// Usage
<Card $variant="error" $size="large">Error message</Card>
```

**Theming:**

```jsx
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    error: '#e74c3c',
    background: '#ffffff',
    text: '#333333'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '32px'
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif'
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyComponent />
    </ThemeProvider>
  );
}

// Access theme in styled components
const Text = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
`;
```

**CSS-in-JS vs other approaches:**

| Aspect | CSS-in-JS | CSS Modules | Tailwind | BEM |
|--------|-----------|-------------|----------|-----|
| Scoping | Runtime/compile-time | Build-time | Utility classes | Naming convention |
| Dynamic styles | Excellent | Limited | Limited | No |
| Runtime overhead | Yes (varies) | No | No | No |
| Bundle size | Larger | Smaller | Smaller (purged) | Smaller |
| Developer experience | Excellent | Good | Excellent | Good |
| SSR support | Good (with setup) | Excellent | Excellent | Excellent |

**Performance considerations:**

```jsx
// ❌ Creating new styles on every render
const Component = ({ color }) => {
  const StyledDiv = styled.div`
    color: ${color}; // Creates new component on every render!
  `;
  return <StyledDiv>Text</StyledDiv>;
};

// ✅ Stable styled component with dynamic props
const StyledDiv = styled.div`
  color: ${props => props.$color};
`;

const Component = ({ color }) => (
  <StyledDiv $color={color}>Text</StyledDiv>
);
```

**Vanilla Extract (zero-runtime CSS-in-JS):**

```typescript
// Button.css.ts
import { style } from '@vanilla-extract/css';

export const button = style({
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    opacity: 0.9
  }
});

// Button.tsx
import { button } from './Button.css';

export function Button({ children }) {
  return <button className={button}>{children}</button>;
}
```

**When to use CSS-in-JS:**

- Component libraries that need dynamic theming
- Applications with complex, state-dependent styling
- Teams that prefer colocating styles with components
- When you need runtime style generation

**When NOT to use CSS-in-JS:**

- Performance-critical applications (runtime overhead)
- Simple applications with mostly static styles
- When SSR performance is critical
- When you prefer static CSS extraction

Modern CSS-in-JS has evolved toward zero-runtime solutions like Vanilla Extract, Panda CSS, and compiled approaches (like Next.js CSS support) that extract styles at build time while keeping the developer experience of CSS-in-JS.
