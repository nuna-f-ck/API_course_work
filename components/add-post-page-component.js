import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <textarea id="description-input" class="input" placeholder="Описание фотографии"></textarea>
          <div class="form-error"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: document.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value;

      setError("");

      if (!imageUrl) {
        setError("Выберите фото");
        return;
      }

      if (!description.trim()) {
        setError("Введите описание");
        return;
      }

      onAddPostClick({
        description,
        imageUrl,
      });
    });
  };

  render();
}