
/**
 * Shared profile header: back link, title, optional avatar (or custom node), name & email.
 * @param {boolean} [showAvatar=true] — false for admin (no profile image).
 * @param {React.ReactNode} [avatar] — replaces default circular image (e.g. pentadbir with pencil overlay).
 */
export default function BioDataShell({
    avatarUrl,
    name,
    email,
    showAvatar = true,
    avatar = null,
    children,
}) {
    return (
        <div className="w-full min-w-0">

            {showAvatar && (
                <div className="flex flex-col items-center mb-8">
                    {avatar ? (
                        avatar
                    ) : (
                        <div className="h-28 w-28 rounded-full overflow-hidden bg-pink-100 border-4 border-white shadow-md ring-2 ring-gray-100">
                            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                    )}
                    <p className="mt-4 text-lg font-bold text-gray-900 text-center">{name}</p>
                    <p className="mt-1 text-sm text-gray-500 text-center break-all px-2 max-w-full">{email}</p>
                </div>
            )}

            {!showAvatar && (
                <div className="mb-8 text-center px-1">
                    <p className="text-lg font-bold text-gray-900">{name}</p>
                    <p className="mt-1 text-sm text-gray-500 break-all">{email}</p>
                </div>
            )}

            <div className="w-full min-w-0">{children}</div>
        </div>
    );
}
