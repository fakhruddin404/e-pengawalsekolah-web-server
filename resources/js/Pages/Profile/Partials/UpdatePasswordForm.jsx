import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '', embedded = false }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const inputClass = embedded
        ? 'mt-1 block w-full rounded-xl border-gray-200'
        : 'mt-1 block w-full';

    return (
        <section className={className}>
            <header>
                <h2 className={embedded ? 'text-base font-semibold text-gray-900' : 'text-lg font-medium text-gray-900'}>
                    {embedded ? 'Kata laluan' : 'Update Password'}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    {embedded
                        ? 'Gunakan kata laluan yang kuat dan unik untuk akaun anda.'
                        : 'Ensure your account is using a long, random password to stay secure.'}
                </p>
            </header>

            <form onSubmit={updatePassword} className={embedded ? 'mt-5 space-y-5' : 'mt-6 space-y-6'}>
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value={embedded ? 'Kata laluan semasa' : 'Current Password'}
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="current-password"
                    />

                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={embedded ? 'Kata laluan baharu' : 'New Password'} />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={embedded ? 'Sahkan kata laluan' : 'Confirm Password'}
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className={inputClass}
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className={embedded ? 'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4' : 'flex items-center gap-4'}>
                    <PrimaryButton
                        disabled={processing}
                        className={embedded ? 'w-full justify-center rounded-xl py-2.5 sm:w-auto' : ''}
                    >
                        {processing ? 'Menyimpan...' : 'Kemas Kini Kata Laluan'}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
