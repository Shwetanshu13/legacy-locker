export const getInactivityWarningEmailTemplate = ({ ownerName, vaultTitle }) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-w-2xl mx-auto p-4">
        <h2 style="color: #0d9488;">Inactivity Warning: Digital Vault</h2>
        <p>Hello ${ownerName},</p>
        <p>This is a reminder from Legacy Locker.</p>
        <p>Your digital vault <strong>"${vaultTitle}"</strong> is scheduled to be triggered and shared with your nominees due to inactivity.</p>
        <p>The vault is currently <strong>1 day away</strong> from being released. If you wish to prevent this, please log into your account immediately to reset your inactivity timer.</p>
        
        <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_API_URL}/login" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Login to Legacy Locker
            </a>
        </div>
        
        <p>If you intended for this vault to be released, no further action is required.</p>
        <p>Stay safe,<br/>The Legacy Locker Team</p>
    </div>
    `;
};
