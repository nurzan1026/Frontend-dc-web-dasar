const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(title, author, year, isComplete) {
  return {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function findBookByTitle(title) {
  return books.filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
}

function isBookExist(title) {
  return books.some((book) => book.title.toLowerCase() === title.toLowerCase());
}

function isStorageExist() {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    books.push(...data);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
  console.log("Data berhasil disimpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  books.forEach((bookItem) => {
    const bookElement = createBookElement(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.appendChild(bookElement);
    } else {
      completeBookshelfList.appendChild(bookElement);
    }
  });
});

function createBookElement(bookObject) {
  const titleElement = document.createElement("h3");
  titleElement.innerText = bookObject.title;

  const authorElement = document.createElement("p");
  authorElement.innerText = `Penulis: ${bookObject.author}`;

  const yearElement = document.createElement("p");
  yearElement.innerText = `Tahun: ${bookObject.year}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `book-${bookObject.id}`);
  container.appendChild(titleElement);
  container.appendChild(authorElement);
  container.appendChild(yearElement);
  container.appendChild(actionContainer);

  const actionButton = document.createElement("button");
  actionButton.classList.add("green");
  actionButton.innerText = bookObject.isComplete
    ? "Belum selesai di Baca"
    : "Selesai dibaca";
  actionButton.addEventListener("click", function () {
    toggleBookCompletion(bookObject.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "Hapus buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(bookObject.id);
  });

  actionContainer.appendChild(actionButton);
  actionContainer.appendChild(deleteButton);

  return container;
}

function addBook() {
  const titleInput = document.getElementById("inputBookTitle");
  const authorInput = document.getElementById("inputBookAuthor");
  const yearInput = document.getElementById("inputBookYear");
  const isCompleteCheckbox = document.getElementById("inputBookIsComplete");

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const year = parseInt(yearInput.value.trim());
  const isComplete = isCompleteCheckbox.checked;

  if (!title || !author || !yearInput.value.trim()) {
    alert("Judul, penulis, dan tahun harus diisi!");
    return;
  }

  if (isBookExist(title)) {
    alert("Buku dengan judul tersebut sudah ada!");
    return;
  }

  const newBook = generateBookObject(title, author, year, isComplete);
  books.push(newBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  // Reset form input
  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  isCompleteCheckbox.checked = false;
}

function toggleBookCompletion(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;

  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;

  books.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchInput = document.getElementById("searchBookTitle").value.trim();
    searchBooks(searchInput);
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function searchBooks(keyword) {
  if (!keyword) {
    alert("Masukkan kata kunci pencarian!");
    return;
  }

  const searchResult = findBookByTitle(keyword);
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  searchResult.forEach((bookItem) => {
    const bookElement = createBookElement(bookItem);
    if (!bookItem.isComplete) {
      incompleteBookshelfList.appendChild(bookElement);
    } else {
      completeBookshelfList.appendChild(bookElement);
    }
  });
}
