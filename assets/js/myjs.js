
var dataProducts=[];
var dataCategories=[];
var allSizes=[]
function getData(url,callback){
    $.ajax({
        url:"../eshopper-1.0.0/assets/data/"+url,
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
$(document).ready(function(){
getData("categories.json",printCategories);
getData("categories.json",printCoverCat);
getData("menu.json",printMenu)
getData("products.json",printTrendyProducts);
getData("products.json",printJustArrivedProducts);
//getData("headerImages.json",printHeader)
getData("featuredStart.json",printFeatured)
//getData("partners.json",getPartners)
getData("socialLinks.json",printSocial)
getData("products.json",printProductsShop)
getData("sizes.json",printSizes)
})


function printCategories(data){
    let html='';
    data.forEach(c => {
        html+=`<a href="shop.html" id="${c.id}" class="catLink nav-item nav-link my-2" onclick="getCatId(this.id)">${c.name}</a>`
    });
    $('.navCatMenu').each(function(){
        $(this).html(html)
    })   
    dataCategories=data;
}

var id;
function getCatId(elem){
    id=elem
    localStorage.setItem("idCat",id)
    filterChange();
}

function printMenu(data){
    let html=``;
    data.forEach(a=>{
            html+=`<a href="${a.href}" id="${a.name}" class="nav-item nav-link active" onclick="restartStorage(this)">${a.name}</a>`
    });    
    $('.menu').each(function(){
        $(this).html(html)
    }) 
}

function restartStorage(elem){
    if(localStorage.getItem("idCat")){
        localStorage.removeItem("idCat")
    }  
    filterChange()
}

function printTrendyProducts(data){
    let randomArray=getRandomElements(data, 4);
    printProducts(randomArray, "#trendyProducts");
}

function printJustArrivedProducts(data){
    let randomArray=getRandomElements(data, 4, true);
    printProducts(randomArray,"#justArrivedProducts")
}

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
    $(id).html(html);
}

function printProductsShop(data){
    data=filterSearch(data)
    data=filterCategory(data)
    data=filterPrice(data)
    data=filterSize(data)
    data=sort(data)
    printProducts(data)
    dataProducts=data;
}

function filterCategory(data){      
   
    let id=localStorage.getItem("idCat");
    if(id){
        return data.filter(x=>x.cat==id);
    }
    return data;
}
function filterPrice(data){
    let value=$("#range").val();
    if(value==100) return data
    $("#rangeValue").text(value + "$");
    return data.filter(x=>parseInt(x.price.new)<value);
} 

function filterChange(){
    getData("products.json",printProductsShop);
}

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

function printCoverCat(data){
    let html=``;
    data.forEach(d => {
        html+=`<div class="col-lg-4 col-md-6 pb-1">
        <div class="cat-item d-flex flex-column border mb-4" style="padding: 30px;">
            <p class="text-right">Vrati broj proizvoda</p>
            <a href="" class="cat-img position-relative overflow-hidden mb-3">
                <img class="img-fluid" src="assets/img/${d.cover}" alt="">
            </a>
            <h5 class="font-weight-semi-bold m-0">${d.name}</h5>
        </div>
    </div>`
    });
    $('#catCover').html(html)
}


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

$("#range").on('change', filterChange)

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

$('#sizesForm').on('change', '.sizes', filterChange)

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


$("#searchName").keyup(filterChange)

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

$("#sort").change(filterChange)

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
printDetails()
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

$("#addToCart").click(function(){
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
        $('.badge').each(function(){
            $(this).html(cart.length)
        })
        $("#added").text("Success added!")
        fillBasket()
    }
        
   
})

$('.badge').each(function(){
    let cart=JSON.parse(localStorage.getItem("cart"))
    if(cart)  $(this).html(cart.length)
 
})

//$('#cartDiv').html('<p class="text-center col-12">Your cart is empty.</p>')
$(document).ready(function(){
    fillBasket()
})
function fillBasket(){
    let cart=JSON.parse(localStorage.getItem("cart"))
    let sizes=JSON.parse(localStorage.getItem("sizes"))
    let html=``;
    for(let i=0; i<cart.length;i++){ 
        html+=`<tr id="${cart[i][0].id}">
        <td class="align-middle"><img src="assets/img/${cart[i][0].image.img}" alt=" ${cart[i][0].image.alt}" style="width: 100px;"> ${cart[i][0].image.alt}</td>
        <td class="price align-middle">$${cart[i][0].price.new}</td>
        <td class="align-middle">
            <div class="input-group quantity mx-auto" style="width: 100px;">
                <div class="input-group-btn">
                    <button class="changeQuantity btn btn-sm btn-primary btn-minus" >
                    <i class="fa fa-minus"></i>
                    </button>
                </div>
                <input type="text" id="quantity" class="form-control form-control-sm bg-secondary text-center" value="1">
                <div class="input-group-btn">
                    <button class="changeQuantity btn btn-sm btn-primary btn-plus">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
            </div>
        </td>
        <td class="total align-middle">${cart[i][0].price.new}</td>
        <td class="align-middle"><button class="remove btn btn-sm btn-primary" onclick="remove(this)"><i class="fa fa-times"></i></button></td>
        </tr>`
    }      

    $("#cartTable").html(html)
    $(".changeQuantity").click(function(){
        let currentlyInt=parseInt(($(this).parent().parent().find("input[type=text]")).val())
        if($(this).hasClass('btn-plus')){
            let next=currentlyInt+1
            $(this).parent().parent().find("input[type=text]").val(next)
        }
        else if($(this).hasClass('btn-minus')){
            var next=currentlyInt-1     
            $(this).parent().parent().find("input[type=text]").val(next)      
            if(next==0){
                let idOfProduct=$(this).parent().parent().parent().parent().attr('id')
                let itemsProducs = JSON.parse(localStorage.getItem('cart'));
                let itemForDelete = itemsProducs.filter(item => item[0].id == parseInt(idOfProduct));
                let indexItem=itemsProducs.indexOf(itemForDelete[0])
                let filteredProducts = itemsProducs.filter(item =>(itemsProducs.indexOf(item)) != indexItem);               
                localStorage.setItem('cart', JSON.stringify(filteredProducts));
                $(this).parent().parent().parent().parent().remove()
            }
        }
        let currently=parseInt(($(this).parent().parent().find("input[type=text]")).val())
        let findPrice=$(this).parent().parent().parent().parent().find('.price').text()
        let price=parseFloat(findPrice.substr(1))
        let total=price*currently
        $(this).parent().parent().parent().parent().find('.total').text("$"+total)
    })
}


function remove(el){
  
    let idOfProduct= $(el).parent().parent().attr('id')
    let itemsProducs = JSON.parse(localStorage.getItem('cart'));
    let itemForDelete = itemsProducs.filter(item => item[0].id == parseInt(idOfProduct));
    let indexItem=itemsProducs.indexOf(itemForDelete[0])
    let filteredProducts = itemsProducs.filter(item =>(itemsProducs.indexOf(item)) != indexItem);               
    localStorage.setItem('cart', JSON.stringify(filteredProducts));
    $(el).parent().parent().remove()
}