class DynamicTags {
  constructor() {
    this.container = document.getElementById("tagsContainer")
    this.addButton = document.getElementById("addButton")
    
    this.addTagModal = document.getElementById('addTagModal');
    this.newTagInput = document.getElementById('newTagInput');
    this.confirmAddTagButton = document.getElementById('confirmAddTag');
    
    this.userId = this.getUserId(); 
    this.localStorageKey = `userTags_${this.userId}`; 

    this.init()
  }

  getUserId() {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
          try {
              const userData = JSON.parse(userDataString);
              return userData.id; 
          } catch (e) {
              console.error("Erro ao parsear userData do localStorage:", e);
          }
      }
      return 'guest'; 
  }

  init() {
    this.addButton.addEventListener("click", () => this.addTag());

    this.container.querySelectorAll(".tag").forEach(tag => tag.remove());
    this.loadUserTags();

    this.confirmAddTagButton.addEventListener('click', () => this.processNewTag());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.addTagModal.classList.contains('hidden')) {
            this.hideAddTagModal();
        }
    });
  }

  loadUserTags() {
      const savedTags = localStorage.getItem(this.localStorageKey);
      if (savedTags) {
          try {
              const tagsArray = JSON.parse(savedTags);
              tagsArray.forEach(tagText => this.createTag(tagText, false)); 
          } catch (e) {
              console.error("Erro ao parsear tags salvas do localStorage:", e);
              localStorage.removeItem(this.localStorageKey); 
          }
      }
  }

  saveUserTags() {
      const currentTags = Array.from(this.container.querySelectorAll(".tag")).map(tag => tag.textContent.trim());
      localStorage.setItem(this.localStorageKey, JSON.stringify(currentTags));
  }

  addTag() {
    const existingTags = Array.from(this.container.querySelectorAll(".tag"));
    if (existingTags.length >= 10) {
      alert("Você atingiu o limite máximo de 10 tags.");
      return;
    }

    this.showAddTagModal();
  }

  showAddTagModal() {
      this.addTagModal.classList.remove('hidden');
      this.newTagInput.value = ''; 
      this.newTagInput.focus(); 
  }

  hideAddTagModal() {
      this.addTagModal.classList.add('hidden');
  }

  processNewTag() {
      const newTagText = this.newTagInput.value.trim();
      this.hideAddTagModal(); 

      if (newTagText !== "") {
        const existingTags = Array.from(this.container.querySelectorAll(".tag")).map(tag => tag.textContent.trim().toLowerCase());
        if (existingTags.includes(newTagText.toLowerCase())) {
          alert("Essa tag já existe!");
          return;
        }
        this.createTag(newTagText);
      }
  }

  createTag(text, shouldSave = true) {
    const tag = document.createElement("div")
    tag.className = "tag fade-in"
    tag.textContent = text

    this.container.insertBefore(tag, this.addButton)

    this.addTagListeners(tag)

    if (shouldSave) {
        this.saveUserTags();
    }

    setTimeout(() => {
      tag.classList.remove("fade-in")
    }, 300)
  }

  addTagListeners(tag) {
    tag.addEventListener("click", (e) => {
      e.stopPropagation()
      this.removeTag(tag)
    })
  }

  removeTag(tag) {
    tag.style.animation = "fadeIn 0.2s ease-out reverse"

    setTimeout(() => {
      tag.remove();
      this.saveUserTags(); 
    }, 200)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DynamicTags()
})

const observer = new MutationObserver(() => {
  const tags = document.querySelectorAll(".tag")
  
})

observer.observe(document.getElementById("tagsContainer"), {
  childList: true,
  subtree: true,
}) 