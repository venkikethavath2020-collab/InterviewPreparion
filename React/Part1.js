//  What is React? 


// React is an open source javascript library 

// React is used for building user interface ( UI ) 

// React simplifies the creation of SPA by using reusable components 

 

//  Key features of React? 

// Virtual Dom: React utilizes a virtual representation of the DOM, allowing efficient updates by minimizing direct manipulation of the actual DOM, resulting in improved performance. 

// Component-Based Architecture: React structures user interface as modular, reusable components, promoting a more maintainable and scalable approach to builidng applications 
 
// Reusability & Composition: React enables the creation of reusable components that can be composed together, fostering a modular and efficient development process.

// Unidirectional Data Flow: React follows a one-way data flow, making it easier to understand and debug applications by ensuring that data changes propagate in a predictable manner. 

// JSX Syntax: React uses JSX, a syntax extension that allows developers to write HTML-like code within JavaScript, enhancing code readability and maintainability. 

// Strong Community & Ecosystem: React has a large and active community, providing a wealth of resources, libraries, and tools that support development and enhance functionality. 

// React hooks: React introduced hooks, which are functions that allow developers to use state and other React features in functional components, promoting cleaner and more concise code.

// React Native: React extends its capabilities to mobile app development through React Native, enabling developers to build cross-platform mobile applications using the same principles and components as React for the web. 

 

//  Advantages of React? 

// Performance: React's virtual DOM and efficient rendering techniques contribute to improved performance, especially in applications with frequent updates. 

// Reusability: React's component-based architecture promotes code reusability, allowing developers to create modular components that can be reused across different parts of an application or even in different projects. 

// Flexibility: React can be integrated with other libraries and frameworks, providing flexibility in choosing the right tools for specific project requirements. 

// Strong Community Support: React has a large and active community, offering extensive resources, libraries, and tools that facilitate development and problem-solving. 

// SEO-Friendly: React can be optimized for search engines, making it suitable for building web applications that require good SEO performance. 

// Cross-Platform Development: With React Native, developers can leverage their React skills to build mobile applications for both iOS and Android platforms, reducing development time and effort. 



// Disadvantages of React? 

// Learning Curve: React has a learning curve, especially for developers who are new to component-based architecture and JSX syntax. 

// Boilerplate Code: Setting up a React project may require additional configuration and boilerplate code, which can be overwhelming for beginners. 

// Rapidly Evolving Ecosystem: The React ecosystem is constantly evolving, which can lead to challenges in keeping up with the latest best practices and libraries. 

// Limited Built-in Functionality: React is primarily focused on the view layer, which means developers may need to rely on additional libraries for state management, routing, and other functionalities. 

// JSX Complexity: While JSX enhances code readability, it can also introduce complexity for developers who are not familiar with its syntax and concepts.



// What is DOM and what is the difference between HTML and DOM?
 
// DOM stands for Document Object Model represents the webpage as a tree like structure which allows javascript to manipulate the content style and structure of the webpage.

// HTML is a markup language that is used to create the structure and content of a webpage.


// What is virtual DOM in React? Difference between virtual DOM and real DOM?

// Virtual DOM is a lightweight copy of the real DOM that React uses to optimize updates and rendering.

// The main difference between virtual DOM and real DOM is that virtual DOM is faster and more efficient as it minimizes direct manipulation of the real DOM by batching updates and only applying necessary changes. 


// Reconciliation: React uses a process called reconciliation to compare the virtual DOM with the real DOM and determine the most efficient way to update the UI.


// What are components in React? Types of components?

// Components are the building blocks of a React application. They are reusable and encapsulated pieces of code that define how a part of the user interface should look and behave.

// Types of components in React:

// Functional Components: These are simple JavaScript functions that return JSX to define the UI. They can use hooks to manage state and lifecycle methods.

// Class Components: These are ES6 classes that extend the React.Component class. They have access to lifecycle methods and can manage state using this.state and this.setState().

// Higher-Order Components (HOCs): These are functions that take a component as an argument and return a new component with enhanced functionality.

// Pure Components: These are components that implement a shallow comparison of props and state to optimize rendering performance by preventing unnecessary updates.


// What is JSX?

// JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows developers to write HTML-like code within JavaScript.

// JSX makes it easier to create and visualize the structure of React components by combining markup and logic in a single file.

// JSX is transpiled into regular JavaScript using tools like Babel before being executed in the browser.


// what is the difference between Declarative and Imperative syntax?

// Declarative syntax focuses on describing what the UI should look like and how it should behave,
// while imperative syntax focuses on explicitly defining the steps to achieve a desired outcome.
// Declarative syntax is generally considered more readable and maintainable, as it abstracts away the low-level details of DOM manipulation and allows developers to focus on the desired outcome.

// Example of declarative syntax in React:

// const element = <h1>Hello, world!</h1>;

// Example of imperative syntax using vanilla JavaScript:

// const element = document.createElement('h1');
// element.textContent = 'Hello, world!';
// document.body.appendChild(element);



// How to create a React app?

// To create a React app, you can use the Create React App (CRA) tool, which sets up a new React project with a pre-configured build system and development environment.

// Steps to create a React app using CRA:

// 1. Install Node.js and npm (Node Package Manager) on your machine if you haven't already.

// 2. Open your terminal or command prompt.

// 3. Run the following command to create a new React app:

// npx create-react-app my-app

// Replace "my-app" with the desired name for your application.

// 4. Navigate to the newly created project directory:

// cd my-app

// 5. Start the development server by running:

// npm start

// This will launch the React app in your default web browser, and you can start building your application by modifying the files in the "src" folder.


// What are props in React?

// Props (short for properties) are a way to pass data from a parent component to a child component in React.

// Props are read-only and cannot be modified by the child component. They are used to customize the behavior and appearance of components.

// Props are passed to components as attributes in JSX, similar to HTML attributes.

// Example of using props:

// function Greeting(props) {
//   return <h1>Hello, {props.name}!</h1>;
// }

// <Greeting name="John" />

// 
function Greeting({name}) {
  return <h1>Hello, {name}!</h1>;
}

<Greeting name="John" />

// In this example, the "name" prop is passed to the Greeting component, which uses it to display a personalized greeting message.

 

// What is state in React?

// State is a built-in object in React that allows components to manage and track data that can change over time.

// State is mutable, meaning it can be updated using the setState() method in class components or the useState hook in functional components.

// State changes trigger re-rendering of the component, allowing the UI to reflect the updated data.

// Example of using state in a functional component:

// import React, { useState } from 'react';

// function Counter() {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <p>Count: {count}</p>
//       <button onClick={() => setCount(count + 1)}>Increment</button>
//     </div>
//   );
// }            
// In this example, the Counter component uses the useState hook to manage the "count" state, which is updated when the button is clicked.      
// What are lifecycle methods in React?

// Lifecycle methods are special methods in React class components that allow developers to hook into different stages of a component's lifecycle, such as mounting, updating, and unmounting.

// Common lifecycle methods include:

// componentDidMount(): Called after the component is mounted to the DOM. It is often used for initializing data or making API calls.

// componentDidUpdate(prevProps, prevState): Called after the component is updated. It can be used to perform actions based on changes in props or state.

// componentWillUnmount(): Called just before the component is unmounted and destroyed. It is used for cleanup tasks, such as removing event listeners or canceling network requests.

// Note: With the introduction of React hooks, functional components can now use the useEffect hook to achieve similar functionality as lifecycle methods in class components.

// What are hooks in React?

// Hooks are functions that allow developers to use state and other React features in functional components.

// Commonly used hooks include:

// useState: Allows functional components to manage state.

// useEffect: Enables side effects, such as data fetching or subscriptions, in functional components.

// useContext: Provides a way to access context values in functional components.

// useRef: Creates a mutable reference that persists across renders.

// Hooks promote cleaner and more concise code by allowing developers to use state and lifecycle features without the need for class components.

// What is the difference between state and props in React?

// State is a mutable object that represents data that can change over time within a component, while props are read-only attributes passed from a parent component to a child component.

// State is managed within the component itself, whereas props are passed down from parent components.

// State changes trigger re-rendering of the component, while props changes are controlled by the parent component.

// In summary, state is used for managing internal data, while props are used for passing data between components.

 

