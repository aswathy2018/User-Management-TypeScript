
document.addEventListener('DOMContentLoaded', () => {
    let signupForm = document.getElementById('signupForm');
    let registerForm = document.getElementById('registerFormElement');
    let resetForm = document.getElementById('resetPasswordForm');
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    let googleBtn = document.querySelector('.google-btn');
    let closeBtn = document.querySelector('.close-icon');
    let overlay = document.querySelector('.overlay');
    let popupContainer = document.querySelector('.popup-container');
    let switchFormLinks = document.querySelectorAll('.switch-form, .forgot-link');

    switchFormLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '/signup' || href === '/') {
                return;
            }
            e.preventDefault();
            let targetForm = link.getAttribute('data-form');
            switchForm(targetForm);
        });
    });

    function switchForm(formId) {
        let forms = document.querySelectorAll('.form');
        forms.forEach(form => form.classList.remove('active'));
        const targetFormElement = document.getElementById(formId);
        if (targetFormElement) {
            targetFormElement.classList.add('active');
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (overlay && popupContainer) {
                overlay.style.opacity = '0';
                popupContainer.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }
        });
    }

    if (popupContainer) {
        popupContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            if (closeBtn) closeBtn.click();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let email = emailInput ? emailInput.value.trim() : '';
            let password = passwordInput ? passwordInput.value.trim() : '';
            let remember = document.getElementById('remember')?.checked;

            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return;
            }

            console.log('Login form submitted:', { email, password, remember });
            showSuccess('Successfully signed in!');
            signupForm.reset();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let name = document.getElementById('name')?.value.trim() || '';
            let email = document.getElementById('registerEmail')?.value.trim() || '';
            let password = document.getElementById('registerPassword')?.value.trim() || '';
            let confirmPassword = document.getElementById('confirmPassword')?.value.trim() || '';

            if (!name || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            console.log('Register form submitted:', { name, email, password });
            showSuccess('Account created successfully!');
            registerForm.reset();
            setTimeout(() => {
                switchForm('loginForm');
            }, 2000);
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let email = document.getElementById('resetEmail')?.value.trim() || '';

            if (!email) {
                showError('Please enter your email');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            console.log('Reset password requested for:', email);
            showSuccess('Password reset link sent to your email!');
            resetForm.reset();
            setTimeout(() => {
                switchForm('loginForm');
            }, 2000);
        });
    }

    document.querySelectorAll('.google-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Google sign in clicked');
        });
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    document.querySelectorAll('input').forEach(input => {
        let inputGroup = input.parentElement;
        input.addEventListener('focus', () => {
            if (inputGroup) inputGroup.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (inputGroup) {
                inputGroup.classList.remove('focused');
                if (input.value) {
                    inputGroup.classList.add('filled');
                } else {
                    inputGroup.classList.remove('filled');
                }
            }
        });
    });

    function showError(message) {
        let messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        messageDiv.textContent = message;
        insertMessage(messageDiv);
    }

    function showSuccess(message) {
        let messageDiv = document.createElement('div');
        messageDiv.className = 'message success';
        messageDiv.textContent = message;
        insertMessage(messageDiv);
    }

    function insertMessage(messageDiv) {
        let existingMessage = document.querySelector('.message');
        if (existingMessage) existingMessage.remove();

        let activeForm = document.querySelector('.form.active');
        if (activeForm) {
            let submitBtn = activeForm.querySelector('.signup-btn');
            if (submitBtn && submitBtn.parentElement) {
                submitBtn.parentElement.insertBefore(messageDiv, submitBtn);
            }
        }
        setTimeout(() => messageDiv.remove(), 3000);
    }
});