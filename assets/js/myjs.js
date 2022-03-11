$(document).ready(function(){
    getData("categories.json",printCategories);
    getData("categories.json",printCoverCat);
    getData("menu.json",printMenu)
    getData("products.json",printTrendyProducts);
    getData("products.json",printJustArrivedProducts);
    getData("featuredStart.json",printFeatured)
    getData("socialLinks.json",printSocial)
    getData("products.json",printProductsShop)
    getData("sizes.json",printSizes)

    printDetails()
    productInBasket()
    $("#range").on('change', filterChange)
    $("#searchName").keyup(filterChange)
    $('#sizesForm').on('change', '.sizes', filterChange)
    $("#sort").change(filterChange)
    $("#addToCart").click(addToCart)

    //If the basket is not empty
    if(JSON.parse(localStorage.getItem("cart"))!=null){
        fillBasket()
        cartSumary()
    }//In case the basket is empty but there is
    else if(JSON.parse(localStorage.getItem("cart"))){
        localStorage.removeItem("cart")
        $('#cartDiv').html('<p class="text-center col-12">Your cart is empty.</p>')
    }//In case the basket does not exist
    else{
        $('#cartDiv').html('<p class="text-center col-12">Your cart is empty.</p>')
    }

    //the form is hidden until the purchase processing button is clicked
    $("#checkoutForm").hide()
    $("#checkout").click(function(){
        $("#checkoutForm").show('slow')
    })

    //subscribe check function
    $("#subscribe").click(function(){
        let regEmail=/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;
        let email=$("#emailSub").val()
        console.log(email)
        if(email.match(regEmail)){
            $("#result").html("Successfully!")
        }else{
            $("#result").html("Please enter your email in the correct format.")
        }
    })
})

//retrieving json files
function getData(url,callback){
    $.ajax({
        url:"https://andjela-kostic.github.io/-eshopper-wp2/assets/data/"+url,
        //url:"../eshopper-1.0.0/assets/data/"+url,
        method: "get",
        dataType: "json",
        success: function(response){
            callback(response);
        },
        error: function(err){
            console.log(err);
        }
    })
}

//Print categories
function printCategories(data){
    let html='';
    data.forEach(c => {
        html+=`<a href="shop.html" id="${c.id}" class="catLink nav-item nav-link my-2" onclick="getCatId(this.id)">${c.name}</a>`
    });
    $('.navCatMenu').each(function(){
        $(this).html(html)
    })
    localStorage.setItem("cat",JSON.stringify(data))
}
//storing id from the selected category to perform filtering
var id;
function getCatId(elem){
    id=elem
    localStorage.setItem("idCat",id)
    filterChange();
}

//Print menu
function printMenu(data){
    let html=``;
    data.forEach(a=>{
            html+=`<a href="${a.href}" id="${a.name}" class="nav-item nav-link active" onclick="restartStorage()">${a.name}</a>`
    });    
    $('.menu').each(function(){
        $(this).html(html)
    }) 
}
//View all products when you click on shop.html, in case the category was previously selected so that only that category would not be displayed again
function restartStorage(){
    if(localStorage.getItem("idCat")){
        localStorage.removeItem("idCat")
    }  
    filterChange()
}

//printing 4 random products on the home page
function printTrendyProducts(data){
    let randomArray=getRandomElements(data, 4);
    printProducts(randomArray, "#trendyProducts");
}

//printing 4 random products that are new on the home page
function printJustArrivedProducts(data){
    let randomArray=getRandomElements(data, 4, true);
    printProducts(randomArray,"#justArrivedProducts")
}

//random product return function
function getRandomElements(array,limit, newProduct=false){
    let result = [];
    while(1){
        let e=array[Math.floor(Math.random()*array.length)];
        if(newProduct && result.indexOf(e)==-1 && e.new){
                result.push(e)
        }  
        else if(!newProduct && result.indexOf(e)==-1){
            result.push(e)
    }   
        if(result.length==limit) break;
    } 
    return result;
}

//universal product printing function
function printProducts(data, id="#products"){
    let html=``;
    data.forEach(p => {
        html+=`<div class="col-lg-3 col-md-6 col-sm-12 pb-1">
        <div id="${p.id}"class="card product-item border-0 mb-4">
            <div class="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                <img class="img-fluid w-100" src="assets/img/${p.image.img}" alt="">
            </div>
            <div class="card-body border-left border-right text-center p-0 pt-4 pb-3">
                <h6 class="text-truncate mb-3">${p.name}</h6>
                <div class="d-flex justify-content-center">
                    <h6>$${p.price.new}</h6><h6 class="text-muted ml-2">${p.price.old ? `<del>$${p.price.old}</del>`:""}</h6>
                </div>
            </div>
            <div class="card-footer bg-light border text-center">
                <a href="detail.html" id="viewDetail" class="btn btn-sm text-dark p-0" onclick="viewDetail(this)"><i class="fas fa-eye text-primary mr-1"></i>View Details</a>
            </div>
        </div>
    </div>`
    });
    if(data.length){
        $(id).html(html);
    }
    else{
        $(id).html("<p class='col-8 mx-auto py-5'>We currently do not have products for the specified conditions</p>")
    } 
}

