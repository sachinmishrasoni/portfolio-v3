# Zustand State Management – Complete Guide

A practical guide to managing client-side state in React and Next.js applications using **Zustand** and TypeScript.

This documentation covers:

- Zustand fundamentals
- Store architecture and folder structure
- Single-file store implementation
- Multiple-file store implementation
- Synchronous and asynchronous actions
- Store composition (Slices Pattern)
- Persist middleware
- DevTools middleware
- Using stores inside React components
- Best practices and common mistakes

---

# 1. What is Zustand?

Zustand is a small, fast, and flexible state management library for React applications.

It helps us manage shared application state without the complexity of Redux.

For example, we can use Zustand to manage:

- User information
- Authentication UI state
- Sidebar and modal visibility
- Dashboard filters
- Selected items
- Theme preferences
- Shopping cart state
- Temporary form or wizard state

### Why Zustand?

| Feature | Description |
|---|---|
| Lightweight | Minimal setup and boilerplate |
| Simple API | Uses `create()` to create stores |
| TypeScript | Supports strongly typed stores |
| Async actions | Supports async/await directly |
| Middleware | Supports persist, devtools, immer, etc. |
| No Provider required | Standard Zustand stores can be used directly |
| Selectors | Subscribe to specific state values |

## 1.1 Zustand vs Redux Toolkit

| Feature | Zustand | Redux Toolkit |
|---|---|---|
| Store setup | Simple | More structured |
| Boilerplate | Minimal | Moderate |
| Async operations | Async functions inside actions | createAsyncThunk or RTK Query |
| Middleware | Optional | Integrated middleware support |
| Provider | Not required for standard stores | Required |
| Slices | Can be composed manually | createSlice |
| Best suited for | Lightweight shared state | Structured, larger Redux applications |

**Important:** Zustand does not have a built-in `createAsyncThunk()` equivalent. We can write asynchronous functions directly inside Zustand actions.

---

# 2. Installation

Install Zustand using pnpm:

```bash
pnpm add zustand
```

Optional middleware is included in Zustand itself. You do not need to install separate packages for `persist` or `devtools`.

---

# 3. Understanding the Zustand Store

A Zustand store generally contains three things:

1. **State:** Data stored in the application.
2. **Actions:** Functions that update the state.
3. **Selectors:** Functions or component subscriptions that read specific state values.

Example:

```ts
import { create } from "zustand";

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,

  increment: () =>
    set((state) => ({
      count: state.count + 1,
    })),

  decrement: () =>
    set((state) => ({
      count: state.count - 1,
    })),
}));
```

Usage:

```tsx
"use client";

import { useCounterStore } from "@/store/counter.store";

export default function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <div>
      <h2>Count: {count}</h2>

      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```

---

# 4. Recommended Store Folder Structure

There are multiple ways to organize Zustand stores.

The right choice depends on the size and complexity of the application.

## Approach 1: Simple Multiple-File Structure

This is suitable when a store has a manageable number of synchronous and asynchronous actions.

```text
src/
└── store/
    └── user/
        ├── user.store.ts
        ├── user.types.ts
        ├── user.initial-state.ts
        └── user.actions.ts
```

### Responsibility of each file

| File | Responsibility |
|---|---|
| `user.types.ts` | Store, state, action and data types |
| `user.initial-state.ts` | Default state values |
| `user.actions.ts` | Synchronous and asynchronous actions |
| `user.store.ts` | Creates and exports the Zustand store |

### 4.1 user.types.ts

Define all interfaces and types related to the user store.

```ts
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type UserState = {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
};

export type UserActions = {
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (id: number) => void;
  selectUser: (user: User | null) => void;
  resetUsers: () => void;

  fetchUsers: () => Promise<void>;
};

export type UserStore = UserState & UserActions;
```

### 4.2 user.initial-state.ts

Keep the default values in one place.

```ts
import type { UserState } from "./user.types";

export const initialUserState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};
```

### 4.3 user.actions.ts

All actions are defined here.

This file contains both synchronous and asynchronous actions.

