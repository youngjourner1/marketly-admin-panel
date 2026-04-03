# Google OAuth Registration & Role Redirection Plan

Ensure users can sign up via Google OAuth, are automatically assigned the 'buyer' role, and are redirected to the correct dashboard.

## 1. UI Enhancements
- **`src/pages/Auth/Register.tsx`**:
    - Add "Continue with Google" button to the registration page.
    - Implement `handleGoogleLogin` using the `signInWithGoogle` method from `AuthContext`.
    - Update the `useEffect` redirection logic to be role-aware (Super Admin -> `/dashboard/super-admin`, Admin -> `/dashboard/admin`, Seller -> `/dashboard/seller`, Buyer -> `/dashboard/buyer`), matching the logic in `Login.tsx`.

## 2. Authentication Context (`src/context/AuthContext.tsx`)
- Ensure the `onAuthStateChanged` listener correctly handles the initial creation of user documents for Google sign-ups.
- Maintain the default 'buyer' role if no custom claim is present.
- Use `getIdTokenResult(true)` to force a token refresh and pick up new custom claims.

## 3. Backend Logic (`functions/index.js`)
- Verify that `onUserCreated` trigger is correctly setting the `role: 'buyer'` custom claim and Firestore document for all registration methods (Email/Password & Google OAuth).
- *Existing logic is already correct, but I will ensure it's robust.*

## 4. Verification
- Verify that clicking "Continue with Google" on either Login or Register page correctly onboards a new user as a 'buyer'.
- Verify that existing users (Sellers/Admins) logging in with Google are redirected to their correct dashboards.
