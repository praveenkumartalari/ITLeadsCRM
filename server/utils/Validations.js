// Email validation
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Password validation (8+ chars, uppercase, lowercase, number, special char)
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Phone validation (international format)
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Date validation (must be future date)
function isValidDate(date) {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return inputDate >= today && !isNaN(inputDate);
}

// Budget validation
function isValidBudget(budget) {
    return typeof budget === 'number' && 
           budget >= 0 && 
           budget <= 1000000000; // Optional: Add max budget limit
}

// Lead status validation
function isValidStatus(status, allowedStatuses = [
    'New', 
    'Contacted', 
    'Qualified', 
    'Proposal', 
    'Negotiation', 
    'Won', 
    'Lost'
]) {
    return allowedStatuses.includes(status);
}

// Lead source validation
function isValidSource(source, allowedSources = [
    'Web',
    'Referral',
    'LinkedIn',
    'Email',
    'Cold Call',
    'Event',
    'Other'
]) {
    return allowedSources.includes(source);
}

// Company name validation
function isValidCompanyName(name) {
    return typeof name === 'string' && 
           name.trim().length >= 2 && 
           name.length <= 100;
}

// URL validation
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Industry validation
function isValidIndustry(industry, allowedIndustries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Other'
]) {
    return allowedIndustries.includes(industry);
}

// Notes validation
function isValidNotes(notes) {
    return typeof notes === 'string' && 
           notes.length <= 1000; // Max 1000 characters
}

// User ID validation
function isValidUserId(id) {
    return typeof id === 'string' && 
           /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id);
}

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidPhone,
    isValidDate,
    isValidBudget,
    isValidStatus,
    isValidSource,
    isValidCompanyName,
    isValidURL,
    isValidIndustry,
    isValidNotes,
    isValidUserId
};