```ts
import type { StateCreator } from "zustand";
import type { User, UserStore } from "./user.types";
import { initialUserState } from "./user.initial-state";

type Set = Parameters<StateCreator<UserStore>>[0];
type Get = Parameters<StateCreator<UserStore>>[1];

// Synchronous Actions
export const createUserActions = (set: Set, get: Get) => ({
  setUsers: (users: User[]) => {
    set({ users });
  },

  addUser: (user: User) => {
    set((state) => ({
      users: [...state.users, user],
    }));
  },

  removeUser: (id: number) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
  },

  selectUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  resetUsers: () => {
    set({
      ...initialUserState,
    });
  },
});

// Asynchronous Action
export const createUserAsyncActions = (set: Set, get: Get) => ({
  fetchUsers: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users: User[] = await response.json();

      set({
        users,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  },
});
```

**Note:** `get` gives access to the current store state. It is useful when an action needs to read existing values before updating them. The example above does not need it, but it is available for more complex actions.

### 4.4 user.store.ts

This file combines the initial state and actions and creates the store.

```ts
import { create } from "zustand";

import type { UserStore } from "./user.types";
import { initialUserState } from "./user.initial-state";
import {
  createUserActions,
  createUserAsyncActions,
} from "./user.actions";

export const useUserStore = create<UserStore>()((set, get) => ({
  ...initialUserState,

  ...createUserActions(set, get),
  ...createUserAsyncActions(set, get),
}));
```

### How the files connect

```text
user.types.ts
     |
     v
user.initial-state.ts
     |
     v
user.actions.ts
     |
     v
user.store.ts
     |
     v
React Components
```

The store file is the entry point. Components import the store rather than importing individual action files.

---

# 5. Approach 2: Scalable Multiple-File Structure

When your application grows and the store contains many actions, it is better to separate synchronous and asynchronous actions.

Recommended structure:

```text
src/
└── store/
    └── user/
        ├── user.store.ts
        ├── user.types.ts
        ├── user.initial-state.ts
        │
        └── actions/
            ├── user.actions.ts
            └── user.async-actions.ts
```

### Responsibility of each file

| File | Responsibility |
|---|---|
| `user.types.ts` | All store-related TypeScript types |
| `user.initial-state.ts` | Initial state |
| `actions/user.actions.ts` | Synchronous actions |
| `actions/user.async-actions.ts` | API calls and asynchronous operations |
| `user.store.ts` | Combines all state and actions |

This approach follows the **separation of concerns** principle.

## 5.1 user.types.ts

```ts
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type UserState = {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
};

export type UserActions = {
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: number, data: Partial<User>) => void;
  removeUser: (id: number) => void;
  selectUser: (user: User | null) => void;
  resetUsers: () => void;
  fetchUsers: () => Promise<void>;
};

export type UserStore = UserState & UserActions;
```

## 5.2 user.initial-state.ts

```ts
import type { UserState } from "./user.types";

export const initialUserState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};
```

## 5.3 actions/user.actions.ts

This file contains only synchronous state updates.

```ts
import type { StateCreator } from "zustand";
import type { User, UserStore } from "../user.types";
import { initialUserState } from "../user.initial-state";

type UserActionsSlice = Pick<
  UserStore,
  | "setUsers"
  | "addUser"
  | "updateUser"
  | "removeUser"
  | "selectUser"
  | "resetUsers"
>;

export const createUserActions: StateCreator<
  UserStore,
  [],
  [],
  UserActionsSlice
> = (set) => ({
  setUsers: (users: User[]) => {
    set({ users });
  },

  addUser: (user: User) => {
    set((state) => ({
      users: [...state.users, user],
    }));
  },

  updateUser: (id: number, data: Partial<User>) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...data } : user
      ),
    }));
  },

  removeUser: (id: number) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      selectedUser:
        state.selectedUser?.id === id ? null : state.selectedUser,
    }));
  },

  selectUser: (user: User | null) => {
    set({ selectedUser: user });
  },

  resetUsers: () => {
    set({
      ...initialUserState,
    });
  },
});
```

## 5.4 actions/user.async-actions.ts

This file contains asynchronous actions, such as API requests.

