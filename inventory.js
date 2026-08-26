let inventory =
    JSON.parse(localStorage.getItem("inventory")) || [];

const form = document.getElementById("inventoryForm");
const table = document.getElementById("inventoryTable");
const productCount = document.getElementById("productCount");
const lowStock = document.getElementById("lowStock");


function saveInventory() {

    localStorage.setItem(
        "inventory",
        JSON.stringify(inventory)
    );

}


function displayInventory() {

    table.innerHTML = "";

    let low = 0;

    inventory.forEach((product, index) => {

        const row = document.createElement("tr");

        let status;

        if (product.quantity <= product.minimum) {

            status = "⚠️ منخفض";
            low++;

        } else {

            status = "✅ جيد";

        }

        row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.quantity}</td>

            <td>${product.unit}</td>

            <td>${product.price} DA</td>

            <td>${status}</td>

            <td>
                <button onclick="deleteProduct(${index})">
                    🗑️
                </button>
            </td>

        `;

        table.appendChild(row);

    });


    productCount.textContent =
        inventory.length;

    lowStock.textContent =
        low;

}


form.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("productName").value.trim();

    const quantity =
        Number(
            document.getElementById("productQuantity").value
        );

    const unit =
        document.getElementById("productUnit").value;

    const price =
        Number(
            document.getElementById("productPrice").value
        );

    const minimum =
        Number(
            document.getElementById("minimumStock").value
        );


    if (!name) {

        alert("أدخل اسم المنتج");

        return;
    }


    const product = {

        id: Date.now(),

        name: name,

        quantity: quantity,

        unit: unit,

        price: price,

        minimum: minimum

    };


    inventory.push(product);


    saveInventory();

    displayInventory();


    form.reset();


    alert(
        "تمت إضافة المنتج بنجاح ✅"
    );

});


function deleteProduct(index) {

    if (
        !confirm(
            "هل تريد حذف هذا المنتج؟"
        )
    ) {

        return;

    }


    inventory.splice(index, 1);

    saveInventory();

    displayInventory();

}


displayInventory();
