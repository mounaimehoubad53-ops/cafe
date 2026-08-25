let sales = JSON.parse(localStorage.getItem("sales")) || [];

const form = document.getElementById("saleForm");
const table = document.getElementById("salesTable");
const totalSales = document.getElementById("totalSales");


function displaySales() {

    table.innerHTML = "";

    let total = 0;

    sales.forEach((sale, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sale.product}</td>
            <td>${sale.quantity}</td>
            <td>${sale.price} DA</td>
            <td>${sale.total} DA</td>

            <td>
                <button onclick="deleteSale(${index})">
                    🗑️
                </button>
            </td>
        `;

        table.appendChild(row);

        total += sale.total;
    });

    totalSales.textContent = total + " DA";
}


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const product =
        document.getElementById("product").value;

    const quantity =
        Number(document.getElementById("quantity").value);

    const price =
        Number(document.getElementById("price").value);

    const total = quantity * price;


    const sale = {

        product: product,

        quantity: quantity,

        price: price,

        total: total
    };


    sales.push(sale);


    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );


    form.reset();

    displaySales();

});


function deleteSale(index) {

    sales.splice(index, 1);

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );

    displaySales();
}


displaySales();
