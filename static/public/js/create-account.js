const form = document.forms.accountForm;

form.onsubmit = () => {
    validate();
    // Stop the form from submitting before validation
    return false;
};

async function validate() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('passwordConfirmation').value;

    if (password === confirmPassword) {
        await submit(email, password);
    }
    // If the passwords don't match
    else {
        // Show the user an alert
        let errorHTML = await fetch('/html/accounts/create-account/error.html');
        errorHTML = await errorHTML.text();
        errorHTML = await errorHTML.replace('#{error}', 'Passwords do not match!');
        $('#errorAlert').removeClass('d-none');
        $('#errorAlert').html(errorHTML);
    }
}

async function submit(email, password) {
    const response = await fetch('/API/create-account', {
        method: 'POST',
        body: JSON.stringify({
            'email': email,
            'password': password
        }),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    const responseJSON = await response.json();

    // Check if there is an error
    if (!response.ok) {
        const error = responseJSON.error ? responseJSON.error : 'An unspecified error has occured';
        // Fetch error
        let errorHTML = await fetch('/html/accounts/create-account/error.html');
        errorHTML = await errorHTML.text();
        errorHTML = await errorHTML.replace('#{error}', error);

        // Display the error alert
        $('#errorAlert').removeClass('d-none');
        $('#errorAlert').html(errorHTML);
        return;
    }

    // Show the user a success message
    let successHTML = await fetch('/html/accounts/create-account/success.html');
    successHTML = await successHTML.text();
    successHTML = await successHTML.replace('#{email}', email);
    $('#successAlert').removeClass('d-none');
    $('#successAlert').html(successHTML);
}