//printing products on shop.html with all conditions
function printProductsShop(data){
    data=filterSearch(data)
    data=filterCategory(data)
    data=filterPrice(data)
    data=filterSize(data)
    data=sort(data)
    printProducts(data)
}

//filtering by category
function filterCategory(data){        
    let id=localStorage.getItem("idCat");
    if(id){
        return data.filter(x=>x.cat==id);
    }
    return data;
}
//filtering by price
function filterPrice(data){
    let value=$("#range").val();
    if(value==100) return data
    $("#rangeValue").text(value + "$");
    return data.filter(x=>parseInt(x.price.new)<value);
} 
//a function that is called up at each change to display the product
function filterChange(){
    getData("products.json",printProductsShop);
}

//Print sizes
function printSizes(data){
    let html=``;
    data.forEach(d => {
        html+=` <div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
        <input type="checkbox" name="sizes" class="sizes custom-control-input" id="size-${d.id}" value="${d.id}"/>
        <label class="custom-control-label" for="size-${d.id}">${d.value}</label>
    </div> `
    });
    $('#sizesForm').html(html)
    localStorage.setItem("allSizes",JSON.stringify(data))
}

//filtering by size
function filterSize(data){
    let checked=[]
    $(".sizes:checked").each(function(el){
        checked.push(parseInt($(this).val()))
    })
    if(checked!=0){
        return data.filter(x => x.size.some(z=>checked.includes(z)))
    }
    return data
}

//printing section
function printFeatured(data){
    let html=``;
    data.forEach(d => {
        html+=` <div class="col-lg-3 col-md-6 col-sm-12 pb-1">
        <div class="d-flex align-items-center border mb-4" style="padding: 30px;">
            <h1 class="${d.ico} text-primary m-0 mr-3"></h1>
            <h5 class="font-weight-semi-bold m-0">${d.text}</h5>
        </div>
    </div>`
    });
    $('#featured').html(html)
}
//printing categories with images and numbers of products for that category
function printCoverCat(data){
    let html=``;
    data.forEach(d => {
        html+=`<div class="col-lg-4 col-md-6 pb-1">
        <div class="cat-item d-flex flex-column border mb-4" style="padding: 30px;">
            <p class="text-right">A total of ${returnNumberProducts(d.id)} products</p>
            <a href="shop.html" id="${d.id}" class="cat-img position-relative overflow-hidden mb-3" onclick="getCatId(this.id)">
                <img class="img-fluid" src="assets/img/${d.cover}" alt="">
            </a>
            <h5 class="font-weight-semi-bold m-0">${d.name}</h5>
        </div>
    </div>`
    });
    $('#catCover').html(html)
}
//a function that returns the number of products for a given category
function returnNumberProducts(id){
    let cats=JSON.parse(localStorage.getItem("allProducts"))
    let sameCat= cats.filter(x=>x.cat==id);
    return sameCat.length
}
//printing links for social networks
function printSocial(data){
    let html=``;
    data.forEach(d => {
        html+=`<a class="text-dark pl-2" href="${d.href}">
                 <i class="${d.ico}"></i>
            </a>`
    });
    $('.social').each(function(){
        $(this).html(html)
    })   
}

//filtering by name
function filterSearch(data){
    let value=$('#searchName').val()
    if(value){
        valueLower=value.toLowerCase();
        return data.filter(function(el){
            return el.name.toLowerCase().indexOf(valueLower) !== -1;
        })
    }
    return data
}

//sorting by price and name
function sort(data){

    let value=$("#sort").val()
    if(value=="priceAsc"){
        return data.sort((a,b)=>a.price.new-b.price.new)
    }
    else if(value=="priceDesc"){
        return data.sort((a,b)=>b.price.new-a.price.new)
    }
    else if(value=="namesAsc"){
        return data.sort((a,b) => a.name > b.name ? 1 : -1);
    }
    else if(value=="namesDesc"){
        return data.sort((a,b) => a.name < b.name ? 1 : -1)
    }
    return data
}

