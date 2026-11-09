
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ============================================================
// STEP 1: DEFINE TYPES
// ============================================================

export type User = {
    id: string;
    name: string;
    email: string;
};

type ExampleState = {
    // -------------------- STATE --------------------

    count: number;
    name: string;
    isActive: boolean;
    users: User[];
    selectedUser: User | null;
    loading: boolean;

    // -------------------- ACTIONS --------------------

    increment: () => void;
    decrement: () => void;
    resetCount: () => void;

    setName: (name: string) => void;
    toggleActive: () => void;

    addUser: (user: User) => void;
    removeUser: (id: string) => void;
    selectUser: (id: string) => void;

    // -------------------- ASYNC ACTION --------------------

    fetchUsers: () => Promise<void>;

    // -------------------- RESET --------------------

    resetStore: () => void;
};

// ============================================================
// STEP 2: INITIAL STATE
// ============================================================

const initialState: Pick<
    ExampleState,
    | "count"
    | "name"
    | "isActive"
    | "users"
    | "selectedUser"
    | "loading"
> = {
    count: 0,
    name: "",
    isActive: false,
    users: [],
    selectedUser: null,
    loading: false,
};

// ============================================================
// STEP 3: STORE CREATOR
// ============================================================

const exampleStore = (
    set: (
        partial:
            | Partial<ExampleState>
            | ((state: ExampleState) => Partial<ExampleState>)
    ) => void,
    get: () => ExampleState
): ExampleState => ({
    ...initialState,

    // -------------------- COUNTER ACTIONS --------------------

    increment: () =>
        set((state) => ({
            count: state.count + 1,
        })),

    decrement: () =>
        set((state) => ({
            count: state.count - 1,
        })),

    resetCount: () =>
        set({ count: 0 }),

    // -------------------- NAME ACTION --------------------

    setName: (name) =>
        set({ name }),

    // -------------------- TOGGLE ACTION --------------------

    toggleActive: () =>
        set((state) => ({
            isActive: !state.isActive,
        })),

    // -------------------- USER ACTIONS --------------------

    addUser: (user) =>
        set((state) => ({
            users: [...state.users, user],
        })),

    removeUser: (id) =>
        set((state) => ({
            users: state.users.filter(
                (user) => user.id !== id
            ),

            selectedUser:
                state.selectedUser?.id === id
                    ? null
                    : state.selectedUser,
        })),

    selectUser: (id) => {
        const user = get().users.find(
            (user) => user.id === id
        );

        set({
            selectedUser: user ?? null,
        });
    },

    // -------------------- ASYNC ACTION --------------------

    fetchUsers: async () => {
        set({ loading: true });

        try {
            const response = await fetch("/api/users");

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const users: User[] = await response.json();

            set({ users });
        } catch (error) {
            console.error("Fetch users error:", error);
        } finally {
            set({ loading: false });
        }
    },

    // -------------------- RESET STORE --------------------

    resetStore: () =>
        set(initialState),
});

// ============================================================
// STEP 4: CREATE ZUSTAND STORE WITH PERSIST
// ============================================================

export const useExampleStore = create<ExampleState>()(
    persist(exampleStore, {
        name: "example-store",

        storage: createJSONStorage(() => localStorage),

        // Persist only selected properties
        partialize: (state) => ({
            count: state.count,
            name: state.name,
            isActive: state.isActive,
        }),
    })
);

// ============================================================
// STEP 5: EXAMPLE USAGE
// ============================================================

/*

// Import the store
import { useExampleStore } from "@/store";

// -------------------- INSIDE A CLIENT COMPONENT --------------------

// 1. Get state using selectors

const count = useExampleStore((state) => state.count);
const name = useExampleStore((state) => state.name);
const users = useExampleStore((state) => state.users);
const selectedUser = useExampleStore((state) => state.selectedUser);
const loading = useExampleStore((state) => state.loading);

// 2. Get actions

const increment = useExampleStore((state) => state.increment);
const decrement = useExampleStore((state) => state.decrement);
const setName = useExampleStore((state) => state.setName);
const toggleActive = useExampleStore((state) => state.toggleActive);

const addUser = useExampleStore((state) => state.addUser);
const removeUser = useExampleStore((state) => state.removeUser);
const selectUser = useExampleStore((state) => state.selectUser);

const fetchUsers = useExampleStore((state) => state.fetchUsers);
const resetStore = useExampleStore((state) => state.resetStore);

// 3. Use actions in JSX

<button onClick={increment}>Increment</button>

<button onClick={decrement}>Decrement</button>

<button onClick={() => setName("Sam")}>
  Set Name
</button>

<button onClick={toggleActive}>
  Toggle Active
</button>

<button
  onClick={() =>
    addUser({
      id: "1",
      name: "Sam",
      email: "sam@example.com",
    })
  }
>
  Add User
</button>

<button onClick={() => removeUser("1")}>
  Remove User
</button>

<button onClick={() => selectUser("1")}>
  Select User
</button>

<button onClick={fetchUsers} disabled={loading}>
  {loading ? "Loading..." : "Fetch Users"}
</button>

<button onClick={resetStore}>
  Reset Store
</button>

// 4. Access current state outside React components

const currentCount = useExampleStore.getState().count;

// 5. Call an action outside React components

useExampleStore.getState().increment();

// 6. Subscribe to store changes outside React components

const unsubscribe = useExampleStore.subscribe((state) => {
  console.log("Updated count:", state.count);
});

// Stop listening when no longer needed
unsubscribe();

*/
