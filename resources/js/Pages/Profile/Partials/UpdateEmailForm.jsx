import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function UpdateEmailForm({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const initialEmail = user.email ?? '';

    const { data, setData, patch, processing, errors, reset } = useForm({
        email: user.email ?? '',
    });

    const { post: postVerification, processing: verificationProcessing } = useForm({});

    const [verificationSent, setVerificationSent] = useState(false);

    useEffect(() => {
        reset({ email: user.email ?? '' });
        setVerificationSent(false);
    }, [user.email, reset]);

    const emailChanged = data.email !== initialEmail;

    /** Verification is sent to the email stored on the account — not the draft in this field. */
    const showVerifyButton = Boolean(mustVerifyEmail && !user.email_verified_at && !emailChanged);

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => setVerificationSent(false),
        });
    };

    const sendVerificationEmail = () => {
        postVerification(route('verification.send'), {
            preserveScroll: true,
            onSuccess: () => setVerificationSent(true),
        });
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Kemaskini Emel
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Simpan emel baharu dahulu, kemudian hantar pautan pengesahan. Pautan dihantar ke alamat yang
                    telah disimpan.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Emel" />

                    <div className="mt-1 flex gap-2">
                        <TextInput
                            id="email"
                            type="email"
                            className="block min-w-0 flex-1 rounded-xl border-gray-200"
                            value={data.email}
                            onChange={(e) => {
                                setData('email', e.target.value);
                                setVerificationSent(false);
                            }}
                            required
                            autoComplete="username"
                        />

                        {showVerifyButton && (
                            <button
                                type="button"
                                onClick={sendVerificationEmail}
                                disabled={verificationProcessing}
                                title="Hantar emel pengesahan ke peti masuk"
                                className="shrink-0 rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:px-4"
                            >
                                {verificationProcessing ? '…' : 'Hantar'}
                            </button>
                        )}
                    </div>

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {emailChanged && mustVerifyEmail && (
                    <p className="text-xs text-amber-700">
                        Simpan emel baharu dahulu. Selepas simpan, anda boleh hantar emel pengesahan ke peti masuk
                        emel tersebut.
                    </p>
                )}

                {(verificationSent || status === 'verification-link-sent') && (
                    <p className="text-sm text-green-600">
                        Emel pengesahan telah dihantar. Sila semak peti masuk (dan spam).
                    </p>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        className="w-full justify-center rounded-xl py-2.5 sm:w-auto"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Kemas Kini Emel'}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