/*it is activated when you click on see details below the product, retrieve its id and all
 product data is stored in local storage and a display function is called.*/
function viewDetail(el){
    let selected=$(el).parent().parent().attr('id');

    getData("products.json", getProducts);
    function getProducts(data){
        localStorage.setItem("allProducts",JSON.stringify(data))
        let product=data.filter(x=>x.id==selected)
        localStorage.setItem("product", JSON.stringify(product))         
    }
    printDetails();
}

//the data on the selected product is printed. Radio buttons of unavailable sizes are disabled
function printDetails(){
    let product=JSON.parse(localStorage.getItem("product")) 
    if(!product){
        $("#detailsDiv").html("<p class='bold text-center'>Choose which product you want to see.</p>")
    }
    else{
        let id=product[0].id
        let name=product[0].name
        let cat=product[0].cat
        let size=product[0].size
        let price=product[0].price
        let image=product[0].image

        $("#detailName").html(name)
        $("#detailPrice").html(price.new+" $")
        $("#detailImg").attr('src',`assets/img/${image.img}`)
        $("#detailImg").attr('alt',image.alt)

        let allSizes=$('input[name=size]')
        for(let i=0; i<allSizes.length;i++){
            let id=allSizes[i].id
            let sizeNumber=id.match(/\d/)[0]
            if(size.indexOf(parseInt(sizeNumber))==-1){
                $('[id="size-'+sizeNumber+'"][name="size"]').prop("disabled", true)
                $('[id="size-'+sizeNumber+'"][name="size"]').parent().prop("title","Size not available")
            }      
        }
    }
}

//function for adding product to cart
function addToCart(){
    let size=$('input[name="size"]:checked').val();
    if(!size){
        $("#chooseSize").show()
        $("#chooseSize").css('color','red')
    }
    else{
        $("#chooseSize").hide()
        let cart=[];
        let sizes=[]
        let getProduct=JSON.parse(localStorage.getItem("product"))
        if(JSON.parse(localStorage.getItem("cart")) && JSON.parse(localStorage.getItem("sizes"))){
            let cartStorage=JSON.parse(localStorage.getItem("cart"))
            cartStorage.forEach(element => {
                cart.push(element)
            });
            let sizesStorage=JSON.parse(localStorage.getItem("sizes"))
            sizesStorage.forEach(element => {
                sizes.push(element)
            });
            if(getProduct){
                cart.push(getProduct)
                sizes.push(size)
            }           
        }
        else{
            if(getProduct!=null){
                cart.push(getProduct)
                sizes.push(size)
            }
        }
        localStorage.setItem("cart",JSON.stringify(cart))  
        localStorage.setItem("sizes",JSON.stringify(sizes))     
        productInBasket()
        $("#added").html("Successfully added!</br><a href='cart.html'>See cart</a>")
        fillBasket()
    }
          
}

//enters the current product number in the basket
function productInBasket(){
    $('.badge').each(function(){
        let cart=JSON.parse(localStorage.getItem("cart"))        
        if(cart)  {
            $(this).html(cart.length)
        }
        else{
            $(this).html("0")
        }
    })
}

//basket filling function
function fillBasket(){
    let cart=JSON.parse(localStorage.getItem("cart"))
    //let sizes=JSON.parse(localStorage.getItem("sizes"))
    let html=``;
    for(let i=0; i<cart.length;i++){ 
        html+=`<tr id="${cart[i][0].id}">
        <td class="align-left"><img src="assets/img/${cart[i][0].image.img}" alt=" ${cart[i][0].image.alt}" style="width: 100px;"> ${cart[i][0].image.alt}</td>
        <td class="price align-middle">$${cart[i][0].price.new}</td>
        <td class="align-middle">
            <div class="input-group quantity mx-auto" style="width: 100px;">
                <div class="changeQuantity input-group-btn">
                    <button class="btn btn-sm btn-primary btn-minus" >
                    <i class="fa fa-minus"></i>
                    </button>
                </div>
                <input type="text" id="quantity" class="form-control form-control-sm bg-secondary text-center" value="1">
                <div class="changeQuantity input-group-btn">
                    <button class="btn btn-sm btn-primary btn-plus">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
            </div>
        </td>
        <td class="total align-middle">$${cart[i][0].price.new}</td>
        <td class="align-middle"><div><button class="remove btn btn-sm btn-primary" onclick="remove(this)"><i class="fa fa-times"></i></button><div></td>
        </tr>`
    }      

    $("#cartTable").html(html)
    $(".changeQuantity").click(changeQuantity)
}

