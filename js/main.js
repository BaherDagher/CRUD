var productTitleInput = document.getElementById("productTitle");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productImageInput = document.getElementById("productImage");
var imageLabel = document.getElementById("imageLabel");
var productDescriptionInput = document.getElementById("productDescription");
var productSearchInput = document.getElementById("productSearch");
var addProductButton = document.getElementById("addProductButton");
var updateProductButton = document.getElementById("updateProductButton");
var successPopUp = document.getElementById("success");
var updatePopUp = document.getElementById("update");
var deletePopUp = document.getElementById("delete")
var deleteBtnPop = document.getElementById("deleteBtnPop");
var cancelBtnPop = document.getElementById("cancelBtnPop");
var productList = [];
var originalIndices = [];


if (getLocalStorageProducts() != null) {
    productList = getLocalStorageProducts();
    displayProducts(productList);
}

function addProduct() {
    if (validateInput(productTitleInput) && validateInput(productPriceInput) && validateInput(productCategoryInput) && validateInput(productImageInput) && validateInput(productDescriptionInput)) {
        var product = {
            title: productTitleInput.value,
            price: productPriceInput.value,
            category: productCategoryInput.value,
            image: `images/${productImageInput.files[0]?.name}`,
            description: productDescriptionInput.value,
        };
        if (product.description == "") {
            product.description = "No Description";
        }
        productList.push(product);
        setLocalStorageProducts();
        displayProducts(productList);
        clearForm();
        successPopUp.classList.replace("d-none", "d-flex")
    }
}

function displayProducts(displayData) {
    var bBox = ``;
    for (var i = 0; i < displayData.length; i++) {
        bBox += `<div class="col-lg-3 col-md-4 col-sm-6">
        <div class="product  p-3  rounded-3">
            <div class="image d-flex justify-content-center">
                <img src="${displayData[i].image}" alt="" class="img-fluid mb-3 ">
            </div>
            <h3>${displayData[i].newTitle ? displayData[i].newTitle : displayData[i].title}</h3>
            <div class="d-flex justify-content-between">
                <span>${displayData[i].category}</span>
                <span>${displayData[i].price}</span>
            </div>
            <p>${displayData[i].description}</p>
            <div class="buttons d-flex justify-content-between">
            <button class="btn btn-outline-success" onclick="editProduct(${i})">Edit</button>
            <button class="btn btn-outline-danger" onclick="deleteProduct(${i})">Delete</button>
        </div>
        </div>
    </div> `
    }

    document.getElementById("productsRow").innerHTML = bBox;
}

function clearForm() {
    productTitleInput.value = '';
    productPriceInput.value = '';
    productCategoryInput.value = '';
    productImageInput.value = '';
    productDescriptionInput.value = '';
    imageLabel.textContent = "Product Image";
    productSearchInput.nextElementSibling.classList.replace("d-flex", "d-none")
}

