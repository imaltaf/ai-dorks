function searchDorks(event) {
  event.preventDefault();
  var domain = document.getElementById("domain").value;

  if (!domain.trim()) {
    alert("Please provide a domain before searching.");
    return;
  }

  var encodedDomain = encodeURIComponent(domain);

  var dorksFileSelect = document.getElementById("dorksFile");
  var selectedDorksFile = dorksFileSelect.options[dorksFileSelect.selectedIndex].value;

  fetch(selectedDorksFile)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then(dorksText => {
      var dorks = dorksText.split('\n');
      var resultsElement = document.getElementById("results");
      resultsElement.innerHTML = '';

      dorks.forEach(function (dork) {
        if (dork.trim().startsWith("#")) {
          // Treat lines starting with # as h1
          var h1Element = document.createElement('h1');
          h1Element.textContent = dork.replace('#', '').trim();
          resultsElement.appendChild(h1Element);
        } else {
          var searchQuery = dork.replace('example.com', encodedDomain);
          var googleSearchUrl = "https://www.google.com/search?q=" + encodeURIComponent(searchQuery);

          var highlightedQuery = searchQuery.replace(/\(([^)]+)\)/g, "<span class='highlight'>$1</span>");

          var linkElement = document.createElement('a');
          linkElement.href = googleSearchUrl;
          linkElement.innerHTML = highlightedQuery;
          linkElement.target = "_blank";

          resultsElement.appendChild(linkElement);
        }
      });
    })
    .catch(error => {
      console.error("Error loading file:", error);
    });
}

function resetForm() {
  document.getElementById("domain").value = "";
  document.getElementById("dorksFile").selectedIndex = 0;
  document.getElementById("results").innerHTML = "";
}

var searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", searchDorks);

var resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetForm);