//to change the quantity of the product. If the number is reduced to 0 then the product is thrown out of the basket
//returns the total price for one product depending on the quantity of that product
function changeQuantity(){
    let currentlyInt=parseInt(($(this).parent().find("input[type=text]")).val())
    if($(this).find('.btn').hasClass('btn-plus')){
        let next=currentlyInt+1
        $(this).parent().find("input[type=text]").val(next)
    }
    else if($(this).find('.btn').hasClass('btn-minus')){
        var next=currentlyInt-1     
        $(this).parent().find("input[type=text]").val(next)      
        if(next==0){
            remove(this)
        }
    }
    let currently=parseInt(($(this).parent().find("input[type=text]")).val())
    let findPrice=$(this).parent().parent().parent().find('.price').text()
    let price=parseFloat(findPrice.substr(1))
    let total=price*currently
    $(this).parent().parent().parent().find('.total').text("$"+total)
    cartSumary()
    productInBasket()
}

//throwing the product out of the basket. is called when the product number is 0 or click remove
function remove(el){ 
    let idOfProduct= $(el).parent().parent().parent().attr('id')
    let itemsProducs = JSON.parse(localStorage.getItem('cart'));
    let itemForDelete = itemsProducs.filter(item => item[0].id == parseInt(idOfProduct));
    let indexItem=itemsProducs.indexOf(itemForDelete[0])
    let filteredProducts = itemsProducs.filter(item =>(itemsProducs.indexOf(item)) != indexItem);               
    localStorage.setItem('cart', JSON.stringify(filteredProducts));
    $(el).parent().parent().parent().fadeOut(300, function(){ $(this).remove();});
    console.log(JSON.parse(localStorage.getItem('cart')).length)
    console.log(JSON.parse(localStorage.getItem('cart')))
    if(!JSON.parse(localStorage.getItem('cart')).length){
        $('#cartDiv').html('<p class="text-center col-12">Your cart is empty.</p>')
        localStorage.removeItem("cart")
    }
}

//returns the total sum of the prices of all products in the basket
function cartSumary(){
    var count=0;
    $("#cartTable tr").each( function() {
        var text = $('.total',this).text();
        var crop=parseFloat(text.substr(1))
        count+=crop
    })
    $("#subtotal").html(count.toFixed(2))
    $("#total").html(count.toFixed(2))
}

var universalReg=/^([A-Z][a-z]+([ ]?[a-z]?["-]?[A-Z][a-z]+)*)$/;
var regEmail=/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;


/////////////////
$("#order").click(function(){

    let regPhone=/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    let regAddress=/[A-Za-z0-9'\.\-\s\,]{2,20}/;
    let regZip=/^([0-9]+)$/
    let errors=0;

    check("#firstname",universalReg)
    check("#lastname",universalReg)
    check("#email",regEmail)
    check("#address",regAddress)
    check("#phone",regPhone)
    check("#city",universalReg)
    check("#state",universalReg)
    check("#zip",regZip)

    isItEmpty("#country")
    if($("#country").val().length){
        errors++
        $("#country").addClass('border border-danger')
    }
    else{
        $("#country").removeClass('border border-danger')
    }
    function check(id,regex){
        let val=$(id).val()
        if(!val.match(regex)){
            errors++
            $(id).addClass('border border-primary')
           let example=$(id).attr('placeholder');
           if(val){
            $(id).parent().find('.example').text("Example: "+example);
           }         
        }
        else{
            $(id).attr('class','form-control')
            $(id).parent().find('.example').text('')
        }
    }

    if($('input[name=payment]:checked').val()){
        $("#please").hide()
    }
    else{
        $("#please").show()
        errors++
    }

    if(!errors){
        $("#successOrder").html("Successfully ordered! you will soon receive an email with payment details. ")
    }
    else{
        $("#successOrder").html("Please fill in the form according to the examples given.")
    }
})

$("#sendMessageButton").click(function(){
    let errors=0;
    if(!errors){
        $("#success").html("Your message was successfully forwarded!")
    }
    else{
        $("#success").html("Please fill in the form according to the examples given.")
    }
    check("#name",universalReg)
    check("#email",regEmail)
    check("#subject",universalReg)

    if($("#messsage").val()==null){
        errors++
        $("#messsage").addClass('border border-danger')
    }
    else{
        $("#messsage").removeClass('border border-danger')
    }
    
    function check(id,regex){
        let val=$(id).val()
        if(!val.match(regex)){
            errors++
            $(id).addClass('border border-primary')
            let message=$(id).attr('data-validation-required-message')
            $(id).parent().find('.help-block').text(message);       
        }
        else{
            $(id).attr('class','form-control')
            $(id).parent().find('.help-block').text('')
        }
    }
console.log(errors)
    
})