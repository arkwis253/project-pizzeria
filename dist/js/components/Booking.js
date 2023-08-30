import {templates, select} from "../settings.js";
import AmountWidget from "./AmountWidget.js";

class Booking{
  constructor(element){
  const thisBooking = this;
  thisBooking.render(element);
  thisBooking.initWidgets();
  }
  
  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    this.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    console.log('ta', thisBooking.dom.peopleAmount);
    console.log('ta', thisBooking.dom.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;
    
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.peopleAmount.addEventListener('updated', function(){
    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function(){
    });
  }
}

export default Booking;