// What is Redux?

// Redux is a predictable state management library for JavaScript applications, commonly used with React.

// Redux provides a centralized store to manage the application state, allowing components to access and update the state in a consistent manner.

// Redux follows a unidirectional data flow, where actions are dispatched to modify the state, and components subscribe to state changes to update the UI accordingly.

// Key concepts in Redux include actions, reducers, and the store.

// Actions are plain JavaScript objects that describe a change in the state.

// Reducers are pure functions that take the current state and an action as arguments and return a new state based on the action type.

// The store is an object that holds the application state and provides methods to dispatch actions and subscribe to state changes.

 

// What is the purpose of keys in React?

// Keys are unique identifiers used in React to help identify which items in a list have changed, been added, or removed. 
// Keys should be assigned to elements in a list to provide a stable identity for each element, which helps React optimize rendering and improve performance.        

// Example of using keys in a list:

// const items = ['Apple', 'Banana', 'Cherry'];

// const itemList = items.map((item, index) => (
//   <li key={index}>{item}</li>
// ));  

// In this example, the index of each item in the array is used as the key for each list item.  



// What is the difference between controlled and uncontrolled components in React?

// Controlled components are form elements whose values are controlled by React state, while uncontrolled components manage their own state internally using the DOM.

// In controlled components, the value of the input is set by the state, and any changes to the input are handled through event handlers that update the state.

// In uncontrolled components, the value of the input is accessed directly from the DOM using refs, and React does not manage the input's state.

// Controlled components provide better control over form data and validation, while uncontrolled components can be simpler to implement for basic use cases.

// Example of a controlled component:

// function ControlledInput() {
//   const [value, setValue] = useState('');

//   return (
//     <input
//       type="text"
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//     />
//   );
// }

// Example of an uncontrolled component:

// function UncontrolledInput() {
//   const inputRef = useRef(null);

//   const handleSubmit = () => {
//     alert(inputRef.current.value);
//   };

//   return (
//     <div>
//       <input type="text" ref={inputRef} />
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// }
 

// What is context in React?

// Context is a way to share data between components without having to pass props down through every level of the component tree.

// Context allows you to create a global state that can be accessed by any component within the context provider.

// Context is created using the React.createContext() method, which returns a context object with a Provider and Consumer component.

// The Provider component is used to wrap the components that need access to the context, while the Consumer component is used to access the context value within those components.

// Example of using context:

// const ThemeContext = React.createContext('light');

// function App() {
//   return (
//     <ThemeContext.Provider value="dark">
//       <Toolbar />
//     </ThemeContext.Provider>
//   );
// }

// function Toolbar() {
//   return (
//     <div>
//       <ThemedButton />
//     </div>
//   );
// }

// function ThemedButton() {
//   return (
//     <ThemeContext.Consumer>
//       {(theme) => <button className={theme}>Themed Button</button>}
//     </ThemeContext.Consumer>
//   );
// }    
// In this example, the ThemeContext is created with a default value of "light". The App component provides a value of "dark" to the context, which is then accessed by the ThemedButton component using the Consumer component.



// What is the purpose of React Router?

// React Router is a library used for handling routing in React applications. It allows developers to create single-page applications (SPAs) with multiple views and navigation without the need for full page reloads.

// React Router provides a way to define routes and map them to specific components, enabling users to navigate between different views based on the URL.

// Key features of React Router include:

// Declarative Routing: Routes are defined using JSX, making it easy to understand and manage the application's navigation structure.

// Dynamic Routing: React Router supports dynamic routing, allowing routes to be created based on data or user interactions.

// Nested Routes: React Router allows for nested routes, enabling complex navigation structures within an application.

// Route Parameters: React Router supports route parameters, allowing developers to capture dynamic values from the URL and pass them to components.

// Example of using React Router:

// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// function App() {
//   return (
//     <Router>
//       <Switch>
//         <Route path="/" exact component={Home} />
//         <Route path="/about" component={About} />
//         <Route path="/contact" component={Contact} />
//       </Switch>
//     </Router>
//   );
// }

// In this example, the App component uses React Router to define three routes: "/", "/about", and "/contact", each mapped to a specific component. The Switch component ensures that only one route is rendered at a time based on the current URL.    


