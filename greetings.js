(function (global) {
    var dc = {};
  
    var homeHtmlUrl = "snippets/home-snippet.html";
    var allCategoriesUrl = 
      "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json"; 
    var menuItemsUrl = 
      "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/{{short_name}}.json"; 
  
    // Helper function to insert HTML into the DOM
    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };
  
    // Show a loading spinner in the given selector
    var showLoading = function (selector) {
        var html = "<div class='text-center'><img src='images/ajax-loader.gif' alt='Loading...'></div>";
        insertHtml(selector, html);
    };
  
    // Replace placeholder {{propName}} with actual property value in a string
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };
  
    // STEP 0: On page load
    document.addEventListener("DOMContentLoaded", function () {
        showLoading("#main-content");
  
        // STEP 1: Request all categories
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            function (categories) {
                // Error Handling
                if (!categories || categories.length === 0) {
                    console.error("Error: Categories data is null or empty.");
                    return;
                }
  
                // STEP 2: Choose a random category
                var randomCategory = chooseRandomCategory(categories);
                var randomCategoryShortName = randomCategory.short_name;
  
                // STEP 3: Request home-snippet.html
                $ajaxUtils.sendGetRequest(
                    homeHtmlUrl,
                    function (homeHtml) {
                        // STEP 4: Replace {{randomCategoryShortName}} and insert into DOM
                        var homeHtmlToInsertIntoMainPage = 
                            insertProperty(homeHtml, "randomCategoryShortName", randomCategoryShortName);
                        insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

                        // Update the "Specials" tile dynamically
                        var specialsTile = document.querySelector('#tiles a:first-child');
                        specialsTile.setAttribute("onclick", "$dc.loadMenuItems('" + randomCategoryShortName + "');");
                    },
                    false); // Don't process JSON
            },
            true); // Process JSON
    });
  
    // STEP 2 Helper: Random category picker
    function chooseRandomCategory(categories) {
        var randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    }
  
    // Export to global scope
    global.$dc = dc;
})(window);
