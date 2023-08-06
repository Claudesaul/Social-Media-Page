
    // Sample data for users, posts, and comments (celebrity names as examples)
    const users = [
      { id: 1, name: 'Taylor Swift', email: 'taylor@example.com', password: 'taylor123', following: [], posts: [101, 102] },
      { id: 2, name: 'Dwayne Johnson', email: 'dwayne@example.com', password: 'rock123', following: [], posts: [103] },
      { id: 3, name: 'Beyoncé', email: 'beyonce@example.com', password: 'queenb123', following: [], posts: [104] },
    ];

    const posts = [
      { id: 101, userId: 1, content: 'Loving the music festival!', likes: 0, comments: [] },
      { id: 102, userId: 1, content: 'Had a great time in the studio!', likes: 0, comments: [] },
      { id: 103, userId: 2, content: 'Working hard on set!', likes: 0, comments: [] },
      { id: 104, userId: 3, content: 'Feeling grateful for my fans!', likes: 0, comments: [] },
    ];

    // Helper functions to find users and posts (celebrity names as examples)
    function findUserById(userId) {
      return users.find((user) => user.id === userId);
    }

    function findPostById(postId) {
      return posts.find((post) => post.id === postId);
    }

    function login(email, password) {
      const user = users.find((user) => user.email === email && user.password === password);
      return user ? user.id : null;
    }

    function createPost(userId, content) {
  const postId = Math.max(...posts.map((post) => post.id)) + 1;
  const newPost = { id: postId, userId, content, likes: 0, comments: [] };
  posts.push(newPost);
  findUserById(userId).posts.push(postId);

  // Update localStorage to persist the posts data
  localStorage.setItem('posts', JSON.stringify(posts));
}


    function likePost(userId, postId) {
      const post = findPostById(postId);
      if (post) {
        post.likes++;
      }
    }

    function createComment(userId, postId, content) {
      const post = findPostById(postId);
      if (post) {
        const commentId = Math.max(...post.comments.map((comment) => comment.id)) + 1;
        const newComment = { id: commentId, userId, content };
        post.comments.push(newComment);
      }
    }

    function followUser(loggedInUserId, userIdToFollow) {
      const loggedInUser = findUserById(loggedInUserId);
      const userToFollow = findUserById(userIdToFollow);
      if (loggedInUser && userToFollow) {
        loggedInUser.following.push(userIdToFollow);
      }
    }

    function unfollowUser(loggedInUserId, userIdToUnfollow) {
      const loggedInUser = findUserById(loggedInUserId);
      if (loggedInUser) {
        loggedInUser.following = loggedInUser.following.filter((userId) => userId !== userIdToUnfollow);
      }
    }

    // Function to render the navigation bar
    function renderNavBar(loggedInUserId) {
      const nav = document.querySelector('nav');
      nav.innerHTML = '';
      const links = ['Home', 'Profile', 'Messages', 'News'];
      for (const link of links) {
        const anchor = document.createElement('a');
        anchor.textContent = link;
        anchor.href = '#';
        anchor.addEventListener('click', () => handleNavClick(link, loggedInUserId));
        nav.appendChild(anchor);
      }

      // Render user profile information
      const userProfile = document.getElementById('user-profile');
      const loggedInUser = findUserById(loggedInUserId);
      userProfile.textContent = `Logged in as ${loggedInUser.name}`;

      // Add a post creation form
      const postForm = document.createElement('form');
      postForm.id = 'post-form';
      postForm.innerHTML = `
        <input type="text" id="post-content" placeholder="Write your post...">
        <button type="submit">Post</button>
      `;
      userProfile.appendChild(postForm);
    }

    // Function to handle navigation link clicks
    function handleNavClick(link, loggedInUserId) {
      // Clear the main section
      const main = document.querySelector('main');
      main.innerHTML = '';

      if (link === 'Home') {
        // Render the home content (For simplicity, we'll just show a welcome message)
        const welcomeMessage = document.createElement('p');
        welcomeMessage.textContent = 'Welcome to the Home page!';
        main.appendChild(welcomeMessage);
      } else if (link === 'Profile') {
        // Render the user's profile and posts
        renderUserProfile(loggedInUserId, main);
      } else if (link === 'Messages') {
        // Render the user's messages (For simplicity, we'll just show a message list)
        const messageList = document.createElement('ul');
        for (let i = 1; i <= 5; i++) {
          const messageItem = document.createElement('li');
          messageItem.textContent = `Message ${i}`;
          messageList.appendChild(messageItem);
        }
        main.appendChild(messageList);
      } else if (link === 'News') {
        // Render the latest news (For simplicity, we'll just show a news list)
        const newsList = document.createElement('ul');
        for (let i = 1; i <= 5; i++) {
          const newsItem = document.createElement('li');
          newsItem.textContent = `News ${i}`;
          newsList.appendChild(newsItem);
        }
        main.appendChild(newsList);
      }
    }

    // Function to render the user's profile and posts
    function renderUserProfile(userId, main) {
  const user = findUserById(userId);
  const userProfileDiv = document.createElement('div');
  userProfileDiv.innerHTML = `
    <h2>${user.name}</h2>
    <p>Email: ${user.email}</p>
    <p>Number of Followers: ${user.following.length}</p>
  `;

  // Render the user's posts
  const userPostsDiv = document.createElement('div');
  userPostsDiv.innerHTML = '<h3>Posts</h3>';
  const userPostsList = document.createElement('ul');
  const postTemplate = document.getElementById('post-template').content;

  user.posts.forEach((postId) => {
    const post = findPostById(postId);
    const postInstance = document.importNode(postTemplate, true);
    postInstance.querySelector('.post-content').textContent = post.content;
    postInstance.querySelector('.post-likes span').textContent = post.likes;

    // Like post event listener
    const likeButton = postInstance.querySelector('.like-btn');
    likeButton.addEventListener('click', () => {
      likePost(userId, postId);
      postInstance.querySelector('.post-likes span').textContent = post.likes;
    });

    // Create comment event listener
    const commentForm = postInstance.querySelector('.comment-form');
    commentForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent form submission from reloading the page
      const commentContent = postInstance.querySelector('.comment-content').value;
      createComment(userId, postId, commentContent);
      renderUserProfile(userId, main); // Refresh the profile after creating a comment
    });

    // Render comments
    const commentsDiv = postInstance.querySelector('.comments');
    post.comments.forEach((comment) => {
      const commentP = document.createElement('p');
      commentP.textContent = comment.content;
      commentsDiv.appendChild(commentP);
    });

    // Add the post instance to the user's postsDiv
    userPostsList.appendChild(postInstance);
  });

  userPostsDiv.appendChild(userPostsList);
  userProfileDiv.appendChild(userPostsDiv);
  main.appendChild(userProfileDiv);
}

    // Example usage
    document.addEventListener('DOMContentLoaded', function () {
      const loggedInUserId = login('taylor@example.com', 'taylor123');
      if (loggedInUserId) {
        renderNavBar(loggedInUserId);
        handleNavClick('Home', loggedInUserId);
      }
      
    });