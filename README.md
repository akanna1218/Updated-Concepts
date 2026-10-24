# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Daybook React Practice

A small task manager for practicing React. Tasks can be added, edited, completed, deleted, searched, and filtered. Data is held in component state, so it resets on refresh.

## Run it

```sh
npm install
npm run dev
```

## Practice ideas

- Try `useDeferredValue` for the task search when the list gets larger.
- Use `useTransition` to mark a filter or tab update as non-urgent.
- Refactor the task form to use a React form Action with `useActionState` and `useFormStatus`.
- Add persistence, then explore optimistic updates with `useOptimistic`.

The CRUD flow currently uses `useState` and regular form submission so the state updates are easy to follow before experimenting.
