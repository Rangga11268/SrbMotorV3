# GOOGLE OAUTH 2.0 SETUP GUIDE - SRB MOTORS

**Purpose**: Enable users to login/register using Google Account  
**Integration**: Laravel Socialite + Google API  
**Implementation Phase**: Phase 2 (parallel with core redesign)  
**Status**: Complete Configuration Guide

---

## 📋 OVERVIEW

After implementation, users can:

1. Click "Lanjutkan dengan Google" button
2. Redirected to Google login
3. Approve app permissions
4. Auto-created user account (if new)
5. Auto-logged in (if returning)
6. Display name, email, profile photo from Google

---

## 🔑 STEP 1: Google Cloud Console Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **NEW PROJECT**
3. Enter:
    - **Project name**: `SRB Motors`
    - **Organization**: (leave blank if personal)
    - Click **CREATE**
4. Wait ~1 minute for project creation

### 1.2 Enable Google+ API

1. In left sidebar, go to **APIs & Services** → **Library**
2. Search for **Google+ API**
3. Click on it → Click **ENABLE**
4. Wait for confirmation

### 1.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted to create OAuth consent screen first:
    - Click **CONFIGURE CONSENT SCREEN**
    - Select **External** user type
    - Click **CREATE**
    - Fill form:
        - **App name**: `SRB Motors`
        - **User support email**: your-email@...
        - **Developer contact info**: your-email@...
        - Click **SAVE AND CONTINUE**
    - Skip scopes & test users (optional)
    - Click **BACK TO CREDENTIALS**

4. Now create OAuth credentials:
    - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
    - Select **Web application**
    - Enter Name: `SRB Motors Web`

### 1.4 Configure Authorized URIs

**This is CRITICAL - must match your application URLs exactly**

#### Authorized JavaScript Origins

Add these (depending on environment):

```
Development:
  http://localhost:8000
  http://localhost:3000
  http://127.0.0.1:8000

Staging:
  https://staging.srbmotor.com

Production:
  https://www.srbmotor.com
  https://srbmotor.com
```

#### Authorized Redirect URIs

Add corresponding OAuth callback URLs:

```
Development:
  http://localhost:8000/auth/google/callback
  http://localhost:3000/auth/google/callback
  http://127.0.0.1:8000/auth/google/callback

Staging:
  https://staging.srbmotor.com/auth/google/callback

Production:
  https://www.srbmotor.com/auth/google/callback
  https://srbmotor.com/auth/google/callback
```

5. Click **CREATE**
6. Download JSON file (save as `google-credentials.json`)
7. You'll see:
    - **Client ID**: `xxxxx.apps.googleusercontent.com`
    - **Client Secret**: `xxxxx` (keep secret!)

---

## 🔐 STEP 2: Laravel Configuration

### 2.1 Install Socialite

```bash
composer require laravel/socialite
```

### 2.2 Add Environment Variables

**File**: `.env`

```env
# Google OAuth
GOOGLE_CLIENT_ID=899043776775-jl61c2hmjn1a6q3l9v61dved0k6ic2u9.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YGOCSPX-6MW3CkBAlIiCGp55MIe9KtB8JXta
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

**Replace with your values from Step 1.4**

### 2.3 Register Socialite Provider

**File**: `config/app.php`

In `'providers'` array, add:

```php
'providers' => [
    // ... existing providers
    Laravel\Socialite\SocialiteServiceProvider::class,
],
```

---

## 🔌 STEP 3: Create Google Auth Controller

**File**: `app/Http/Controllers/GoogleAuthController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect user to Google OAuth endpoint
     */
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // Find existing user by email
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Existing user - just login
                Auth::login($user);
            } else {
                // New user - create account
                $newUser = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'profile_photo_path' => $googleUser->getAvatar(),
                    'password' => bcrypt(str_random(16)), // Random password
                    'email_verified_at' => now(), // Auto-verify Google accounts
                ]);

                Auth::login($newUser);
            }

            return redirect()->intended('/dashboard');

        } catch (\Exception $e) {
            return redirect('/login')
                ->with('error', 'Gagal login dengan Google. Silakan coba lagi.');
        }
    }

    /**
     * Logout user
     */
    public function logout()
    {
        Auth::logout();
        return redirect('/');
    }
}
```

---

## 🛣️ STEP 4: Add Routes

**File**: `routes/web.php`

```php
// Google OAuth routes
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])
    ->name('auth.google');

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('google.callback');
```

---

## 🎨 STEP 5: Add Login UI Button

**File**: Update `resources/js/Pages/Auth/Login.jsx`

After existing `<Button>` for email login, add:

```jsx
{
    /* Google Login Button */
}
<div className="mt-6">
    <div className="relative">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
                Atau lanjutkan dengan
            </span>
        </div>
    </div>

    <a
        href={route("auth.google")}
        className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
    >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
        Lanjutkan dengan Google
    </a>
