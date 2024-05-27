document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita o envio do formulário padrão
        
        // Coleta os valores dos campos de entrada
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Envia os dados de login para o backend
        fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to login');
            }
            return response.json();
        })
        .then(data => {
            // Se o login for bem-sucedido, redirecione para a página de perfil ou faça alguma outra ação
            console.log('Login successful', data);
            // Por exemplo, redirecionar para a página de perfil:
            // window.location.href = '/profile';
        })
        .catch(error => {
            console.error('Login failed:', error);
            // Exiba uma mensagem de erro para o usuário
            alert('Login failed. Please check your username and password and try again.');
        });
    });
});
