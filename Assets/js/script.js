// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {

var calendarEl = $('#calendar');

console.log(calendar);



// create the DOM
var startTime = 8;
var endTime = 17;
for (var i=startTime; i<=endTime; i++){
  var newSlot = $('<div>');
  newSlot.attr('class', 'row time-block past');
  calendarEl.append(newSlot);
  var newDiv = $('<div>');
  newDiv.attr('class', 'col-2 col-md-1 hour text-center py-3');
  newDiv.text(i + ':00');
  newSlot.append(newDiv);
  var newTextbox = $('<textarea>');
  newTextbox.attr('class', 'col-8 col-md-10 description');
  newTextbox.attr('rows', 3);
  newSlot.append(newTextbox);
  var newButton = $('<button>');
  newButton.attr('class', 'btn saveBtn col-2 col-md-1');
  newButton.attr('aria-label', 'save');
  newSlot.append(newButton);
  var newImg = $('<i>');
  newImg.attr('class', 'fas fa-save');
  newImg.attr('aria-hidden', 'true');
  newButton.append(newImg);
}
var textAreas = $('.description');

var currentDayEl = $("#currentDay");
var today = dayjs().format('MMMM D, YYYY');
currentDayEl.text(today);

var events = [];
function getEvents() {
  events = JSON.parse(localStorage.getItem("calendarEvents"));  
  console.log(events);
  refreshCalendar();
}
function saveEvents() {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
  console.log(events);
}
function addEvent(time, text) {
  var timeSlot = time.charAt(0);
  if (timeSlot == 1) {
    timeSlot += time.charAt(1);
  }
  console.log(timeSlot);
  console.log(text);
 var entry = {
     date: 'date',
     time: 'time',
     text: 'text'  
  };
  entry.date = today;
  entry.time = timeSlot;
  entry.text = text;
  console.log(entry);
  if (events.length == 0) {
    events.push(entry)
  } else {
  for (var i=0; i<events.length; i++) {
     if (entry.date == events[i].date && entry.time == events[i].time){
      if (text == ''){
        events.splice(i, 1);
      } else {
        events[i].text = text;
      } 
    } else {
      events.push(entry);
     }
    }
  }
  saveEvents();
}

function refreshCalendar() {
  // parse through events for today matches.
  for (var i=0; i<events.length; i++){
    if (events[i].date == today){
      x = events[i].time - startTime;  // get index
      textAreas[x].value = events[i].text;
    }
  }
}



calendarEl.on('click', function (event){
  event.preventDefault();
  var element = event.target;
  if (element.matches('.saveBtn')){
    //console.log(element);  // confirmed clicking on save button triggers.
    var parent = element.parentElement;
    //console.log(parent);
    var time = parent.children[0].textContent;
    var text = parent.children[1].value;
    //console.log(timeBlock);
    //console.log(text);
    addEvent(time, text);
  }
})




  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.

  getEvents();
});


