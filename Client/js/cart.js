window.onload = function() {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('token');
    const isUserLoggedIn = token && token !== '' ? true : false;

    if (!isUserLoggedIn) {
        // Se o usuário não estiver logado, exibe um pop-up e redireciona para a página de login
        alert('Por favor, faça login para acessar o carrinho.');
        window.location.href = 'login.html';
    } else {
        // Se o usuário estiver logado, verifica se o carrinho está vazio
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const isCartEmpty = cart.length === 0;

        if (isCartEmpty) {
            alert('Seu carrinho está vazio.');
        } else {
            // Aqui você pode adicionar a lógica para adicionar e remover itens do carrinho
            cart.forEach(item => {
                console.log(item); // Exemplo: substitua por sua própria lógica para exibir os itens do carrinho
            });
        }
    }
};