```ts
import type { StateCreator } from "zustand";
import type { User, UserStore } from "../user.types";

type UserAsyncActionsSlice = Pick<UserStore, "fetchUsers">;

export const createUserAsyncActions: StateCreator<
  UserStore,
  [],
  [],
  UserAsyncActionsSlice
> = (set) => ({
  fetchUsers: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const users: User[] = await response.json();

      set({
        users,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
    }
  },
});
```

## 5.5 user.store.ts

This is where all the slices are combined.

```ts
import { create } from "zustand";

import type { UserStore } from "./user.types";
import { initialUserState } from "./user.initial-state";

import { createUserActions } from "./actions/user.actions";
import { createUserAsyncActions } from "./actions/user.async-actions";

export const useUserStore = create<UserStore>()((...args) => ({
  ...initialUserState,

  ...createUserActions(...args),
  ...createUserAsyncActions(...args),
}));
```

### Understanding Store Composition

The above pattern is commonly called the **Slices Pattern** or store composition.

Instead of writing every action inside one large store file, we divide the store into smaller logical pieces.

```text
                 user.store.ts
                       |
          +------------+------------+
          |            |            |
          v            v            v
     Initial State  Sync Actions  Async Actions
          |            |            |
          +------------+------------+
                       |
                       v
                  User Store
                       |
                       v
                React Components
```

**Important:** Each slice should contribute unique keys to the store. Avoid defining the same action in multiple slices because later object spreads can overwrite earlier properties.

---

# 6. Using the Zustand Store in React Components

Once the store is created, import it wherever you need it.

Example: `UserList.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user/user.store";

export default function UserList() {
  const users = useUserStore((state) => state.users);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);

  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const removeUser = useUserStore((state) => state.removeUser);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>User List</h2>

      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>

          <button onClick={() => removeUser(user.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Important: Use Selectors

Prefer:

```ts
const users = useUserStore((state) => state.users);
```

Instead of:

```ts
const store = useUserStore();
```

Selecting only the values you need helps avoid unnecessary component re-renders when unrelated state changes.

If you need multiple values together, you can use `useShallow`:

```tsx
import { useShallow } from "zustand/react/shallow";

const { users, isLoading, fetchUsers } = useUserStore(
  useShallow((state) => ({
    users: state.users,
    isLoading: state.isLoading,
    fetchUsers: state.fetchUsers,
  }))
);
```

---

# 7. Zustand Middleware

Middleware adds additional functionality to Zustand stores.

Common middleware:

| Middleware | Purpose |
|---|---|
| `persist` | Saves selected state to storage |
| `devtools` | Integrates with Redux DevTools |
| `immer` | Makes nested immutable updates easier |
| `subscribeWithSelector` | Subscribe to specific state changes |
| `combine` | Combines state and actions |

## 7.1 Persist Middleware

Persist middleware stores selected state in browser storage.

For example, if the user refreshes the page, the stored preferences can remain available.

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ThemeStore = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",

      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
```

### Available storage options

| Storage | Description |
|---|---|
| `localStorage` | Persists data across browser sessions |
| `sessionStorage` | Persists data for the current browser tab session |
| Custom storage | Allows a custom storage implementation |

**Important:** Do not persist sensitive information such as passwords, private tokens, or session credentials in localStorage.

In Next.js, remember that localStorage is only available in the browser. Persisted stores may need hydration handling to avoid displaying incorrect initial UI.

## 7.2 DevTools Middleware

DevTools helps debug state changes.

Install nothing extra; Zustand includes the middleware.

```ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type CounterStore = {
  count: number;
  increment: () => void;
};

export const useCounterStore = create<CounterStore>()(
  devtools(
    (set) => ({
      count: 0,

      increment: () =>
        set(
          (state) => ({
            count: state.count + 1,
          }),
          undefined,
          "counter/increment"
        ),
    }),
    {
      name: "Counter Store",
    }
  )
);
```

You can inspect actions and state changes using the Redux DevTools browser extension.

## 7.3 Combining Persist and DevTools

You can combine multiple middleware:

```ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type CounterStore = {
  count: number;
  increment: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterStore>()(
  devtools(
    persist(
      (set) => ({
        count: 0,

        increment: () =>
          set((state) => ({
            count: state.count + 1,
          })),

        reset: () => set({ count: 0 }),
      }),
      {
        name: "counter-storage",
        partialize: (state) => ({
          count: state.count,
        }),
      }
    ),
    {
      name: "Counter Store",
    }
  )
);
```

---

# 8. Synchronous vs Asynchronous Actions

Understanding the difference is important when designing a professional store.

## Synchronous Action

A synchronous action updates state immediately.

Example:

```ts
addUser: (user) => {
  set((state) => ({
    users: [...state.users, user],
  }));
},
```

Common use cases:

- Add an item
- Remove an item
- Update a selected value
- Open or close a modal
- Change filters
- Reset state

## Asynchronous Action

An asynchronous action performs an operation that takes time, such as an API request.

Example:

```ts
fetchUsers: async () => {
  set({ isLoading: true, error: null });

  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();

    set({
      users: data,
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : "Unknown error",
      isLoading: false,
    });
  }
},
```

### Does Zustand require thunk middleware?

No.

Unlike Redux Toolkit, Zustand allows asynchronous functions directly inside the store.

You can use `async/await` and call `set()` whenever you need to update the state.

---

# 9. Zustand vs TanStack Query

Both libraries manage state, but they solve different problems.

| Zustand | TanStack Query |
|---|---|
| Client-side state | Server state |
| Modal visibility | API data fetching |
| Sidebar state | API caching |
| Selected filters | Refetching |
| Temporary UI preferences | Mutation management |
| Multi-step UI state | Background synchronization |

### Recommended combination

For a modern Next.js application:

```text
Next.js Application
       |
       +--------------------------+
       |                          |
       v                          v
  Zustand Store              TanStack Query
       |                          |
       v                          v
   Client State               Server State
       |                          |
       v                          v
  UI Preferences             API Data
  Sidebar State              Fetch Requests
  Modal State                Create / Update / Delete
  Selected Items             Cache / Refetch
```

**Recommendation:** Do not store the same API response in both Zustand and TanStack Query unless there is a specific reason. Let TanStack Query own server data and use Zustand for client-side shared state.

---

# 10. Recommended Project-Level Folder Structure

For a larger application, organize stores by feature or domain.

```text
src/
└── store/
    │
    ├── admin/
    │   ├── dashboard/
    │   │   ├── dashboard.store.ts
    │   │   ├── dashboard.types.ts
    │   │   ├── dashboard.initial-state.ts
    │   │   └── actions/
    │   │       ├── dashboard.actions.ts
    │   │       └── dashboard.async-actions.ts
    │   │
    │   └── user/
    │       ├── user.store.ts
    │       ├── user.types.ts
    │       ├── user.initial-state.ts
    │       └── actions/
    │           ├── user.actions.ts
    │           └── user.async-actions.ts
    │
    ├── portfolio/
    │   ├── portfolio.store.ts
    │   ├── portfolio.types.ts
    │   ├── portfolio.initial-state.ts
    │   └── actions/
    │       ├── portfolio.actions.ts
    │       └── portfolio.async-actions.ts
    │
    ├── theme/
    │   ├── theme.store.ts
    │   └── theme.types.ts
    │
    └── index.ts
```

### Store index.ts

You can create a central export file:

```ts
export { useUserStore } from "./admin/user/user.store";
export { useDashboardStore } from "./admin/dashboard/dashboard.store";
export { usePortfolioStore } from "./portfolio/portfolio.store";
export { useThemeStore } from "./theme/theme.store";
```

Then import stores like this:

```ts
import { useUserStore, useThemeStore } from "@/store";
```

**Important:** This file is only a barrel export. It does not register stores or create a global Zustand Provider. Each store is created independently using `create()`.

---

# 11. Single File vs Multiple Files

There are three practical options:

| Structure | Best for | Recommendation |
|---|---|---|
| One file | Small store with a few actions | Simple projects |
| Four files | Medium store with manageable actions | Good starting point |
| Separate sync/async actions | Large store with many actions | Recommended for scalable applications |

### Option A: One file

```text
user/
└── user.store.ts
```

