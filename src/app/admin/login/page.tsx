import { redirect } from 'next/navigation';

// Old login page now redirects to Clerk sign-in
export default function AdminLoginPage() {
    redirect('/sign-in');
}
