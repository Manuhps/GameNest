// Function to generate star HTML based on rating
export function getStarsHTML(rating) {
    const maxStars = 5;
    const fullStars = Math.floor(rating); // Full stars (integer part of rating)
    const halfStar = rating % 1 !== 0; // Check if there's a half star

    let starHTML = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starHTML += '<i class="bi bi-star-fill text-warning"></i>';
    }

    // Add half star
    if (halfStar) {
        starHTML += '<i class="bi bi-star-half text-warning"></i>';
    }

    // Add empty stars to fill up to maxStars
    const remainingStars = maxStars - Math.ceil(rating); // Remaining empty stars
    for (let i = 0; i < remainingStars; i++) {
        starHTML += '<i class="bi bi-star text-warning"></i>';
    }

    return starHTML;
}