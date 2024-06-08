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

           // Armazene o estado de login do usuário
           localStorage.setItem('isLoggedIn', 'true'); 

           // Oculta o botão de login
           const loginButton = document.getElementById('loginButton');
           if (loginButton) loginButton.style.display = 'none';

           // Mostra o botão de logout
           const logoutButton = document.getElementById('logoutButton');
           if (logoutButton) logoutButton.style.display = 'block';

           // Mostra o ícone de perfil
           const profileIcon = document.getElementById('profileIcon');
           if (profileIcon) profileIcon.style.display = 'block';

           window.location.href = '../index.html'; // Redireciona para a página inicial
        });
    });
});

document.getElementById('logoutButton').addEventListener('click', function () {
    // Limpe o estado de login do usuário
    localStorage.removeItem('isLoggedIn');

    // Mostra o botão de login
    const loginButton = document.getElementById('loginButton');
    if (loginButton) loginButton.style.display = 'block';

    // Oculta o botão de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) logoutButton.style.display = 'none';

    // Oculta o ícone de perfil
    const profileIcon = document.getElementById('profileIcon');
    if (profileIcon) profileIcon.style.display = 'none';

    // Redireciona para a página de login
    window.location.href = 'index.html';
});