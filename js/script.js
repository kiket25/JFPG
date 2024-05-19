document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");

    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        console.error('Posts container not found!');
        return;
    }

    // List of post metadata (title and description)
    const posts = [
        { title: 'Post 1 Title', description: 'Description of Post 1', file: 'post1.md' },
        { title: 'Post 2 Title', description: 'Description of Post 2', file: 'post2.md' }
    ];

    // Function to load and display posts
    const loadPosts = () => {
        console.log("Loading posts");

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.description}</p>
            `;
            postElement.addEventListener('click', async () => {
                try {
                    const response = await fetch(`posts/${post.file}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const markdown = await response.text();
                    showModal(post.title, markdown);
                } catch (error) {
                    console.error('Error fetching and rendering post:', error);
                }
            });
            postsContainer.appendChild(postElement);
        });
    };

    const showModal = (title, content) => {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        const modalClose = document.getElementById('modal-close');

        modalTitle.textContent = title;
        modalContent.textContent = content;
        modal.style.display = 'block';

        modalClose.onclick = () => {
            modal.style.display = 'none';
        }

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    };

    loadPosts();
});