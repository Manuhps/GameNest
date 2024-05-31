document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita o envio do formulário padrão
        
        // Coleta os valores dos campos de entrada
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Envia os dados de login para o backend
        fetch('http://127.0.0.1:8080/users/login', {
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
                throw new Error('Falha ao fazer login');
            }
            return response.json();
        })
        .then(data => {
            // Se o login for bem-sucedido, armazene o token de autenticação e redirecione para a página inicial
            console.log('Login bem-sucedido', data);
            window.location.href = '/index.html'; // Redireciona para a página inicial

            // Substitui o botão de login por um ícone de perfil
            const loginButton = document.getElementById('loginButton');
            loginButton.style.display = 'none'; // Esconde o botão de login
            const profileIcon = document.getElementById('profileIcon');
            profileIcon.style.display = 'block'; // Mostra o ícone de perfil
        })
        .catch(error => {
            console.error('Falha ao fazer login:', error);
            // Exiba uma mensagem de erro para o usuário
            alert('Falha ao fazer login. Por favor, verifique seu nome de usuário e senha e tente novamente.');
        });
    });
});