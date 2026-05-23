import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((new Date() - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "только что";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин. назад`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} ч. назад`;
  }

  return `${diffInDays} дн. назад`;
};

const sanitizeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

export function renderPostsPageComponent({
  appEl,
  isUserPostsPage = false,
  onLikeClick,
}) {
  const userInfo = isUserPostsPage && posts.length > 0 ? posts[0].user : null;

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      ${
        userInfo
          ? `
            <div class="posts-user-header">
              <img src="${userInfo.imageUrl}" class="posts-user-header__user-image">
              <p class="posts-user-header__user-name">${sanitizeHtml(userInfo.name)}</p>
            </div>
          `
          : ""
      }
      <ul class="posts">
        ${posts
          .map((post) => {
            return `
              <li class="post">
                <div class="post-header" data-user-id="${post.user.id}">
                  <img src="${post.user.imageUrl}" class="post-header__user-image">
                  <p class="post-header__user-name">${sanitizeHtml(post.user.name)}</p>
                </div>
                <div class="post-image-container">
                  <img class="post-image" src="${post.imageUrl}">
                </div>
                <div class="post-likes">
                  <button data-post-id="${post.id}" class="like-button">
                    <img src="./assets/images/${
                      post.isLiked ? "like-active.svg" : "like-not-active.svg"
                    }">
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${post.likes.length}</strong>
                  </p>
                </div>
                <p class="post-text">
                  <span class="user-name">${sanitizeHtml(post.user.name)}</span>
                  ${sanitizeHtml(post.description)}
                </p>
                <p class="post-date">
                  ${formatDate(post.createdAt)}
                </p>
              </li>
            `;
          })
          .join("")}
      </ul>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (let likeButtonEl of document.querySelectorAll(".like-button")) {
    likeButtonEl.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!user) {
        alert("Чтобы ставить лайки, нужно войти");
        return;
      }

      onLikeClick({
        postId: likeButtonEl.dataset.postId,
      });
    });
  }
}