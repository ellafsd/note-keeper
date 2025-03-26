// ! Month array
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
let popupTitle = document.querySelector("header p");
let submitBtn = document.querySelector("#submit-btn");
const titleInput = document.querySelector("#title-input");
const descriptionInput = document.querySelector("#description-input");
const titleError = document.querySelector("#title-error");
const descriptionError = document.querySelector("#description-error");

// ! Get note data from localStorage. If there is note, assign it initial value as an empty array
let notes = JSON.parse(localStorage.getItem("notes")) || [];

//Variables that are needed for updates
let isUpdate = false;
let updateId = null;


// Listen for when the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Run the function that renders notes when the page is loaded
  renderNotes(notes);
});

// Open popup when addBox(+ symbol) clicked
addBox.addEventListener("click", () => {
  //popupBoxContainer- box that will open after clicking +, popup is the content with title and description. For that add show class
  popupBoxContainer.classList.add("show");
  popup.classList.add("show");

  //prevent Body to scroll (disables scrolling-used when popup is open)
  document.querySelector("body").style.overflow = "hidden";
});

//close popup when clicking closeBtn (X symbol)
closeBtn.addEventListener("click", () => {
  //popupBoxContainer & popup ekrandan gizle. Bunun icin show class cikart
  popupBoxContainer.classList.remove("show");
  popup.classList.remove("show");

  //allows the Body to scroll again (enables scrolling again-used when popup is closed)
  document.querySelector("body").style.overflow = "auto";

    // If user click edit but will close it without editing, and then click + icon to add note it says update note instead of add note. To revent that:
    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";

    titleInput.value="";
    descriptionInput.value="";
  
    // Formu resetle
    form.reset();
  
});

//Send Form
form.addEventListener("submit", (e) => {
  //prevents the page from reload
  e.preventDefault();

  //e.target=form, e.target[0]= title, e.target[1]= description
  const titleInput = e.target[0];
  const descriptionInput = e.target[1];

  //If there is any space beginning or end of the title or description, remove it
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  let hasError = false;

  // Reset error messages
  titleError.textContent = "";
  descriptionError.textContent = "";

  if (!title) {
    titleError.textContent = "Please enter the title.";
    hasError = true;
  }

  if (!description) {
    descriptionError.textContent = "Please enter the description.";
    hasError = true;
  }

  if (hasError) return;

  const date = new Date();
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const id = date.getTime();


  if (isUpdate) {
     const findIndex = notes.findIndex((note) => note.id==updateId);
     notes[findIndex] = {
       title,
       description,
       id,
       date: `${month} ${day}, ${year}`, 
     };
     isUpdate = false;
     updateId = null;
     popupTitle.textContent = "New Note";
     submitBtn.textContent = "Add Note";
  } 
  else {
      //Create an object for note data
    let noteInfo={
      id,
      title,
      description,
      date:`${month} ${day}, ${year}`,

  };

  // Add noteInfo to note array
  notes.push(noteInfo);
}

  //Add Note array to localStorage
  localStorage.setItem("notes", JSON.stringify(notes));

  //Clear data of input element and textarea element
  titleInput.value = "";
  descriptionInput.value = "";

  //Close popup
  popupBoxContainer.classList.remove("show");
  popup.classList.remove("show");

  // Set body's scroll behavior back to auto
  document.querySelector("body").style.overflow = "auto";

  //Render Notes
  renderNotes(notes);
});

// Function to render notes
function renderNotes(notes) {
  document.querySelectorAll(".note").forEach((li) => li.remove());
  //Return each element in note array
  notes.forEach((note) => {
    //Create a note card for each element in the notes array
    //To distinguish each note element, assign it an ID using a data attribute
    let noteElement = `<li class="note" data-id='${note.id}'>
        <!-- Note Details -->
        <div class="details">
          <!-- Title && Description -->
          <p class="title">${note.title}</p>
          <p class="description">${note.description}</p>
        </div>
        <!-- Bottom -->
        <div class="bottom">
          <span>${note.date}</span>
          <div class="settings">
            <!-- Icon -->
            <i class="bx bx-dots-horizontal-rounded"></i>
            <!-- Menu -->
            <ul class="menu">
              <li class='editIcon'><i class="bx bx-edit"></i> Edit</li>
              <li class='deleteIcon'><i class="bx bx-trash-alt"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>`;

    // The insertAdjacentHTML method inserts HTML code into a specified position. It requires a position and the HTML string to insert.
    addBox.insertAdjacentHTML("afterend", noteElement);
  });
}

// When the three-dot icon (⋯) is clicked, it shows the associated menu (Edit / Delete). If the user then clicks anywhere else on the page, the menu automatically hides again. '⋯' is called as element here
// Function that controls the visibility of the note's menu (three dots)
function showMenu(element) {
  // parentElement is used to access the container of an element (in this case, the settings wrapper)

  // Add the "show" class to the parent element of the clicked icon (three dots menu)
  element.parentElement.classList.add("show");

  // If the user clicks anywhere outside the three dots, remove the "show" class to hide the menu
  document.addEventListener("click", (e) => {
    // If the clicked element is NOT an <i> tag (icon) OR it’s not the same as the one originally clicked
    if (e.target.tagName != "I" || e.target != element) {
      // Then remove the "show" class from the parent container
      element.parentElement.classList.remove("show");
    }
  });
}


let noteToDelete = null;

wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteIcon")) {
    noteToDelete = e.target.closest(".note");
    document.getElementById("deleteModal").style.display = "flex";
  }
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("deleteModal").style.display = "none";
  noteToDelete = null;
});

document.getElementById("confirmBtn").addEventListener("click", () => {
  const notedId = parseInt(noteToDelete.dataset.id);
  notes = notes.filter((note) => note.id != notedId);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes(notes);
  document.getElementById("deleteModal").style.display = "none";
});



// * Listen for clicks inside the wrapper section

wrapper.addEventListener("click", (e) => {
  // If the three-dots icon is clicked
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    // Run the Show Menu function
    showMenu(e.target);
  }

  // If the edit button is clicked
  else if (e.target.classList.contains("editIcon")) {
    // Access the note element that wraps the clicked edit icon
    const note = e.target.closest(".note");

    // Access the id of the note
    const noteId = parseInt(note.dataset.id);

    // Find the note in the notes array using its id
    const foundedNote = notes.find((note) => note.id == noteId);

    // Set the popup to update mode
    isUpdate = true;
    updateId = noteId;

    // Make the popup visible
    popupBoxContainer.classList.add("show");
    popup.classList.add("show");

    // Fill the popup's input and textarea with the note's title and description
    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    // Update the popup title and button content to match update mode
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});
