(function (global) {
    var dc = {};

    var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/{{short_name}}.json";

    // Replace placeholder {{propName}} with actual property value in a string
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        return string.replace(new RegExp(propToReplace, "g"), propValue);
    };

    // Fetch and display menu items for the selected category
    dc.loadMenuItems = function (categoryShortName) {
        // Replace categoryShortName in the menuItemsUrl
        var url = insertProperty(menuItemsUrl, "short_name", categoryShortName);

        // Show loading spinner
        document.querySelector("#menu-items").innerHTML = "<li>Loading...</li>";

        // Fetch menu items for the category
        $ajaxUtils.sendGetRequest(url, function (menuItems) {
            var menuItemsHtml = "";

            // Iterate over menu items and create HTML
            menuItems.forEach(function (menuItem) {
                menuItemsHtml += "<li>" + menuItem.name + " - " + menuItem.price + "</li>";
            });

            // Insert menu items into DOM
            document.querySelector("#menu-items").innerHTML = menuItemsHtml;

            // Update category name in header
            document.querySelector("#category-name").textContent = categoryShortName;
        });
    };

    global.$dc = dc;
})(window);
