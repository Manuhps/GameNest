window.onload = function() {
    // Verifica se o usuário está logado
    // Substitua 'isUserLoggedIn' pela sua própria lógica para verificar se o usuário está logado
    const isUserLoggedIn = localStorage.getItem('token') ? true : false;

    if (!isUserLoggedIn) {
        // Se o usuário não estiver logado, exibe um pop-up e redireciona para a página de login
        alert('Por favor, faça login para acessar o carrinho.');
        window.location.href = 'login.html';
    } else {
        // Se o usuário estiver logado, verifica se o carrinho está vazio
        // Substitua 'isCartEmpty' pela sua própria lógica para verificar se o carrinho está vazio
        const isCartEmpty = true; // Exemplo: substitua por sua própria lógica

        if (isCartEmpty) {
            alert('Seu carrinho está vazio.');
        }

        // Aqui você pode adicionar a lógica para adicionar e remover itens do carrinho
    }
};