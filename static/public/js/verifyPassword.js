function verifyPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password !== confirmPassword) {
        // Show the user an alert
        $('.alert').removeClass('d-none');
        // Don't let the form submit
        return false;
    }
    else {
        return true;
    }
}