React Native provides a set of built-in components that map directly to native platform UI elements. These core components form the building blocks of every React Native application.

The fundamental components include:

- **View**: The most basic container component, equivalent to a `div` in web development. It supports flexbox layout, styling, and accessibility. Views are used to structure your UI hierarchy.
- **Text**: Used for displaying text. It supports nesting, styling, and touch handling. Unlike web, all text must be wrapped in `Text` components.
- **Image**: Displays images from local resources, network URLs, or base64 data. Supports `resizeMode` options like `cover`, `contain`, and `stretch`.
- **TextInput**: A controlled input component for text entry. Supports various keyboard types, auto-correction, placeholder text, and secure entry for passwords.
- **ScrollView**: A generic scrolling container that renders all its children at once. Best for small content sets where you need horizontal or vertical scrolling.
- **FlatList**: A performant list component for large datasets. Uses virtualization to render only visible items, making it memory-efficient for long lists.
- **SectionList**: Similar to FlatList but with section headers, ideal for grouped data like contacts organized alphabetically.
- **TouchableOpacity** and **Pressable**: Wrappable components that give feedback when pressed. `Pressable` is the newer, more flexible alternative.
- **ActivityIndicator**: A loading spinner indicating background activity.
- **Modal**: Presents content on top of the current view.
- **StatusBar**: Controls the app status bar appearance.
- **Switch**: A toggle control for boolean values.

Each component maps to a native UI element—`View` becomes `UIView` on iOS and `android.view.View` on Android—which ensures native performance and appearance. You compose these components using standard React patterns with JSX.
