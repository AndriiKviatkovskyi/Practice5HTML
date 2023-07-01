function setMinimumWindowWidth(minWidth) {
    function checkAndResizeWindow() {
        if (window.innerWidth < minWidth) {
            window.resizeTo(minWidth, window.innerHeight);
        }
    }


    window.addEventListener("load", checkAndResizeWindow);

    window.addEventListener("resize", checkAndResizeWindow);
}

setMinimumWindowWidth(800);

function saveToLocalStorage() {
    const orderList = document.getElementById("order_section");
    const orderString = JSON.stringify(orderList.innerHTML);
    localStorage.setItem("savedList", orderString);
}

function restoreFromLocalStorage() {
    const savedString = localStorage.getItem("savedList");
    if (savedString) {
        let orderList = document.createElement("section");
        orderList.innerHTML = JSON.parse(savedString);
        let section = document.getElementById("order_section");
        let parent = section.parentNode;
        parent.replaceChild(orderList, section);
        orderList.id = "order_section";
    }
}

window.addEventListener('beforeunload', saveToLocalStorage);
document.addEventListener('DOMContentLoaded', restoreFromLocalStorage);
document.addEventListener('DOMContentLoaded', jsonPizza);

function jsonPizza(){
    let pizzaString = JSON.stringify(pizza_info);
    const blob = new Blob([pizzaString], { type: 'application/json' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'pizzas.json';
    downloadLink.click();
}
function addPizza(button){
    let pizza = button.closest(".thumbnail");
    let sizeDiv = button.closest("div");
    let orderSum = document.getElementById("order-sum");
    let sumNumber = orderSum.getElementsByTagName("h3");
    let size="";
    if(sizeDiv.classList.item(0) === "small-size-div" || sizeDiv.classList.item(0) === "small-size-div-full"){
        size= "small";
    }
    if(sizeDiv.classList.item(0) === "large-size-div" || sizeDiv.classList.item(0) === "large-size-div-full"){
        size= "large";
    }
    let id = pizza.id+size;
    let order_box = document.getElementById("order-main");
    let orders = order_box.getElementsByClassName("pizza-order");
    let present=false;
    for(let i = 0; i<orders.length; i++){
        if(orders[i].id === id){
            present = true;
        }
    }
    if(present){
        let order = document.getElementById(id);
        let quantityClass1 = order.getElementsByClassName("pizza-order-counter");
        let quantityClass2 = quantityClass1[0].getElementsByClassName("pizza-order-counter-center");
        let quantityClass3 = quantityClass2[0].getElementsByClassName("pizza-order-quantity");
        let quantity = parseInt(quantityClass3[0].innerHTML);
        quantity += 1;
        quantityClass3[0].innerHTML = quantity.toString();
        let price = 0;
        for(let i=0; i<pizza_info.length; i++){
            if(pizza_info[i].id.toString() === pizza.id && size == "small"){
                price = pizza_info[i].small_size.price;
            }
            if(pizza_info[i].id.toString() === pizza.id && size == "large"){
                price = pizza_info[i].big_size.price;
            }
        }
        let sum = parseInt(sumNumber[0].innerHTML);
        sum += price;
        sumNumber[0].innerHTML = sum+"грн.";
        let priceDiv = quantityClass1[0].getElementsByClassName("pizza-order-price");
        priceDiv[0].innerHTML = (price*quantity) + " грн.";
    }
    else{
        let newOrder = document.createElement("div");
        newOrder.classList.add("pizza-order");
        newOrder.id = id;
        let newMainDiv = document.createElement("div");
        newMainDiv.classList.add("pizza-order-main");
        let newImageDiv = document.createElement("div");
        newImageDiv.classList.add("pizza-order-img");
        let newOrderName = document.createElement("h4");
        newOrderName.classList.add("pizza-order-name");
        let sizeWord = "";
        if(size === "small"){
            sizeWord = "(Мала)";
        } else{
            sizeWord = "(Велика)"
        }
        let item = pizza_info.find(item => item.id.toString() === pizza.id);
        newOrderName.innerHTML = item.title+" "+sizeWord;
        let newPizzaInfo = document.createElement("div");
        newPizzaInfo.classList.add("pizza-order-information");
        let newRadius = document.createElement("h4");
        let newWeight = document.createElement("h4");
        let newPrice = document.createElement("h4");
        newPrice.classList.add("pizza-order-price");
        if(size === "small"){
            newRadius.innerHTML = "Ø30";
            newWeight.innerHTML = item.small_size.weight+"g"
            newPrice.innerHTML = item.small_size.price+" грн."
            let sum = parseInt(sumNumber[0].innerHTML);
            sum += item.small_size.price;
            sumNumber[0].innerHTML = sum+"грн.";
        } else{
            newRadius.innerHTML = "Ø40";
            newWeight.innerHTML = item.big_size.weight+"g"
            newPrice.innerHTML = item.big_size.price+" грн."
            let sum = parseInt(sumNumber[0].innerHTML);
            sum += item.big_size.price;
            sumNumber[0].innerHTML = sum+"грн.";
        }
        let newPizzaCounter =  document.createElement("div");
        newPizzaCounter.classList.add("pizza-order-counter");
        let newPizzaCounterCenter =  document.createElement("div");
        newPizzaCounterCenter.classList.add("pizza-order-counter-center");
        let newMinus = document.createElement("button");
        newMinus.classList.add("minus");
        newMinus.innerHTML = "-"
        newMinus.addEventListener('click', function(){minus(this)});
        let newCounter = document.createElement("span");
        newCounter.classList.add("pizza-order-quantity");
        newCounter.innerHTML = "1";
        let newPlus = document.createElement("button");
        newPlus.classList.add("plus");
        newPlus.innerHTML = "+";
        newPlus.addEventListener('click', function(){plus(this)});
        let newCancelDiv = document.createElement("div");
        newCancelDiv.classList.add("pizza-order-cancel-div");
        let newCancel = document.createElement("button");
        newCancel.classList.add("pizza-order-cancel");
        newCancel.innerHTML = "х";
        newCancel.addEventListener('click', function(){removeOrder(this)});
        let newImage = document.createElement("img");
        newImage.src = item.icon;
        newCancelDiv.appendChild(newCancel);
        newPizzaCounterCenter.appendChild(newMinus);
        newPizzaCounterCenter.appendChild(newCounter);
        newPizzaCounterCenter.appendChild(newPlus);
        newPizzaCounter.appendChild(newPrice);
        newPizzaCounter.appendChild(newPizzaCounterCenter);
        newPizzaCounter.appendChild(newCancelDiv);
        newPizzaInfo.appendChild(newRadius);
        newPizzaInfo.appendChild(newWeight);
        newMainDiv.appendChild(newPizzaInfo);
        newMainDiv.appendChild(newOrderName);
        newMainDiv.appendChild(newPizzaInfo);
        newMainDiv.appendChild(newPizzaCounter);
        newImageDiv.appendChild(newImage);
        newOrder.appendChild(newMainDiv);
        newOrder.appendChild(newImageDiv);
        order_box.appendChild(newOrder);

        let orderCountTotal = document.getElementById("order-count");
        let orderCountTotalNum = parseInt(orderCountTotal.innerHTML);
        orderCountTotalNum+=1;
        orderCountTotal.innerHTML=orderCountTotalNum;
    }
}

function minus(button){
    let nearestCenter = button.closest("div");
    let nearestCounter = nearestCenter.closest(".pizza-order-counter");
    let order = button.closest(".pizza-order");
    let id = parseInt(order.id);
    let item = pizza_info.find(item => item.id === id);
    let priceNumber = nearestCounter.getElementsByClassName("pizza-order-price");
    let quantitySpan = nearestCenter.getElementsByTagName("span");
    let quantity = parseInt(quantitySpan[0].innerHTML);
    let orderSum = document.getElementById("order-sum");
    let sumNumber = orderSum.getElementsByTagName("h3");
    let sum = parseInt(sumNumber[0].innerHTML);
    if(quantity === 1){
        if(order.id.includes("small")){
            sum-=item.small_size.price;
        } else{
            sum-=item.big_size.price;
        }
        sumNumber[0].innerHTML = sum+"грн.";
        order.remove();
        let orderCountTotal = document.getElementById("order-count");
        let orderCountTotalNum = parseInt(orderCountTotal.innerHTML);
        orderCountTotalNum-=1;
        orderCountTotal.innerHTML=orderCountTotalNum;
    } else{
        quantity -= 1;
        quantitySpan[0].innerHTML = quantity;
        let price = parseInt(priceNumber[0].innerHTML);
        if(order.id.includes("small")){
            sum-=item.small_size.price;
            price-=item.small_size.price;
        } else{
            sum-=item.big_size.price;
            price-=item.big_size.price;
        }
        priceNumber[0].innerHTML = price+ "грн."
        sumNumber[0].innerHTML = sum+"грн.";
    }
}

function plus(button){
    let nearestCenter = button.closest("div");
    let nearestCounter = nearestCenter.closest(".pizza-order-counter");
    let order = button.closest(".pizza-order");
    let id = parseInt(order.id);
    let item = pizza_info.find(item => item.id === id);
    let priceNumber = nearestCounter.getElementsByClassName("pizza-order-price");
    let quantitySpan = nearestCenter.getElementsByTagName("span");
    let quantity = parseInt(quantitySpan[0].innerHTML);
    let orderSum = document.getElementById("order-sum");
    let sumNumber = orderSum.getElementsByTagName("h3");
    let sum = parseInt(sumNumber[0].innerHTML);

        quantity += 1;
        quantitySpan[0].innerHTML = quantity;
        let price = parseInt(priceNumber[0].innerHTML);
        if(order.id.includes("small")){
            sum+=item.small_size.price;
            price+=item.small_size.price;
        } else{
            sum+=item.big_size.price;
            price+=item.big_size.price;
        }
        priceNumber[0].innerHTML = price+ "грн."
        sumNumber[0].innerHTML = sum+"грн.";

}

function removeOrder(button){
    let nearestCenter = button.closest("div");
    let nearestCounter = nearestCenter.closest(".pizza-order-counter");
    let priceNumber = nearestCounter.getElementsByClassName("pizza-order-price");
    let price = parseInt(priceNumber[0].innerHTML);
    let orderSum = document.getElementById("order-sum");
    let sumNumber = orderSum.getElementsByTagName("h3");
    let sum = parseInt(sumNumber[0].innerHTML);
    sum -= price;
    sumNumber[0].innerHTML = sum+"грн.";
    let order = button.closest(".pizza-order");
    order.remove();
    let orderCountTotal = document.getElementById("order-count");
    let orderCountTotalNum = parseInt(orderCountTotal.innerHTML);
    orderCountTotalNum-=1;
    orderCountTotal.innerHTML=orderCountTotalNum;
}

function clearOrders(){
    let order_box = document.getElementById("order-main");
    let orders = order_box.getElementsByClassName("pizza-order");
    for(let i= orders.length-1; i>=0; i--){
        orders[i].remove();
    }
    let orderSum = document.getElementById("order-sum");
    let sumNumber = orderSum.getElementsByTagName("h3");
    sumNumber[0].innerHTML = "0грн."
    let orderCountTotal = document.getElementById("order-count");
    orderCountTotal.innerHTML="0";
}

function displayAll(span){
    let filter = document.getElementById("pizza-filter");
    let buttons = filter.getElementsByTagName("span");
    for(let i=0; i<buttons.length; i++){
        buttons[i].classList.replace("selected", "unselected");
        buttons[i].style.backgroundColor = "cornsilk";
        buttons[i].style.color = "orange";
    }
    span.classList.add("selected");
    span.style.backgroundColor = "orange";
    span.style.color = "white";
    let pizzaSelection = document.getElementById("pizza-section");
    let pizzas = pizzaSelection.getElementsByClassName("thumbnail");
    for(let i=0; i<pizzas.length; i++){
        pizzas[i].style.opacity = "1";
    }
}

function displayMeat(span){
    let filter = document.getElementById("pizza-filter");
    let buttons = filter.getElementsByTagName("span");
    for(let i=0; i<buttons.length; i++){
        buttons[i].classList.replace("selected", "unselected");
        buttons[i].style.backgroundColor = "cornsilk";
        buttons[i].style.color = "orange";
    }
    span.classList.add("selected");
    span.style.backgroundColor = "orange";
    span.style.color = "white";
    let pizzaSelection = document.getElementById("pizza-section");
    let pizzas = pizzaSelection.getElementsByClassName("thumbnail");
    for(let i=0; i<pizzas.length; i++){
        pizzas[i].style.opacity = "1";
        let item = pizza_info.find(item => item.id.toString() === pizzas[i].id);
        if(!("meat" in item.content)){
            pizzas[i].style.opacity = "0.5";
        }
    }
}

function displayPineapples(span){
    let filter = document.getElementById("pizza-filter");
    let buttons = filter.getElementsByTagName("span");
    for(let i=0; i<buttons.length; i++){
        buttons[i].classList.replace("selected", "unselected");
        buttons[i].style.backgroundColor = "cornsilk";
        buttons[i].style.color = "orange";
    }
    span.classList.add("selected");
    span.style.backgroundColor = "orange";
    span.style.color = "white";
    let pizzaSelection = document.getElementById("pizza-section");
    let pizzas = pizzaSelection.getElementsByClassName("thumbnail");
    for(let i=0; i<pizzas.length; i++){
        pizzas[i].style.opacity = "1";
        let item = pizza_info.find(item => item.id.toString() === pizzas[i].id);
        if(!("pineapple" in item.content)){
            pizzas[i].style.opacity = "0.5";
        }
    }
}

function displayShrooms(span){
    let filter = document.getElementById("pizza-filter");
    let buttons = filter.getElementsByTagName("span");
    for(let i=0; i<buttons.length; i++){
        buttons[i].classList.replace("selected", "unselected");
        buttons[i].style.backgroundColor = "cornsilk";
        buttons[i].style.color = "orange";
    }
    span.classList.add("selected");
    span.style.backgroundColor = "orange";
    span.style.color = "white";
    let pizzaSelection = document.getElementById("pizza-section");
    let pizzas = pizzaSelection.getElementsByClassName("thumbnail");
    for(let i=0; i<pizzas.length; i++){
        pizzas[i].style.opacity = "1";
        let item = pizza_info.find(item => item.id.toString() === pizzas[i].id);
        if(!("mushroom" in item.content)){
            pizzas[i].style.opacity = "0.5";
        }
    }
}

function displaySea(span){
    let filter = document.getElementById("pizza-filter");
    let buttons = filter.getElementsByTagName("span");
    for(let i=0; i<buttons.length; i++){
        buttons[i].classList.replace("selected", "unselected");
        buttons[i].style.backgroundColor = "cornsilk";
        buttons[i].style.color = "orange";
    }
    span.classList.add("selected");
    span.style.backgroundColor = "orange";
    span.style.color = "white";
    let pizzaSelection = document.getElementById("pizza-section");
    let pizzas = pizzaSelection.getElementsByClassName("thumbnail");
    for(let i=0; i<pizzas.length; i++){
        pizzas[i].style.opacity = "1";
        let item = pizza_info.find(item => item.id.toString() === pizzas[i].id);
        if(!("ocean" in item.content)){
            pizzas[i].style.opacity = "0.5";
        }
    }
}

function displayVega(span){
    let filter = document.getElementById("pizza-filter");
    let buttons = filter.getElementsByTagName("span");
    for(let i=0; i<buttons.length; i++){
        buttons[i].classList.replace("selected", "unselected");
        buttons[i].style.backgroundColor = "cornsilk";
        buttons[i].style.color = "orange";
    }
    span.classList.add("selected");
    span.style.backgroundColor = "orange";
    span.style.color = "white";
    let pizzaSelection = document.getElementById("pizza-section");
    let pizzas = pizzaSelection.getElementsByClassName("thumbnail");
    for(let i=0; i<pizzas.length; i++){
        pizzas[i].style.opacity = "1";
        let item = pizza_info.find(item => item.id.toString() === pizzas[i].id);
        if(("meat" in item.content)||("ocean" in item.content)){
            pizzas[i].style.opacity = "0.5";
        }
    }
}

var pizza_info = [
    {
        id:1,
        icon:'assets/images/pizza_7.png',
        title: "Імпреза",
        type: 'М’ясна піца',
        content: {
            meat: ['балик', 'салямі'],
            chicken: ['куриця'],
            cheese: ['сир моцарелла', 'сир рокфорд'],
            pineapple: ['ананаси'],
            additional: ['томатна паста', 'петрушка']
        },
        small_size:{
            weight: 370,
            size: 30,
            price: 99
        },
        big_size:{
            weight: 660,
            size: 40,
            price: 169
        },
        is_new:true,
        is_popular:true

    },
    {
        id:2,
        icon:'assets/images/pizza_2.png',
        title: "BBQ",
        type: 'М’ясна піца',
        content: {
            meat: ['мисливські ковбаски', 'ковбаски папероні', 'шинка'],
            cheese: ['сир домашній'],
            mushroom: ['шампінйони'],
            additional: ['петрушка', 'оливки']
        },
        small_size:{
            weight: 460,
            size: 30,
            price: 139
        },
        big_size:{
            weight: 840,
            size: 40,
            price: 199
        },
        is_popular:true
    },
    {
        id:3,
        icon:'assets/images/pizza_1.png',
        title: "Міксовий поло",
        type: 'М’ясна піца',
        content: {
            meat: ['вітчина', 'куриця копчена'],
            cheese: ['сир моцарелла'],
            pineapple: ['ананаси'],
            additional: ['кукурудза', 'петрушка', 'соус томатний']
        },
        small_size:{
            weight: 430,
            size: 30,
            price: 115
        },
        big_size:{
            weight: 780,
            size: 40,
            price: 179
        }
    },
    {
        id:4,
        icon:'assets/images/pizza_5.png',
        title: "Сициліано",
        type: 'М’ясна піца',
        content: {
            meat: ['вітчина', 'салямі'],
            cheese: ['сир моцарелла'],
            mushroom: ['шампінйони'],
            additional: ['перець болгарський',  'соус томатний']
        },
        small_size:{
            weight: 450,
            size: 30,
            price: 111
        },
        big_size:{
            weight: 790,
            size: 40,
            price: 169
        }
    },
    {
        id:17,
        icon:'assets/images/pizza_3.png',
        title: "Маргарита",
        type: 'Вега піца',
        content: {
            cheese: ['сир моцарелла', 'сир домашній'],
            tomato: ['помідори'],
            additional: ['базилік', 'оливкова олія', 'соус томатний']
        },
        small_size:{
            weight: 370,
            size: 30,
            price: 89
        }
    },
    {
        id:43,
        icon:'assets/images/pizza_6.png',
        title: "Мікс смаків",
        type: 'М’ясна піца',
        content: {
            meat: ['ковбаски'],
            cheese: ['сир моцарелла'],
            mushroom: ['шампінйони'],
            pineapple: ['ананаси'],
            additional: ['цибуля кримська', 'огірки квашені', 'соус гірчичний']
        },
        small_size:{
            weight: 470,
            size: 30,
            price: 115
        },
        big_size:{
            weight: 780,
            size: 40,
            price: 180
        }
    },
    {
        id:90,
        icon:'assets/images/pizza_8.png',
        title: "Дольче Маре",
        type: 'Морська піца',
        content: {
            ocean: ['криветки тигрові', 'мідії', 'ікра червона', 'філе червоної риби'],
            cheese: ['сир моцарелла'],
            additional: ['оливкова олія', 'вершки']
        },
        big_size:{
            weight: 845,
            size: 40,
            price: 399
        }
    },
    {
        id:6,
        icon:'assets/images/pizza_4.png',
        title: "Россо Густо",
        type: 'Морська піца',
        content: {
            ocean: ['ікра червона', 'лосось копчений'],
            cheese: ['сир моцарелла'],
            additional: ['оливкова олія', 'вершки']
        },
        small_size:{
            weight: 400,
            size: 30,
            price: 189
        },
        big_size:{
            weight: 700,
            size: 40,
            price: 299
        }
    }
];