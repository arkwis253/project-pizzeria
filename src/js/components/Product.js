import {select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';


class Product{
    constructor(id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }

    renderInMenu(){
      const thisProduct = this;
      const generatedHTML = templates.menuProduct(thisProduct.data);
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      const menuContainer = document.querySelector(select.containerOf.menu);
      menuContainer.appendChild(thisProduct.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.form.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion(){
      const thisProduct = this;
      thisProduct.accordionTrigger.addEventListener('click', function(){ 
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        activeProducts.forEach(product => {
          if(product !== thisProduct.element){
            product.classList.remove('active');
          }
        })
        thisProduct.element.classList.toggle('active');
      });
    }

    initOrderForm(){
        const thisProduct = this;
        thisProduct.form.addEventListener('submit', function(event){
          event.preventDefault();
          thisProduct.processOrder();
        });
        
        for(let input of thisProduct.formInputs){
          input.addEventListener('change', function(){
            thisProduct.processOrder();
          });
        }
        
        thisProduct.cartButton.addEventListener('click', function(event){
          event.preventDefault();
          thisProduct.processOrder();
          thisProduct.addToCart();
        });
    }

    processOrder(){
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      // set price to default price
      let price = thisProduct.data.price;

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];

        // for every option in this category
        for(let optionId in param.options){
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);

          if(optionSelected){
            if(!option.default){
              price += option.price;
            }
            
          }else{
            if(option.default){
              price -= option.price;
            }
          }

          if(optionImage){
            if(optionSelected){
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            }else{
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      } 
      // update calculated price in the HTML
      thisProduct.priceSingle = price;
      price *= thisProduct.amountWidgetElem.value;
      const totalPrice = thisProduct.form.querySelector(select.menuProduct.priceElem);
      totalPrice.innerHTML = price;
    }
    
    initAmountWidget(){
      const thisProduct = this;
      
      thisProduct.amountWidgetElem = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.dom.wrapper.addEventListener('updated', function(){
        thisProduct.processOrder();
      })
    }

    prepareCartProduct(){
      const thisProduct = this;

      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidgetElem.value,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.priceSingle*thisProduct.amountWidgetElem.value,
        params: thisProduct.prepareCartProductParams(),
      };

      return productSummary;
    }

    addToCart(){
      const thisProduct = this;
      //app.cart.add(thisProduct.prepareCartProduct());

      const event = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
          product: thisProduct.prepareCartProduct(),
        },
      }
      );
      thisProduct.element.dispatchEvent(event);
    }

    prepareCartProductParams(){
      const thisProduct = this;
      
      
      const formData = utils.serializeFormToObject(thisProduct.form);
      const selectedParams = {};

      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        selectedParams[paramId] = {
          label: param.label,
          options: {}
        }
        // for every option in this category
        for(let optionId in param.options){
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          const option = param.options[optionId];
          if(optionSelected){
            selectedParams[paramId].options[optionId] = option.label;
          }
        }
      }

      return selectedParams;
    }
  }

export default Product;