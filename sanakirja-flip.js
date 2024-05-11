function fetchData(url) {
  const maxAttempts = 3;
  const timeout = 60000; // 60 seconds
  let attempts = 0;

  return new Promise((resolve, reject) => {
    function makeRequest() {
      attempts++;
      fetch(url, { timeout })
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((error) => {
          if (attempts < maxAttempts) {
            console.log(attempts);
            setTimeout(makeRequest, 1000); // wait for 1 second before retrying
          } else {
            reject(error);
          }
        });
    }
    makeRequest();
  });
}

window.onload = function () {
  // Create kard list
  var kard_list = document.getElementsByClassName("kard-list")[0];
  for (i = 0; i < 5; i++) {
    var kard = document.createElement("kard");
    kard.id = "kard";
    kard.className = "kard";
    kard.style.display = "block";
    kard_list.appendChild(kard);

    var head = document.createElement("head");
    head.id = "head";
    head.className = "head";
    head.innerHTML = "-";
    head.style.display = "block";
    kard.appendChild(head);
    var tail = document.createElement("tail");
    tail.id = "tail";
    tail.className = "tail";
    tail.innerHTML = "-";
    tail.style.display = "none";
    kard.appendChild(tail);
  }

  // Retrieve kard, head, and tail elements
  var kard = document.getElementsByClassName("kard");
  var head = document.getElementsByClassName("head");
  var tail = document.getElementsByClassName("tail");

  // Retrieve data from API
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

  // Set click actions
  for (i = 0; i < 5; i++) {
    kard[i].onclick = function () {
      this.classList.toggle("flip");
      if (this.children[1].style.display === "none") {
        this.children[1].style.display = "block";
        this.children[0].style.display = "none";
      } else {
        this.children[1].style.display = "none";
        this.children[0].style.display = "block";
      }
    };
  }
};
