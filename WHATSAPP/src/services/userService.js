const localStore = require('../storage/localStore');

// Registration steps configuration
const REGISTRATION_STEPS = {
    welcome: { next: 'name', prompt: 'Welcome to Digital Khata! 📒\n\nLet\'s get you registered.\n\nPlease enter your *Full Name*:' },
    name: { next: 'age', prompt: 'Great! Now please enter your *Age*:' },
    age: { next: 'dob', prompt: 'Please enter your *Date of Birth* (DD/MM/YYYY):' },
    dob: { next: 'gender', prompt: 'Please select your *Gender*:\n1. Male\n2. Female\n3. Other\n4. Prefer not to say\n\n(Reply with the number)' },
    gender: { next: 'address', prompt: 'Please enter your *Full Address* (Street, City, State, Pincode):' },
    address: { next: 'income', prompt: 'Please enter your *Monthly Income* (in ₹):' },
    income: { next: 'caste', prompt: 'Please enter your *Caste/Community*:' },
    caste: { next: 'occupation', prompt: 'Please enter your *Occupation*:' },
    occupation: { next: 'education', prompt: 'Please enter your *Education Level*:' },
    education: { next: 'completed', prompt: null }
};

class UserService {
    // Find or create user by phone number
    async findOrCreateUser(phoneNumber) {
        return localStore.findOrCreateUser(phoneNumber);
    }
    
    // Get user by phone number
    async getUserByPhone(phoneNumber) {
        return localStore.findUserByPhone(phoneNumber);
    }
    
    // Start registration process
    async startRegistration(phoneNumber) {
        let user = localStore.findUserByPhone(phoneNumber);
        
        if (!user) {
            user = localStore.createUser(phoneNumber);
        }
        
        localStore.updateUser(phoneNumber, {
            registrationStatus: 'in_progress',
            currentStep: 'welcome',
            conversationState: 'registering'
        });
        
        return {
            user,
            message: REGISTRATION_STEPS.welcome.prompt
        };
    }
    
    // Process registration step
    async processRegistrationStep(phoneNumber, input) {
        const user = localStore.findUserByPhone(phoneNumber);
        
        if (!user) {
            return { success: false, message: 'User not found. Please start again.' };
        }
        
        const currentStep = user.currentStep;
        const stepConfig = REGISTRATION_STEPS[currentStep];
        
        if (!stepConfig) {
            return { success: false, message: 'Invalid step. Please try again.' };
        }
        
        // Process input based on current step
        const processResult = await this.processStepInput(user, currentStep, input);
        
        if (!processResult.success) {
            return processResult;
        }
        
        // Move to next step
        const nextStep = stepConfig.next;
        
        if (nextStep === 'completed') {
            localStore.updateUser(phoneNumber, {
                currentStep: nextStep,
                registrationStatus: 'completed',
                conversationState: 'idle'
            });
            
            const updatedUser = localStore.findUserByPhone(phoneNumber);
            
            return {
                success: true,
                completed: true,
                message: `✅ *Registration Complete!*\n\nThank you, ${updatedUser.name}!\n\nYour Digital Khata is ready.\n\nType *MENU* to see available options.`
            };
        }
        
        localStore.updateUser(phoneNumber, { currentStep: nextStep });
        
        return {
            success: true,
            completed: false,
            message: REGISTRATION_STEPS[nextStep].prompt
        };
    }
    
    // Process individual step input
    async processStepInput(user, step, input) {
        const trimmedInput = input ? input.trim() : '1000';
        const phoneNumber = user.phoneNumber;
        
        switch (step) {
            case 'welcome':
                // Just acknowledge, move to name
                return { success: true };
                
            case 'name':
                // Accept any name, minimum 1 character
                const nameToStore = trimmedInput.length >= 1 ? trimmedInput : 'User';
                localStore.updateUser(phoneNumber, { name: nameToStore });
                return { success: true };
                
            case 'age':
                const age = parseInt(trimmedInput) || 25;
                localStore.updateUser(phoneNumber, { age: Math.min(Math.max(age, 1), 150) });
                return { success: true };
                
            case 'dob':
                let dob;
                const dobMatch = trimmedInput.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
                if (dobMatch) {
                    const [, day, month, year] = dobMatch;
                    dob = new Date(year, month - 1, day);
                } else {
                    // Use a default date if format is wrong
                    dob = new Date(2000, 0, 1);
                }
                localStore.updateUser(phoneNumber, { dateOfBirth: dob });
                return { success: true };
                
            case 'gender':
                const genderMap = { '1': 'male', '2': 'female', '3': 'other', '4': 'prefer_not_to_say' };
                const gender = genderMap[trimmedInput] || genderMap[trimmedInput.charAt(0)] || 'prefer_not_to_say';
                localStore.updateUser(phoneNumber, { gender });
                return { success: true };
                
            case 'address':
                // Accept any address
                const addressParts = trimmedInput.split(',').map(p => p.trim());
                const address = {
                    street: addressParts[0] || trimmedInput || 'Not provided',
                    city: addressParts[1] || '',
                    state: addressParts[2] || '',
                    pincode: addressParts[3] || ''
                };
                localStore.updateUser(phoneNumber, { address });
                return { success: true };
                
            case 'income':
                const income = parseFloat(trimmedInput.replace(/[₹,]/g, '')) || 1000;
                localStore.updateUser(phoneNumber, { income: Math.max(income, 0) });
                return { success: true };
                
            case 'caste':
                localStore.updateUser(phoneNumber, { caste: trimmedInput || 'Not provided' });
                return { success: true };
                
            case 'occupation':
                localStore.updateUser(phoneNumber, { occupation: trimmedInput || 'Not provided' });
                return { success: true };
                
            case 'education':
                localStore.updateUser(phoneNumber, { education: trimmedInput || 'Not provided' });
                return { success: true };
                
            default:
                return { success: true };
        }
    }
    
    // Get user profile
    async getProfile(phoneNumber) {
        const user = localStore.findUserByPhone(phoneNumber);
        
        if (!user || user.registrationStatus !== 'completed') {
            return null;
        }
        
        const formatDate = (date) => {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('en-IN');
        };
        
        const formatAddress = (addr) => {
            if (!addr) return 'N/A';
            return [addr.street, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');
        };
        
        return `📋 *Your Profile*\n\n` +
            `👤 Name: ${user.name || 'N/A'}\n` +
            `📞 Phone: ${user.phoneNumber}\n` +
            `🎂 Age: ${user.age || 'N/A'}\n` +
            `📅 DOB: ${formatDate(user.dateOfBirth)}\n` +
            `⚧ Gender: ${user.gender || 'N/A'}\n` +
            `🏠 Address: ${formatAddress(user.address)}\n` +
            `💰 Income: ₹${user.income?.toLocaleString('en-IN') || 'N/A'}\n` +
            `🏷️ Caste: ${user.caste || 'N/A'}\n` +
            `💼 Occupation: ${user.occupation || 'N/A'}\n` +
            `🎓 Education: ${user.education || 'N/A'}`;
    }
    
    // Update user state
    async updateState(phoneNumber, state) {
        return localStore.updateUser(phoneNumber, { conversationState: state });
    }
}

module.exports = new UserService();
