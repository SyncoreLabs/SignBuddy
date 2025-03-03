import React, { useState, useEffect, useContext } from "react";
import { usePageTitle } from "../hooks/usePageTitle";

interface Avatar {
    key: string;
    url: string;
}

const AccountSettings = () => {
    usePageTitle("Account Settings");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const avatarsPerPage = 10;
    const totalPages = Math.ceil((avatars.length - 1) / avatarsPerPage);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [currentUser, setCurrentUser] = useState<{
        userName: string;
        email: string;
        avatar: string;
        pass: Boolean;
    } | null>(null);
    const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'password'
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [verifyMessage, setVerifyMessage] = useState("");

    const [pendingChanges, setPendingChanges] = useState<{
        userName?: string;
        email?: string;
        avatar?: string;
    } | null>(null);
    const validateEmail = (email: string): boolean => {
        // Simple email regex to check for a basic email pattern.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "https://server.signbuddy.in/api/v1/me/profile-delete",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to delete account");

            // Clear local storage and redirect to home/login
            localStorage.clear();
            window.location.href = "/";
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError("Password must contain at least one uppercase letter");
            return false;
        }
        if (!/[a-z]/.test(password)) {
            setPasswordError("Password must contain at least one lowercase letter");
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError("Password must contain at least one number");
            return false;
        }
        setPasswordError("");
        return true;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const authMethod = localStorage.getItem("authMethod"); // Add this line
                const response = await fetch("https://server.signbuddy.in/api/v1/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch user data");
                const { user } = await response.json();
                if (user) {
                    setCurrentUser(user);
                    setUsername(user.userName || "");
                    setEmail(user.email || "");
                    setSelectedAvatar(user.avatar || "");

                    // Update this line to use localStorage
                    setIsGoogleUser(authMethod === "google");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchAvatars = async () => {
            try {
                const response = await fetch(
                    "https://server.signbuddy.in/api/v1/getavatars"
                );
                if (!response.ok) throw new Error("Failed to fetch avatars");
                const data = await response.json();
                setAvatars(data.filter((avatar: Avatar) => avatar.key !== "avatars/"));
            } catch (error) {
                console.error("Error fetching avatars:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvatars();
    }, []);

    const handleVerifyOtp = async () => {
        try {
            const token = localStorage.getItem("token");

            // Call the verification endpoint. Note that we pass both the current email and the new email.
            const verifyResponse = await fetch(
                "https://server.signbuddy.in/api/v1/me/profile-verify",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        otp,
                        email: currentUser?.email,
                        newEmail: pendingChanges?.email,
                    }),
                }
            );
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
                throw new Error(verifyData.error || "Invalid OTP");
            }

            setUpdateMessage("Email updated successfully.");
            setShowOtpModal(false);
            setOtp("");
            setCurrentUser((prev) =>
                prev ? { ...prev, email: pendingChanges?.email || prev.email } : null
            );
            setPendingChanges(null);
        } catch (error: any) {
            console.error("Error verifying OTP:", error);
            setVerifyMessage(error.message || "Error verifying OTP");
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            let changedFields: Partial<{
                userName: string;
                email: string;
                avatar: string;
            }> = {};

            // Determine what fields have changed
            if (username !== currentUser?.userName) {
                changedFields.userName = username;
            }
            if (selectedAvatar !== currentUser?.avatar) {
                changedFields.avatar = selectedAvatar;
            }
            if (email !== currentUser?.email) {
                if (!validateEmail(email)) {
                    alert("Email ain't correct");
                    return;
                }
                changedFields.email = email;
            }

            if (Object.keys(changedFields).length === 0) {
                setUpdateMessage("No changes to update.");
                return;
            }

            // Call the update endpoint. According to the server code, if an email is present,
            // it will send an OTP rather than update the email immediately.
            const response = await fetch(
                "https://server.signbuddy.in/api/v1/me/profile-update",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(changedFields),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile.");
            }

            // If the email is being changed, the server sends an OTP and expects a subsequent verification.
            if (changedFields.email) {
                setPendingChanges(changedFields);
                setShowOtpModal(true);
                setUpdateMessage("OTP sent to your email.");
            } else {
                setUpdateMessage("Profile updated successfully.");
                setCurrentUser((prev) => (prev ? { ...prev, ...changedFields } : null));
            }
        } catch (error: any) {
            console.error("Error:", error);
            setUpdateMessage(error.message || "Error updating profile.");
        }
    };

    const handlePasswordUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            // Validate passwords match
            if (newPassword !== confirmPassword) {
                setPasswordError("Passwords do not match");
                return;
            }

            // Validate new password
            if (!validatePassword(newPassword)) {
                return;
            }

            let response;
            if (isGoogleUser) {
                // For Google users, use reset password endpoint
                response = await fetch(
                    "https://server.signbuddy.in/api/v1/resetpassword",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            otp,
                            email,
                            newPassword,
                        }),
                    }
                );
            } else {
                // For regular users, use change password endpoint
                response = await fetch(
                    "https://server.signbuddy.in/api/v1/me/changepassword",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            oldPassword: currentPassword,
                            newPassword,
                        }),
                    }
                );
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update password");
            }

            // Reset fields after successful update
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setOtp("");
            setPasswordError("");
            alert("Password updated successfully");
        } catch (error: any) {
            setPasswordError(error.message || "Error updating password");
        }
    };

    return (
        <div className="bg-black min-h-[calc(100vh-64px)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Header - adjust text sizes */}
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold mb-1">
                        Account Settings
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500">
                        Manage your profile information, update your avatar, and modify your
                        account settings
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[200px,1fr] gap-6">
                    {/* Left Sidebar */}
                    <div className="flex lg:flex-col gap-2 lg:space-y-1.5 overflow-x-auto pb-2 lg:pb-0">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg flex-shrink-0 ${activeTab === "profile"
                                    ? "bg-white/5 border border-white/10"
                                    : "hover:bg-white/5 text-gray-400"
                                }`}
                        >
                            Profile Settings
                        </button>
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`w-full text-center px-3 py-2 rounded-lg ${activeTab === "password"
                                    ? "bg-white/5 border border-white/10"
                                    : "hover:bg-white/5 text-gray-400"
                                }`}
                        >
                            Password Settings
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full text-center px-3 py-2 rounded-lg hover:bg-white/5 text-red-500"
                        >
                            Delete Account
                        </button>
                    </div>

                    {/* Main Content */}
                    <div>
                        {activeTab === "profile" ? (
                            <div className="bg-[#111] rounded-lg border border-white/10 p-4 sm:p-6">
                                {/* Profile Info and Avatar Selection */}
                                <div className="flex flex-col sm:flex-row gap-6 sm:gap-[275px] items-start">
                                    {/* Left: Profile Info */}
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <img
                                            src={currentUser?.avatar || "/default-avatar.png"}
                                            alt="Current Avatar"
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <h2 className="text-lg sm:text-xl text-gray-200">
                                                {currentUser?.userName}
                                            </h2>
                                            <p className="text-sm sm:text-base text-gray-500">
                                                {currentUser?.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Avatar Grid */}
                                    <div className="w-full sm:w-[350px]">
                                        <div className="grid grid-cols-5 gap-3 sm:gap-4 mb-3">
                                            {!isLoading &&
                                                avatars
                                                    .slice(
                                                        (currentPage - 1) * avatarsPerPage,
                                                        currentPage * avatarsPerPage
                                                    )
                                                    .map((avatar) => (
                                                        <button
                                                            key={avatar.key}
                                                            onClick={() => setSelectedAvatar(avatar.url)}
                                                            className={`w-[50px] h-[50px] rounded-full overflow-hidden relative ${selectedAvatar === avatar.url
                                                                    ? "ring-4 ring-blue-500"
                                                                    : ""
                                                                }`}
                                                        >
                                                            <img
                                                                src={avatar.url}
                                                                alt={`Avatar ${avatar.key}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {selectedAvatar === avatar.url && (
                                                                <div className="absolute inset-0  flex items-center justify-center"></div>
                                                            )}
                                                        </button>
                                                    ))}
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((p) => Math.max(1, p - 1))
                                                    }
                                                    disabled={currentPage === 1}
                                                    className="text-xl text-gray-400 disabled:opacity-50"
                                                >
                                                    ←
                                                </button>
                                                <span className="text-gray-400">
                                                    {currentPage} of {totalPages}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                                                    }
                                                    disabled={currentPage === totalPages}
                                                    className="text-xl text-gray-400 disabled:opacity-50"
                                                >
                                                    →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="max-w-md space-y-4 mt-6">
                                    <div>
                                        <label className="block text-gray-200 mb-2">
                                            Update username
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded px-4 py-2.5 text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-200 mb-2">
                                            Update email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded px-4 py-2.5 text-base"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full text-center px-4 py-2.5 bg-[#222] rounded text-base hover:bg-[#333]"
                                        >
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            activeTab === "password" && (
                                <div className="bg-[#111] rounded-lg border border-white/10 p-4 sm:p-6">
                                    <div className="max-w-xl space-y-6">
                                        {currentUser?.pass !== false && (
                                            <div>
                                                <label className="block text-xl mb-2 sm:mb-4">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    placeholder="Enter your current password"
                                                    className="w-[350px] sm:w-[400px] bg-black/50 border border-white/10 rounded-lg px-2 sm:px-2 py-2 sm:py-2 text-base sm:text-lg"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-xl mb-4">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(e.target.value);
                                                    validatePassword(e.target.value);
                                                }}
                                                placeholder="Enter new password"
                                                className="w-[350px] sm:w-[400px] bg-black/50 border border-white/10 rounded-lg px-2 sm:px-2 py-2 sm:py-2 text-base sm:text-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xl mb-4">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                className="w-[350px] sm:w-[400px] bg-black/50 border border-white/10 rounded-lg px-2 sm:px-2 py-2 sm:py-2 text-base sm:text-lg"
                                            />
                                        </div>
                                        {passwordError && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {passwordError}
                                            </p>
                                        )}
                                        <button
                                            onClick={handlePasswordUpdate}
                                            disabled={!newPassword || newPassword !== confirmPassword}
                                            className="w-[350px] sm:w-[400px] mt-4 bg-black/50 border border-white/10 text-white rounded-lg px-2 sm:px-2 py-2 sm:py-2 text-md font-medium disabled:opacity-50 hover:bg-black/70"
                                        >
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
            {showOtpModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#111] rounded-lg w-full max-w-[600px] p-6 sm:p-8 relative">
                        <button
                            onClick={() => setShowOtpModal(false)}
                            className="absolute right-8 top-8 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-3xl font-semibold mb-4">Verify OTP</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            An OTP has been sent to your account to change the email, please
                            enter it below.
                        </p>
                        <div className="space-y-2">
                            <label className="block text-xl">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                maxLength={4}
                                placeholder="OTP"
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-lg"
                            />
                        </div>
                        <button
                            onClick={handleVerifyOtp}
                            disabled={otp.length !== 4}
                            className="mt-8 w-32 float-right bg-white text-black rounded-lg px-6 py-3 text-lg font-medium disabled:opacity-50"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#111] rounded-lg w-full max-w-[500px] p-6 sm:p-8 relative">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute right-8 top-8 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                        <h2 className="text-3xl font-semibold mb-4 text-red-500">
                            Delete Account
                        </h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Are you sure you want to delete your account? This action cannot
                            be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2 border border-white/10 rounded-lg text-gray-400 hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {updateMessage && (
                <div className="mt-4 p-4 bg-green-500/10 text-green-500 rounded-lg">
                    {updateMessage}
                </div>
            )}

            {verifyMessage && (
                <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-lg">
                    {verifyMessage}
                </div>
            )}
        </div>
    );
};

export default AccountSettings;