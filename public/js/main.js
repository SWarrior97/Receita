let btn = document.getElementById('addProduct');
let ingredients = document.getElementById('ingredients2');

$('#productShoppingList').find('tr').click( function(){
    var row = $(this).index()+1;
    document.getElementById("row").value = row;
    console.log(document.getElementById("row").value)
});

btn.addEventListener('click', (event) => {
    event.preventDefault()
    var e = document.getElementById("product");
    var product = e.options[e.selectedIndex].text;
    var productID = e.options[e.selectedIndex].value;
    let quantity = document.getElementById('quantity').value;

    var tableRef = document.getElementById('tableProduct').getElementsByTagName('tbody')[0];
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = product;
    var td2 = document.createElement('td');
    td2.innerHTML = quantity;
    tr.appendChild(td);
    tr.appendChild(td2);
    tableRef.appendChild(tr);

    quantity.value = '';
    ingredients.innerHTML = ingredients.innerHTML+productID +"->"+product + "->"+quantity+";";

})
 