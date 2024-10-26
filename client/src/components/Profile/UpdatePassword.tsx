import { useState } from 'react';
import { updatePassword } from '@/api/user';
import Banner from '../common/Banner';
import { useBanner } from '@/hooks/useBanner';
import { validatePassword } from '@/utils/validation';

const UpdatePassword = () => {
    const { banner, showBanner, closeBanner } = useBanner();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async () => {
        const success = await changePassword({ currentPassword, newPassword });
        if (success) {
            setCurrentPassword('');
            setNewPassword('');
            setIsEditing(false);
        }
    };

    const changePassword = async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
        const currentPasswordValidation = await validatePassword(currentPassword);
        if(!currentPasswordValidation.isValid) {
            showBanner("error", currentPasswordValidation.message);
            return false;
        }
        const newPasswordValidation = await validatePassword(newPassword);
        if(!newPasswordValidation.isValid) {
            showBanner("error", newPasswordValidation.message);
            return false;
        }

        const response = await updatePassword({ currentPassword, newPassword });
        if (!response.success) {
            showBanner("error", response.message);
            return false;
        }
        showBanner("success", response.message);
        return true;
    };

    return (
        <div>
            {banner.isVisible && banner.type && (
                <Banner message={banner.message} onClose={closeBanner} type={banner.type} />
            )}

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                {isEditing ? (
                    <div>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="border p-2 rounded w-full mb-2"
                        />
                        <button
                            onClick={handleSubmit}
                            className="text-blue-500 hover:underline mr-4"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            className="text-blue-500 hover:underline"
                            onClick={() => setIsEditing(true)}
                        >
                            Update Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpdatePassword;
