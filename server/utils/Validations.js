function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // Password must:
    // - Be at least 8 characters long
    // - Contain at least one uppercase letter
    // - Contain at least one lowercase letter
    // - Contain at least one number
    // - Contain at least one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

module.exports = {
    isValidEmail,
    isValidPassword
};