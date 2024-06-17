import { getSelf, updateUserProfile } from '../api/users.js';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const { user } = await getSelf();

        const usernameField = document.getElementById('username');
        const emailField = document.getElementById('email');
        const profileImage = document.getElementById('profileImage');
        const pointsHeader = document.getElementById('pointsHeader');
        const adminTab = document.getElementById('adminOptions-tab');
        const adminSection = document.querySelector('.admin-section');

        if (usernameField) {
            usernameField.value = user.username;
        }

        if (emailField) {
            emailField.value = user.email;
        }

        if (profileImage) {
            profileImage.src = user.profileImage;
        }

        if (pointsHeader) {
            pointsHeader.innerText = `Points: ${user.points || 0}`;
        }

        // Show admin options if the user is an admin
        if (user.role === 'admin') {
            if (adminSection) {
                adminSection.style.display = 'block';
            }
            // Event listeners for admin buttons
            document.getElementById('btnUsers').addEventListener('click', () => openAdminModal('Users', getUsers));
            document.getElementById('btnCategories').addEventListener('click', () => openAdminModal('Categories', getCategories, true));
            document.getElementById('btnSubCategories').addEventListener('click', () => openAdminModal('SubCategories', getSubCategories));
            document.getElementById('btnOrders').addEventListener('click', () => openAdminModal('Orders', getOrders));
            document.getElementById('btnGenres').addEventListener('click', () => openAdminModal('Genres', getGenres));
            document.getElementById('btnGameModes').addEventListener('click', () => openAdminModal('Game Modes', getGameModes));
        }

        // Event listener for tab change
        const profileTabs = document.getElementById('profileTabs');
        if (profileTabs) {
            profileTabs.addEventListener('click', (event) => {
                const targetTab = event.target;
                if (targetTab && targetTab.matches('.nav-link')) {
                    const activeTab = profileTabs.querySelector('.nav-link.active');
                    if (activeTab) {
                        activeTab.classList.remove('active');
                    }
                    targetTab.classList.add('active');

                    const targetPanel = document.querySelector(targetTab.getAttribute('href'));
                    const activePanel = document.querySelector('.tab-pane.show.active');
                    if (activePanel) {
                        activePanel.classList.remove('show', 'active');
                    }
                    if (targetPanel) {
                        targetPanel.classList.add('show', 'active');
                    }
                }
            });
        }

        // Update profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async function (event) {
                event.preventDefault();

                const updatedProfile = {
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                };

                try {
                    const updatedUser = await updateUserProfile(updatedProfile);
                    alert('Profile updated successfully');
                    // Optionally refresh the page or user details
                } catch (error) {
                    console.error('Error updating profile:', error);
                    alert('Failed to update profile');
                }
            });
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Failed to load user profile');
    }
});