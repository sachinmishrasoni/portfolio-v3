# Fix: `/admin` blank page on Vercel (firebase-admin `ERR_REQUIRE_ESM`)

> Quick fix: add the `overrides` block below to `pnpm-workspace.yaml`, run `pnpm install`, commit the lockfile, and redeploy without the build cache.

## Symptoms

- Works locally, but on Vercel `/admin` and `/admin/login` are blank or stuck on the loading screen. Pages that do not import `firebase-admin` (for example the home page) work fine.
- Browser console shows:

  ```
  Uncaught (in promise) Error: Minified React error #412
  ```

  React error #412 means **"Connection closed."** The server crashed while rendering and stopped streaming the page. The browser error is only a symptom, so look at the server error.
- Vercel Runtime Logs show:

  ```
  Error: Failed to load external module firebase-admin-.../auth:
  Error [ERR_REQUIRE_ESM]: require() of ES Module
  .../node_modules/jose/dist/webapi/index.js
  from .../node_modules/jwks-rsa/src/utils.js not supported.
  ```

- An `error.tsx` boundary does not help, because the connection closes before any error reaches the client.

## Root cause

`firebase-admin@14` depends on `jwks-rsa@4`. `jwks-rsa@4` loads `jose` with CommonJS `require()`, but `jose@6` is ESM-only. When the server loads `firebase-admin/auth`, the `require()` fails and the render crashes.

Raising the Node.js version on Vercel did **not** fix it for us (the project was already on Node 26). The reliable fix is to change the dependency.

## Fix

### 1. Pin `jwks-rsa` to the 3.x line

Create or edit `pnpm-workspace.yaml` in the project root:

```yaml
packages:
  - "."

overrides:
  jwks-rsa: ^3.2.0
```

`jwks-rsa@3` depends on `jose@4`, which supports CommonJS.

### 2. Remove any old override from `package.json`

With recent pnpm versions (we used `pnpm@12.16.1`), overrides in the `"pnpm"` block of `package.json` were **not applied**. Delete a block like this one so the two do not conflict:

```json
"pnpm": {
  "overrides": { "jose": "^4.15.9" }
}
```

Do not override `jose` alone. That forces `jose@4` under `jwks-rsa@4`, which was written for `jose@6`.

### 3. Reinstall and verify

```bash
pnpm install
pnpm why jwks-rsa
pnpm why jose
```

Expected result:

```
jwks-rsa@3.x.x   (for example 3.2.2)
jose@4.x.x       (for example 4.15.9)
```

If `jwks-rsa` still shows `4.x` or `jose` shows `6.x`, the override is not being applied. Check the file location and your pnpm version.

### 4. Test in production mode locally

```bash
pnpm build
pnpm start
```

Open `/admin/login` and confirm it loads.

### 5. Commit and deploy

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "override jwks-rsa to 3.x for firebase-admin 14"
git push
```

`pnpm-lock.yaml` must be in the commit, because Vercel installs from it. Then redeploy **without the build cache** (Vercel, then Deployments, then Redeploy, then untick "Use existing Build Cache").

## How to confirm the real error (debugging tip)

When the page is blank, the browser will not show the server error. Add a temporary route that imports `firebase-admin` inside a `try/catch` and prints the error:

```ts
// src/app/api/debug-admin/route.ts  (DELETE after debugging)
import { NextResponse } from "next/server";
import { connection } from "next/server";

export async function GET() {
    await connection();

    const env = {
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
        node: process.version,
    };

    try {
        const { adminAuth } = await import("@/lib/firebase-admin");
        await adminAuth.listUsers(1);
        return NextResponse.json({ ok: true, env });
    } catch (e) {
        const err = e as Error;
        return NextResponse.json(
            { ok: false, env, name: err.name, message: err.message },
            { status: 500 }
        );
    }
}
```

Open `/api/debug-admin` on the deployed site. `"ok": true` means `firebase-admin` loads correctly. **Delete this route afterwards**, since it reveals which env vars are set. It reports only true/false, never the values.

## Other issues we hit on the way

### `Date.now()` error while prerendering (Cache Components)

```
Error: Route "/admin": Next.js encountered the unstable value `Date.now()` while prerendering.
```

This happens with `cacheComponents: true`. Reading `cookies()` and verifying the session cookie must happen at request time:

- Call `await connection()` from `next/server` at the top of `requireAdmin()`.
- Wrap the auth check in a `<Suspense>` boundary. In the admin layout, move the check into an async child component and render it inside `<Suspense>`.

### Build error on `export const runtime` / `dynamic`

With Cache Components enabled, route segment config exports such as `runtime`, `dynamic` and `revalidate` fail the build. Remove them. Route handlers run on Node by default and render at request time.

### Other checks if the page is still blank

- All `FIREBASE_*` and `ADMIN_EMAIL` env vars are set for the **Production** environment in Vercel. Redeploy after adding them.
- `FIREBASE_PRIVATE_KEY` keeps its newlines. The code should convert literal `\n` with `.replace(/\\n/g, "\n")`.
- All `NEXT_PUBLIC_FIREBASE_*` vars exist. They are inlined at build time, so a redeploy is required after adding them.
- The Vercel domain is listed under Firebase Console, then Authentication, then Settings, then Authorized domains.
- Errors like `share-modal.js ... addEventListener` in the console usually come from a browser extension. Check in an incognito window.

## Security notes

- Layout checks are not a security boundary. Call `requireAdmin()` again inside every admin Server Action and API route.
- Logging out by clearing the cookie does not invalidate it. Consider calling `adminAuth.revokeRefreshTokens(uid)` on logout.

## When this override can be removed

This is a dependency incompatibility, not a bug in our code. When upgrading `firebase-admin`, remove the `overrides` entry, run `pnpm why jwks-rsa`, and test `/admin` on a preview deployment. If `jwks-rsa` resolves to a version that no longer fails on `require()`, the override is no longer needed.

## Environment where this occurred

- `firebase-admin` 14.5.0 (pulled in `jwks-rsa` 4.1.0 and `jose` 6.2.15)
- Next.js 16.4.3 with Cache Components, React 19.3.0
- pnpm 12.16.1
- Vercel runtime on Node 26.x