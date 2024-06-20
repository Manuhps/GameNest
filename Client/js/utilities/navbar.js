export function loadNavbar(containerId, isProfilePage = false, isCartPage = false) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container px-4 px-lg-5">
                <a class="navbar-brand" href="/">Game Nest</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><hr class="dropdown-divider" /></li>
                                <li><a class="dropdown-item" href="html/consoles.html">Consoles</a></li>
                                <li><a class="dropdown-item" href="#!">Jogos</a></li>
                                <li><a class="dropdown-item" href="#!">Perifericos</a></li>
                                <li><a class="dropdown-item" href="#!">Portateis</a></li>
                            </ul>
                        </li>
                    </ul>
                    <div class="d-flex">
                        <a href="html/cart.html">
                            <button class="btn btn-outline-dark" type="submit">
                                <i class="bi-cart-fill me-1"></i>
                                Cart
                            </button>
                        </a>
                        ${isLoggedIn ?
                            (isProfilePage ?
                                `<button class="btn btn-outline-dark ms-2" type="button" id="logoutButton">
                                    <i class="bi-person-fill me-1"></i>
                                    Logout
                                </button>`
                                : isCartPage ?
                                `<a href="html/profile.html">
                                    <button class="btn btn-outline-dark ms-2" type="button" id="profileIcon">
                                        <i class="bi-person-fill me-1"></i>
                                        Profile
                                    </button>
                                </a>
                                <button class="btn btn-outline-dark ms-2" type="button" id="logoutButton">
                                    <i class="bi-person-fill me-1"></i>
                                    Logout
                                </button>`
                                :
                                `<a href="html/profile.html">
                                    <button class="btn btn-outline-dark ms-2" type="button" id="profileIcon">
                                        <i class="bi-person-fill me-1"></i>
                                        Profile
                                    </button>
                                </a>
                                <button class="btn btn-outline-dark ms-2" type="button" id="logoutButton">
                                    <i class="bi-person-fill me-1"></i>
                                    Logout
                                </button>`
                            )
                            :
                            `<a href="html/login.html">
                                <button class="btn btn-outline-dark ms-2" type="button" id="loginButton">
                                    <i class="bi-person-fill me-1"></i>
                                    Login
                                </button>
                            </a>`
                        }
                    </div>
                </div>
            </div>
        </nav>
    `;

    document.getElementById(containerId).innerHTML = navbarHTML;
}