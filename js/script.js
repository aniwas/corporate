let currentSlide = 0;
let stories = [];
let progressBarInterval;

function openModal(storyMedia, caption) {
    stories = storyMedia;
    currentSlide = 0;
    document.getElementById('storyModal').style.display = 'block';
    document.getElementById('modalCaption').innerText = caption;
    createProgressBars(stories.length);
    showSlide(currentSlide);
    updateProgressBar(currentSlide);
}

function closeModal() {
    document.getElementById('storyModal').style.display = 'none';
    clearInterval(progressBarInterval);
}

function changeSlide(direction) {
    currentSlide += direction;

    // Check if all stories have been viewed
    if (currentSlide >= stories.length) {
        closeModal(); // Automatically close the modal
        return;
    }

    if (currentSlide < 0) {
        currentSlide = stories.length - 1; // Loop back to the last story
    }

    showSlide(currentSlide);
}

function showSlide(index) {
    const modalContent = document.getElementById('modalImg');
    const currentMedia = stories[index];

    // Check if the current media is a video
    if (currentMedia.endsWith('.mp4') || currentMedia.endsWith('.webm') || currentMedia.endsWith('.ogg')) {
        modalContent.outerHTML = `<video class="modal-content" id="modalImg" controls autoplay>
                                    <source src="${currentMedia}" type="video/mp4">
                                    Your browser does not support the video tag.
                                  </video>`;
        const videoElement = document.getElementById('modalImg');
        videoElement.onended = () => changeSlide(1); // Automatically move to the next slide when the video ends
        clearInterval(progressBarInterval); // Stop the progress bar for videos
    } else {
        modalContent.outerHTML = `<img class="modal-content" id="modalImg" src="${currentMedia}" alt="Story Media">`;
        startProgressBar(5000); // Start the progress bar for 5 seconds for images
    }

    // Add "Know More" button dynamically
    const modal = document.getElementById('storyModal');
    let knowMoreButton = document.getElementById('knowMoreButton');
    if (!knowMoreButton) {
        knowMoreButton = document.createElement('button');
        knowMoreButton.id = 'knowMoreButton';
        knowMoreButton.className = 'know-more';
        modal.appendChild(knowMoreButton);
    }
    knowMoreButton.innerText = 'Know More';
    knowMoreButton.onclick = () => {
        alert(`Know more about story ${index + 1}`); // Replace with your desired action
    };

    // Add share icon dynamically
    let shareIcon = document.getElementById('shareIcon');
    if (!shareIcon) {
        shareIcon = document.createElement('img');
        shareIcon.id = 'shareIcon';
        shareIcon.className = 'share-icon';
        modal.appendChild(shareIcon);
    }
    shareIcon.src = './images/share.png'; // Path to your share icon image
    shareIcon.alt = 'Share';
    shareIcon.onclick = () => shareStory(currentMedia);

    updateProgressBar(index);
}

function shareStory(media) {
    const shareData = {
        title: 'Check out this story!',
        text: 'Here is a story I wanted to share with you.',
        url: media // Assuming the media is hosted online
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Story shared successfully!'))
            .catch((error) => console.error('Error sharing story:', error));
    } else {
        alert('Sharing is not supported in this browser.');
    }
}

function createProgressBars(count) {
    const progressBarContainer = document.getElementById('progressBarContainer');
    progressBarContainer.innerHTML = ''; // Clear any existing progress bars
    for (let i = 0; i < count; i++) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const span = document.createElement('span');
        span.style.width = '0%'; // Ensure all progress bars start at 0%
        span.style.animation = 'none'; // Disable animation initially
        progressBar.appendChild(span);
        progressBarContainer.appendChild(progressBar);
    }
}

function updateProgressBar(index) {
    const progressBars = document.querySelectorAll('.progress-bar span');
    progressBars.forEach((bar, i) => {
        if (i < index) {
            // Completed stories should have a full progress bar
            bar.style.width = '100%';
            bar.style.animation = 'none';
        } else if (i === index) {
            // Current story should have an active progress bar animation
            bar.style.width = '0%'; // Reset width
            setTimeout(() => {
                bar.style.animation = 'progress 5s linear forwards'; // Start animation
            }, 0); // Delay to ensure animation is applied
        } else {
            // Future stories should have no progress
            bar.style.width = '0%';
            bar.style.animation = 'none';
        }
    });
}

function startProgressBar(duration) {
    clearInterval(progressBarInterval); // Clear any existing interval
    progressBarInterval = setTimeout(() => {
        if (currentSlide === stories.length - 1) {
            closeModal(); // Automatically close the modal after the last story
        } else {
            changeSlide(1); // Move to the next slide after the duration
        }
    }, duration);

    // Trigger the progress bar animation for the current story
    updateProgressBar(currentSlide);
}