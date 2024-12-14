function fetchData(url) {
  // Define values for attempts and timeout
  const maxAttempts = 3;
  const timeout = 60000; // 60 seconds
  let attempts = 0;

  return new Promise((resolve, reject) => {
      function makeRequest() {
          // Increment the attempt counter
          attempts++;
          const controller = new AbortController(); 
          const signal = controller.signal; 
          const timeoutId = setTimeout(() => { controller.abort(); }, timeout);

          // HTTP request with timeout handling
          fetch(url, { signal })
              .then((response) => { 
                  clearTimeout(timeoutId); 
                  if (!response.ok) { 
                      throw new Error(`HTTP error! status: ${response.status}`); 
                  } 
                  return response.json(); 
              })
              .then((data) => resolve(data))
              .catch((error) => { 
                  clearTimeout(timeoutId); 
                  // If the number of attempts is less than the limit, retry after a delay
                  if (attempts < maxAttempts) { 
                      console.log(`Attempt ${attempts} failed. Retrying...`);
                      setTimeout(makeRequest, 1000);
                  } else { 
                      // If all attempts fail, reject the promise
                      reject(new Error(`Failed to fetch data after ${maxAttempts} attempts.`));                    
                  }
              });
      }

      // Initiate the request
      makeRequest();
  });
}

// Function to handle the creation of a single card
function createCard() {
  const card = document.createElement("div");
  card.className = "card";
  card.style.display = "block";

  // Create the card header and footer
  const head = document.createElement("div");
  head.className = "head";
  head.innerHTML = "-";
  head.style.display = "block";

  const footer = document.createElement("div");
  footer.className = "tail";
  footer.innerHTML = "-";
  footer.style.display = "none";

  // Add the header and footer to the card
  card.appendChild(head);
  card.appendChild(footer);

  return card;
}

// Event handler to toggle the card display
function toggleCard(card) {
  // Toggle the "flip" class for animation
  card.classList.toggle("flip");

  // Toggle the display of the header and footer
  const head = card.querySelector(".head");
  const footer = card.querySelector(".tail");

  if (footer.style.display === "none") {
      footer.style.display = "block";
      head.style.display = "none";
  } else {
      footer.style.display = "none";
      head.style.display = "block";
  }
}

function setData(){
  var fi = "-";
  var en = "-";
  fetchData("https://sanakirja.pythonanywhere.com/api/nrand/5")
    .then((data) => {
      for (i = 0; i < 5; i++) {
        fi = data[i]["expression"];
        en = data[i]["description"];
        head[i].innerHTML = fi;
        tail[i].innerHTML = en;
        console.log(data["vi"] + ": " + data["en"]);
      }
    })
    .catch((error) => console.error(error));
}

window.onload = function () {
  // Create a container for the cards
  const cardList = document.getElementsByClassName("card-list")[0];

  // Fetch data from the API
  fetchData("https://sanakirja.pythonanywhere.com/api/nrand/5")
      .then((data) => {
          // Create cards for each data item
          for (let i = 0; i < data.length; i++) {
              const card = createCard();
              cardList.appendChild(card);

              const head = card.querySelector(".head");
              const footer = card.querySelector(".tail");

              // Fill the card with the fetched data
              head.innerHTML = data[i]["vi"];
              footer.innerHTML = data[i]["en"];
          }

          // Add a click event handler for each card
          const cards = cardList.querySelectorAll(".card");
          cards.forEach((card) => {
              card.addEventListener("click", () => {
                  toggleCard(card);
              });
          });
      })
      .catch((error) => console.error("Error fetching data:", error));
};