</div>;
```

---

## 📱 STEP 6: Update User Model

**File**: `app/Models/User.php`

Add these columns to fillable array:

```php
protected $fillable = [
    'name',
    'email',
    'password',
    'google_id',           // ← Add this
    'profile_photo_path',  // ← Add this
    'email_verified_at',
];
```

---

## 🗄️ STEP 7: Create Migration

If these columns don't exist, create migration:

```bash
php artisan make:migration add_google_auth_to_users
```

**File**: `database/migrations/XXXX_add_google_auth_to_users.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique();
            $table->string('profile_photo_path')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'profile_photo_path']);
        });
    }
};
```

Run migration:

```bash
php artisan migrate
```

---

## 🧪 STEP 8: Test Locally

### 8.1 Start Development Server

```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite (if using)
npm run dev
```

### 8.2 Test Flow

1. Browse to `http://localhost:8000/login`
2. Click "Lanjutkan dengan Google" button
3. Redirected to Google login
4. Enter test Google account
5. Grant permissions
6. Should redirect back to `/dashboard`
7. Should see user data populated

### 8.3 If Error

Check these:

- [ ] Client ID/Secret correct in `.env`
- [ ] Redirect URI matches exactly (including protocol & port)
- [ ] JavaScript origins in Google Console include `http://localhost:8000`
- [ ] Database migration ran sucessfully
- [ ] Google+ API enabled in Google Cloud Console

---

## 🚀 STEP 9: Production Deployment

### 9.1 Update Google Console

1. In Google Cloud Console, update:
    - Authorized JavaScript Origins: add `https://www.srbmotor.com`
    - Authorized Redirect URIs: add `https://www.srbmotor.com/auth/google/callback`

### 9.2 Update .env on Server

```env
GOOGLE_REDIRECT_URI=https://www.srbmotor.com/auth/google/callback
```

### 9.3 Test on Staging

Before production, fully test on staging environment:

1. Test new user signup flow
2. Test returning user login
3. Test email verification
4. Test logout
5. Verify database entries

---

## 🔒 SECURITY CONSIDERATIONS

### State Token Verification

Socialite automatically handles CSRF state token. No additional work needed.

### Token Storage

- Google tokens NOT stored in database (stateless)
- Session cookie used for authentication
- If needing refresh token for API access, modify code to store:

```php
// Optional: Store refresh token if needed
$newUser = User::create([
    // ... existing fields
    'google_refresh_token' => $googleUser->refreshToken, // Optional
]);
```

### Email Verification

Google accounts are automatically verified (`email_verified_at = now()`) since Google verified them.

### Logout

Standard Laravel logout works:

```php
Auth::logout();
session()->invalidate();
session()->regenerateToken();
```

---

## 📊 TESTING CHECKLIST

- [ ] Local development login works
- [ ] New user auto-created with Google data
- [ ] Returning user auto-logged in
- [ ] Profile photo displays
- [ ] Sign out works completely
- [ ] Staging environment login works
- [ ] Staging email verified correctly
- [ ] Production domain authorized in Google Console
- [ ] Production login works end-to-end
- [ ] Session expires properly after logout

---

## 🎯 NEXT STEPS

1. Follow Steps 1-2 to setup Google Cloud Project
2. Share Client ID & Secret with development team
3. Add to `.env` file
4. Implement Steps 3-7 (code)
5. Test locally (Step 8)
6. Deploy to staging (Step 9)
7. Full UAT before production

**Estimated Time**: 2-3 hours (setup + testing)

---

**OAuth Configuration Complete** ✅  
**Ready for Phase 2 Implementation**