Everything is inside one file: types, initial state, actions, and store creation.

Use it when the store is very small.

### Option B: Four files

```text
user/
├── user.store.ts
├── user.types.ts
├── user.initial-state.ts
└── user.actions.ts
```

Use it when you want separation without too many files.

### Option C: Separate synchronous and asynchronous actions

```text
user/
├── user.store.ts
├── user.types.ts
├── user.initial-state.ts
└── actions/
    ├── user.actions.ts
    └── user.async-actions.ts
```

Use it when the store has many actions, API operations, and more complex state management.

**My recommendation:** Choose Option C for a growing application. It keeps the main store clean and makes it easier to maintain, test, and extend individual actions.

---

# 12. Best Practices

Follow these practices when creating Zustand stores.

1. **Keep stores feature-based:** Create separate stores for different domains, such as users, dashboard, theme, and portfolio.
2. **Separate types:** Keep TypeScript interfaces and types in a dedicated file.
3. **Separate initial state:** Avoid repeating default values in multiple places.
4. **Separate complex actions:** Move asynchronous operations into dedicated action files when the store grows.
5. **Use selectors:** Subscribe only to the state values your component needs.
6. **Avoid unnecessary stores:** Do not create a separate store for every small component.
7. **Use middleware carefully:** Add persistence and DevTools only when needed.
8. **Avoid duplicate server state:** Use TanStack Query for API data when appropriate.
9. **Keep actions focused:** Each action should have one clear responsibility.
10. **Avoid storing sensitive information:** Browser storage is not a secure place for credentials.
11. **Handle errors:** Always consider loading, success, and error states for asynchronous operations.
12. **Avoid huge store files:** Split actions into logical slices when maintenance becomes difficult.

---

# 13. Important Notes for Next.js

Zustand works with Next.js App Router, but there are a few important considerations.

### 13.1 Use Client Components

When using a Zustand hook inside a component, mark that component as a client component:

```tsx
"use client";

import { useUserStore } from "@/store/user/user.store";
```

### 13.2 Do Not Access Browser APIs During Server Rendering

Avoid accessing `window`, `document`, or `localStorage` directly at module initialization.

Use browser APIs inside client-side effects or appropriate browser-only storage configurations.

### 13.3 Avoid Shared Mutable Stores Across Server Requests

For a typical browser-only store, a module-level `create()` store is common.

However, do not use a shared module-level store to hold request-specific user data during server rendering. In server-rendered applications, request-specific state should be created per request or passed through an appropriate provider/context pattern.

### 13.4 Authentication

Do not use Zustand as the security boundary for authentication.

The backend must verify authentication and authorization independently. Zustand can hold UI information about the current user, but it must not be trusted to protect private routes or APIs.

---

# 14. Final Recommendation

For a professional Next.js project, I recommend the following architecture:

```text
src/
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── providers/
├── services/
├── store/
│   ├── admin/
│   │   ├── user/
│   │   │   ├── user.store.ts
│   │   │   ├── user.types.ts
│   │   │   ├── user.initial-state.ts
│   │   │   └── actions/
│   │   │       ├── user.actions.ts
│   │   │       └── user.async-actions.ts
│   │   │
│   │   └── dashboard/
│   │       ├── dashboard.store.ts
│   │       ├── dashboard.types.ts
│   │       ├── dashboard.initial-state.ts
│   │       └── actions/
│   │           ├── dashboard.actions.ts
│   │           └── dashboard.async-actions.ts
│   │
│   ├── portfolio/
│   ├── theme/
│   └── index.ts
│
└── styles/
```

### Which library should handle what?

| Requirement | Recommended tool |
|---|---|
| Global client-side state | Zustand |
| API fetching and caching | TanStack Query |
| Form state | React Hook Form |
| Form validation | Zod |
| Authentication | Firebase Auth / server-side session |
| Database | Firebase / other backend |
| Notifications | Sonner |

**Final takeaway:**

Zustand is responsible for managing shared client-side state. Use separate stores for different features, separate state and types from actions, and split synchronous and asynchronous actions when the codebase grows.

You do not need to register every store in a central provider. Create each store independently and optionally export them through a central `index.ts` file.