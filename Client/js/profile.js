// profile.js

import { getSelf, updateUserProfile } from './api/users.js';
import { openAdminModal } from './utilities/admin/adminModal.js';
import { handleUsers, handleCategories, handleSubCategories, handleGenres, handleGameModes } from './utilities/admin/adminHandlers.js';
import { loadNavbar } from './utilities/navbar.js';
import { checkUserLoginStatus, logoutUser } from './utilities/userUtils.js';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Load navbar dynamically
        loadNavbar('navbarContainer');

        // Check user login status and update UI accordingly
        checkUserLoginStatus();

        const { user } = await getSelf();

        const usernameField = document.getElementById('username');
        const emailField = document.getElementById('email');
        const profileImage = document.getElementById('profileImage');
        const pointsHeader = document.getElementById('pointsHeader');
        const adminSection = document.getElementById('adminSection');

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

        // Hide the Profile button in navbar when on profile page
        const profileButton = document.getElementById('profileIcon');
        if (profileButton) {
            profileButton.style.display = 'none';
        }

        // Show admin options if the user is an admin
        if (user.role == 'admin') {
            if (adminSection) {
                adminSection.style.display = 'block';
            }

            // Event listeners for admin buttons
            document.getElementById('btnUsers').addEventListener('click', () => openAdminModal('Users', handleUsers, 'users'));
            document.getElementById('btnCategories').addEventListener('click', () => openAdminModal('Categories', handleCategories, 'categories'));
            document.getElementById('btnSubCategories').addEventListener('click', () => openAdminModal('SubCategories', handleSubCategories, 'subCategories'));
            document.getElementById('btnGenres').addEventListener('click', () => openAdminModal('Genres', handleGenres, 'genres'));
            document.getElementById('btnGameModes').addEventListener('click', () => openAdminModal('Game Modes', handleGameModes, 'gameModes'));
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
                } catch (error) {
                    console.error('Error updating profile:', error);
                    alert('Failed to update profile');
                }
            });
        }

        // Logout button event listener
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                logoutUser();
            });
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Failed to load user profile');
    }
});