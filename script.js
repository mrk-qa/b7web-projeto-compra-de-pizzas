let cart = [];
let modalQt = 1;
let modalKey = 0;
const c = (el) =>  document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//LISTAGEM DE PIZZAS
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    //inserindo atributo data-key em cada item
    pizzaItem.setAttribute('data-key', index);

    //inserindo itens na page
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //MODAL
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        
        //dados do item no modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        
        //tamanhos dos itens
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            //sempre iniciar modal com size == 2 (grande)
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        //qtde de pizzas no modal
        c('.pizzaInfo--qt').innerHTML = modalQt;

        //animação de entrada modal
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex'; 
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    c('.pizza-area').append(pizzaItem);
});

//EVENTOS DO MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
    
};

//click do botão cancelar/voltar
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//click diminuir qtde
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    //nunca diminuir pra menos que 1
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

//click adicionar qtde
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//select size
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        //remove outros e seleciona apenas 1
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//click adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    //pegando tamanho da pizza pelo data-key + parseInt para transformar em inteiro
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    //identificador para não causar pedido duplicado no carrinho
    let identifier = pizzaJson[modalKey].id+'_'+size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    //se achou o mesmo item, acrescenta
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {

        //informações que vão para o carrinho
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    };

    updateCart();
    closeModal();
});

//abrindo carrindo mobile
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

//fechando carrindo mobile
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

function updateCart() {
    //atualizando qtde no carrinho mobile
    c('.menu-openner span').innerHTML = cart.length;

    //se tiver algo no carrinho == mostrar
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            //definindo tamanho das pizzas no carrinho
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            };

            //nome das pizzas no carrinho
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //trazendo imagem da pizza no carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            //trazendo nome da pizza noc arrinho
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            //trazendo qtde de pizzas no carrinho
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //click adicionar qtde dentro do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            //click diminuir qtde dentro do carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        };

        //cálculo para preço no carrinho
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        //mostrando na page o preço no carrinho -> span:last-child == último item do <span>
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    //se tiver vazio não mostrar
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    };
};