export const getLegacyReleaseEmailTemplate = ({ contactName, ownerName, vaultTitle, customMessage, unlockLink }) => {
    return `
        <div style="font-family: Arial, sans-serif; max-w-2xl mx-auto p-4; color: #333;">
            <h2 style="color: #4f46e5;">Legacy Locker Release</h2>
            <p>Hello ${contactName},</p>
            <p><strong>${ownerName}</strong> has shared a digital vault with you via Legacy Locker, and the release conditions have been met.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin-top: 0;"><strong>Vault Title:</strong> ${vaultTitle}</p>
                <p style="margin-bottom: 0;"><strong>Message from Owner:</strong> ${customMessage || 'None'}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${unlockLink}" style="padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Unlock Legacy</a>
            </div>
            
            <p style="font-size: 0.9em; color: #666;">
                <em>Note: You will need the Sharing PIN provided to you by the owner to decrypt the contents of this vault.</em>
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #999;">
                This is an automated message from Legacy Locker. Please do not reply directly to this email.
            </p>
        </div>
    `;
};
