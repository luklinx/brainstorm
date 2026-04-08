# App Router Migration - Quick Start Guide

## What Was Created

Your Next.js 15 App Router structure is now ready with:

- ✅ **App Router** with TypeScript support
- ✅ **Authentication pages** (signin/signup)
- ✅ **Role-based dashboards** (Admin, Staff, Instructor, Student)
- ✅ **Protected routes** with middleware
- ✅ **Business Center admin page**
- ✅ **Supabase integration** ready
- ✅ **Tailwind CSS** with Brainstorm branding
- ✅ **Global layouts** and route groups

## File Structure Overview

```
app/
├── (auth)/
│   ├── signin/page.tsx        👤 Sign in page
│   └── signup/page.tsx        📝 Sign up page
├── dashboard/
│   ├── layout.tsx              🎨 Shared dashboard layout
│   ├── page.tsx                🔀 Role-based redirect
│   ├── admin/page.tsx          ⚙️  Admin dashboard
│   ├── admin/business-center/  💼 Business center
│   ├── staff/page.tsx          👨‍💼 Staff dashboard
│   ├── instructor/page.tsx     👨‍🏫 Instructor dashboard
│   └── student/page.tsx        👨‍🎓 Student dashboard
├── api/
│   └── auth/callback/route.ts  🔐 Auth endpoint
├── globals.css                 🎨 Global styles
├── layout.tsx                  📋 Root layout
├── page.tsx                    🏠 Home page
└── providers.tsx               ⚡ Auth provider

lib/
├── supabase.ts                 🔗 Supabase client
├── auth.ts                     🔐 Auth utilities
└── api-helpers.ts              📡 API helpers
```

## Getting Started

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Set Environment Variables
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Step 3: Create Admin User
In Supabase SQL Editor, run:
```sql
-- Update existing user to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing the Flow

1. **Home Page** → http://localhost:3000
   - Sign In / Sign Up buttons

2. **Testing Signup**
   - Go to /signup
   - Register new account
   - Check confirmation email

3. **Testing Signin**
   - Go to /signin
   - Use test credentials
   - Redirected to dashboard based on role

4. **Admin Dashboard**
   - http://localhost:3000/dashboard/admin
   - Business Center management
   - User statistics
   - Revenue tracking

5. **Business Center Page**
   - http://localhost:3000/dashboard/admin/business-center
   - Branch management
   - Revenue overview

## Important Notes

### Authentication Flow
1. User signs up → Profile created in Supabase
2. User signs in → Session established
3. AuthContext fetches user profile
4. Dashboard redirects based on role
5. Protected routes checked by middleware

### Dashboard Navigation
- **Admin**: Full control of Business Center, users, reports
- **Staff**: Manage students and courses
- **Instructor**: Manage owned courses and grades
- **Student**: View courses and grades

### Protected Routes Pattern
- Dashboard pages are wrapped in DashboardLayout
- Layout checks authentication and role
- Middleware guards against direct access
- Redirect to signin if not authenticated

## Next Steps

### 1. Update Dashboard Pages
Add your content to each dashboard page:
- Admin dashboard: Statistics, recent activities
- Business Center: Branch/service management
- Staff/Instructor/Student: Role-specific features

### 2. Create Database Queries
Add Supabase queries in dashboard pages:
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('creator_id', profile.id)
```

### 3. Add API Routes
Create route handlers in `app/api/`:
```typescript
// app/api/users/route.ts
export async function GET(request: NextRequest) {
  // Handle GET request
}
```

### 4. Build Components
Create reusable components in `components/`:
- Sidebar navigation
- Card components
- Form components
- Tables & data display

### 5. Add More Pages
Extend dashboard structure:
```
dashboard/
├── admin/
│   ├── users/page.tsx          # User management
│   ├── reports/page.tsx        # Analytics
│   └── settings/page.tsx       # Admin settings
├── staff/
│   ├── students/page.tsx       # Student list
│   └── courses/page.tsx        # Course management
```

## Key Features Used

### Route Groups (Parentheses)
- `(auth)` - Auth pages without dashboard layout
- Allows shared layouts without affecting URL

### Dynamic Routes
- `/dashboard/[role]/page.tsx` - Coming soon
- Reduces code duplication

### API Routes
- `app/api/` - All API endpoints
- Automatic Next.js server functions

### Middleware
- `middleware.ts` - Auth checks before routes
- Redirects unauthorized users to signin

### Server Components
- Default behavior in App Router
- Better performance
- Direct database access possible

## Troubleshooting

### "useAuth" Error
- Ensure component is wrapped in `<AuthProvider>`
- Use `'use client'` at top of component

### "Supabase URL not found"
- Check `.env.local` file exists
- Verify environment variables are set
- Restart dev server after changing env

### "Protected route showing public content"
- Clear browser cache
- Check middleware configuration
- Verify auth cookies are being set

### Styling not showing
- Check `globals.css` import in root layout
- Verify Tailwind config is correct
- Restart dev server

## Performance Tips

1. **Use Server Components** by default
   - Add `'use client'` only when needed
   - Reduces JavaScript sent to browser

2. **Code Splitting**
   - Dynamic imports for heavy components
   - `next/dynamic` for lazy loading

3. **Image Optimization**
   - Use `<Image>` from `next/image`
   - Automatic optimization

4. **Database Queries**
   - Use selective queries (not `SELECT *`)
   - Cache frequently accessed data
   - Implement pagination for large datasets

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Supabase Docs](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Support

For issues or questions about the App Router migration:
1. Check the error message carefully
2. Review the APP_ROUTER_MIGRATION.md file
3. Check Next.js and Supabase documentation
4. Review created example files

---

**Happy coding! 🚀**