function editProduct(editedIndex) {

    // If edit in search 
    if (originalIndices[editedIndex] != undefined) {

        var originalIndex = originalIndices[editedIndex];
    }
    // if edit in public list
    else {
        var originalIndex = editedIndex;
    }
    // to Store Card Index 
    updateProductButton.setAttribute('index', originalIndex);

    productTitleInput.value = productList[originalIndex].title;
    productPriceInput.value = productList[originalIndex].price;
    productCategoryInput.value = productList[originalIndex].category;
    imageLabel.textContent = productList[originalIndex].image.split('/').pop();

    // When there is no description show empty input .. else show description
    if (productList[originalIndex].description == "No Description") {
        productDescriptionInput.value = "";
    }
    else {
        productDescriptionInput.value = productList[originalIndex].description;
    }

    addProductButton.classList.add('d-none');
    updateProductButton.classList.remove('d-none');
    productTitleInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


function deleteProduct(deletedIndex) {
    // If delete in search 
    if (originalIndices[deletedIndex] != undefined) {
          var originalIndex = originalIndices[deletedIndex];
    }
    // if delete in public list
    else {
         var originalIndex = deletedIndex;
    }
    deletePopUp.classList.replace("d-none", "d-flex");
    deleteBtnPop.setAttribute("index",originalIndex);
}


function updateProduct() {
    // To Get Card Index
    var targetIndex = updateProductButton.getAttribute('index');

    if (validateInput(productTitleInput) && validateInput(productPriceInput) && validateInput(productCategoryInput) && validateInput(productDescriptionInput)) {

        productList[targetIndex].title = productTitleInput.value;
        productList[targetIndex].price = productPriceInput.value;
        productList[targetIndex].category = productCategoryInput.value;

        if (productDescriptionInput.value == "") {
            productList[targetIndex].description = "No Description";
        }
        else {
            productList[targetIndex].description = productDescriptionInput.value;
        }


        if (productImageInput.files.length > 0) {
            // Check if a new file has been selected
            productList[targetIndex].image = `images/${productImageInput.files[0]?.name}`;  // Update with the new file name
        } else {
            // Retain the existing image name if no new file is selected
            productList[targetIndex].image = productList[targetIndex].image;
        }

        displayProducts(productList);
        clearForm();
        addProductButton.classList.remove('d-none');
        updateProductButton.classList.add('d-none');
        setLocalStorageProducts();
        updatePopUp.classList.replace("d-none", "d-flex")

    }
}

function searchProduct() {

    if (productList[0] == undefined) {
        // if trying to search and empty productlist show no product added error and hide no products found error
        productSearchInput.nextElementSibling.nextElementSibling.classList.replace("d-flex", "d-none")
        productSearchInput.nextElementSibling.classList.replace("d-none", "d-flex")
        productSearchInput.classList.add("is-invalid");
    }
    else {
        productSearchInput.nextElementSibling.classList.replace("d-flex", "d-none")
        productSearchInput.classList.remove("is-invalid");
    }

    var matchedProduct = [];
    originalIndices = [];
    // Trim to avoid space in search
    var keyword = productSearchInput.value.trim();

    if (keyword == "") {
        // If the search keyword is empty , display all products
        displayProducts(productList);
        productSearchInput.nextElementSibling.nextElementSibling.classList.replace("d-flex", "d-none")
        // if productlist is empty and search is empty hide all errors
        if (productList[0] == undefined) {
            productSearchInput.nextElementSibling.classList.replace("d-flex", "d-none")
            productSearchInput.classList.remove("is-invalid");
        }

    }
    else {
        var keywordRegex = new RegExp(keyword, 'ig');
        for (var i = 0; i < productList.length; i++) {
            if (productList[i].title.toLowerCase().includes(keyword.toLowerCase())) {
                // Making a Deep Copy to original List to avoid changing in original List
                var matchedItem = JSON.parse(JSON.stringify(productList[i]));
                // var matchedItem = structuredClone(productList[i]);
                // matchedItem.newTitle = matchedItem.title.toLowerCase().replace(keyword.toLowerCase(), `<span class='text-danger'>${keyword}</span>`);
                matchedItem.newTitle = matchedItem.title.replace(keywordRegex, function (match) {
                    return `<span class='text-danger'>${match}</span>`;
                });
                matchedProduct.push(matchedItem);
                originalIndices.push(i);
            }
        }
        displayProducts(matchedProduct);
        if (matchedProduct[0] == undefined && productList[0] != undefined) {
            productSearchInput.nextElementSibling.nextElementSibling.classList.replace("d-none", "d-flex")
            productSearchInput.classList.add("is-invalid");

        }

        else {
            productSearchInput.nextElementSibling.nextElementSibling.classList.replace("d-flex", "d-none")
        }
    }
}

function setLocalStorageProducts() {
    localStorage.setItem("ProductList", JSON.stringify(productList));
}

function getLocalStorageProducts() {
    return JSON.parse(localStorage.getItem("ProductList"))
}

function validateInput(Input) {
    var RegexList = {
        productTitle: /^[a-z].{1}/i,
        productPrice: /^([6-9][0-9]{3}|10000|[1-5][0-9]{4}|60000)$/,
        productCategory: /^(Mobile|TV|Screens|Laptops|Watch)$/,
        productDescription: /^.{0,250}$/
    }

    if (Input == productTitleInput) {
        var Regex = RegexList.productTitle;
    }
    else if (Input == productPriceInput) {
        var Regex = RegexList.productPrice;
    }
    else if (Input == productCategoryInput) {
        var Regex = RegexList.productCategory;
    }
    else if (Input == productDescriptionInput) {
        var Regex = RegexList.productDescription;
    }

    if (Input != productImageInput) {
        var isValid = Regex.test(Input.value);
    }
    // when Validating Image
    else {
        var productImage = Input.files;
        if (productImage.length == 0) {
            var isValid = false;
        }
        else {
            var isValid = true;
        }
    }
    if (isValid) {
        Input.classList.replace("is-invalid", "is-valid");
        Input.nextElementSibling.classList.replace("d-flex", "d-none");

    }
    else {
        Input.classList.add("is-invalid");
        Input.nextElementSibling.classList.replace("d-none", "d-flex");

    }

    return isValid;
}

productTitleInput.addEventListener("input", function () {
    validateInput(productTitleInput);
})
productPriceInput.addEventListener("input", function () {
    validateInput(productPriceInput);
})
productCategoryInput.addEventListener("input", function () {
    validateInput(productCategoryInput);
})
productDescriptionInput.addEventListener("input", function () {
    validateInput(productDescriptionInput);
})

productImageInput.addEventListener("change", function () {
    validateInput(productImageInput);
})



function closePopUp() {
    successPopUp.classList.replace("d-flex", "d-none")
    updatePopUp.classList.replace("d-flex", "d-none")
}

function confirmDelete() {
 var originalIndex= deleteBtnPop.getAttribute("index");
    // Delete the product
    productList.splice(originalIndex, 1);
    displayProducts(productList);
    setLocalStorageProducts();
    // Hide the confirmation dialog
    deletePopUp.classList.replace("d-flex", "d-none")
}
function cancelDelete() {
    // Hide the confirmation dialog
    deletePopUp.classList.replace("d-flex", "d-none")
}