import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import PentadbirLayout from '@/Layouts/PentadbirLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    
    // Choose the layout based on the user's role
    const getLayout = (children) => {
        if (user.role === 'admin') {
            return <AdminLayout header="Profil">{children}</AdminLayout>;
        }
        if (user.role === 'pentadbir') {
            return <PentadbirLayout header="Profil">{children}</PentadbirLayout>;
        }
        return (
            <AuthenticatedLayout
                header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profile</h2>}
            >
                {children}
            </AuthenticatedLayout>
        );
    };

    return getLayout(
        <>
            <Head title="Profil" />

            <div className="py-6">
                <div className="w-full space-y-6">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </>
    );
}