// What is the purpose of the useEffect hook in React?
// The useEffect hook in React is used to perform side effects in functional components. Side effects can include tasks such as data fetching, subscriptions, or manually manipulating the DOM.

// The useEffect hook takes two arguments: a function that contains the side effect logic and an optional dependency array that specifies when the effect should be re-run.

// The effect function is executed after the component has rendered, and it can return a cleanup function to clean up any resources when the component unmounts or before the effect is re-run.

// Example of using the useEffect hook:

// import React, { useState, useEffect } from 'react';

// function DataFetcher() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetch('https://api.example.com/data')
//       .then((response) => response.json())
//       .then((data) => setData(data));

//     return () => {
//       // Cleanup logic (if needed)
//     };
//   }, []); // Empty dependency array means this effect runs only once on mount

//   return (
//     <ul>
//       {data.map((item) => (
//         <li key={item.id}>{item.name}</li>
//       ))}
//     </ul>
//   );
// }

// In this example, the DataFetcher component uses the useEffect hook to fetch data from an API when the component mounts. The fetched data is then stored in the component's state and rendered as a list. The empty dependency array ensures that the effect runs only once when the component is first rendered.
 
// why useeffect placed top -level in React component?

// The useEffect hook is placed at the top-level of a React component to ensure that it is called in the same order on every render. This is important because React relies on the order of hooks to manage their state and lifecycle correctly.

// Placing useEffect (and other hooks) at the top-level prevents conditional or nested calls, which could lead to inconsistent behavior and bugs. If hooks were called conditionally, React would not be able to track their state properly, resulting in errors or unexpected behavior.

// By following the rule of placing hooks at the top-level, developers can ensure that their components behave predictably and maintain the integrity of the component's state and side effects.

// How to handle events in React?

// In React, events are handled using event handlers, which are functions that are called when a specific event occurs, such as a click or a form submission.

// Event handlers are defined as methods within a component and are passed to JSX elements as props using camelCase syntax (e.g., onClick, onSubmit).

// Example of handling a click event in a React component:

// function ClickCounter() {
//   const [count, setCount] = useState(0);

//   const handleClick = () => {
//     setCount(count + 1);
//   };

//   return (
//     <div>
//       <p>Count: {count}</p>
//       <button onClick={handleClick}>Increment</button>
//     </div>
//   );
// }

// In this example, the ClickCounter component defines a handleClick function that increments the count state when the button is clicked. The onClick prop is used to attach the event handler to the button element.

// It's important to note that in React, event handlers receive a synthetic event object as an argument, which is a cross-browser wrapper around the native event. This synthetic event has the same interface as the native event but provides additional features and optimizations.  


// How to optimize performance in a React application?

// There are several techniques to optimize performance in a React application, including:

// 1. Using React.memo: This higher-order component can be used to memoize functional components, preventing unnecessary re-renders when props have not changed.

// 2. Implementing shouldComponentUpdate: In class components, this lifecycle method can be overridden to control when a component should re-render based on changes in props or state.

// 3. Code Splitting: Using dynamic imports and React.lazy to load components only when they are needed, reducing the initial bundle size and improving load times.

// 4. Avoiding Inline Functions: Defining event handlers and functions outside of the render method to prevent unnecessary re-creation of functions on each render.

// 5. Using useCallback and useMemo Hooks: These hooks can be used to memoize functions and values, respectively, preventing unnecessary recalculations and re-renders.

// 6. Optimizing List Rendering: Using keys effectively and implementing virtualization techniques (e.g., react-window or react-virtualized) for rendering large lists.

// 7. Profiling and Analyzing Performance: Using React's built-in Profiler and browser developer tools to identify performance bottlenecks and optimize accordingly.

// 8. Minimizing State Updates: Reducing the frequency and scope of state updates to avoid unnecessary re-renders of components.

// 9. Leveraging Pure Components: Using React.PureComponent or implementing shouldComponentUpdate to optimize class components by performing shallow comparisons of props and state.

// 10. Avoiding Excessive Context Usage: Limiting the use of React Context for global state management, as it can lead to unnecessary re-renders of consuming components.
