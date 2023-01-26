
var calendarEl = $('#calendar');
// create the DOM for the planner inside the #calendar div
var startTime = 8;
var endTime = 17;
for (var i=startTime; i<=endTime; i++){  // for each time from startTime to endTime inclusive
  var newSlot = $('<div>');
  newSlot.attr('class', 'row time-block past');
  calendarEl.append(newSlot);  //add new row to planner
  var newDiv = $('<div>');
  newDiv.attr('class', 'col-2 col-md-1 hour text-center py-3');
  var t = (i == 12 ? 12 : i%12);
  var meridiem = (i < 12 ? 'AM' : "PM");
  newDiv.text(t + meridiem);
  newSlot.append(newDiv);  //add the time tab to the row
  var newTextbox = $('<textarea>');
  newTextbox.attr('class', 'col-8 col-md-10 description');
  newTextbox.attr('rows', 3);
  newSlot.append(newTextbox);  //add the textarea to the row
  var newButton = $('<button>');
  newButton.attr('class', 'btn saveBtn col-2 col-md-1');
  newButton.attr('aria-label', 'save');
  newSlot.append(newButton);  //add the save button to the row
  var newImg = $('<i>');
  newImg.attr('class', 'fas fa-save');
  newImg.attr('aria-hidden', 'true');
  newButton.append(newImg);  //add the save disk icon to the save button
}
var textAreas = $('.description');  // grab all of the textareas
var timeBlocks = $('.time-block');  // grab all of the time-blocks 
var currentDayEl = $("#currentDay");  // grab the currentDay paragraph element to update the current day
var day = dayjs().format('MMMM D, YYYY');  // default to today
currentDayEl.text(day);  // set text to day
var datepickerEl = $("#datepicker"); //grab the datepicker text box

// make an array to store events.  functions to read them from localstorage and write them to it.
var events = [];
console.log(events);
function getEvents() {
  events = JSON.parse(localStorage.getItem("calendarEvents")); 
  if (!events) {
    events = [];
  } 
  //console.log(events);
  refreshCalendar();
}

function saveEvents() {
  var e = [];
  while (events.length > 0) {  // remove all empty text entries from the array.  Was doing this in addEvent but was not deleting empties and sometimes adding duplicate time slots.
    if (events[0].text != ''){
      e.push(events[0]);
    }
    events.splice(0,1);
  }
  events = e;
  localStorage.setItem('calendarEvents', JSON.stringify(events));
  //console.log(events);
}

// add a new event to the array
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
  entry.date = day;
  entry.time = timeSlot;
  entry.text = text;
  //console.log(entry);
  // if events is empty, add entry
  if (events.length == 0) {
    events.push(entry);
  } else { // check if an event with the same date and time is in the events array
    for (var i=0; i<events.length; i++) {
      if (entry.date == events[i].date && entry.time == events[i].time){
        // remove the old entry - don't add new entry, will do that outside for loop
        events.splice(i, 1);
        break;
      }
    }
    events.push(entry);
  }
  saveEvents();  // save to local storage
}

function refreshCalendar() {
  //clear calendar
  for (var i=0; i<textAreas.length; i++) {
    textAreas[i].value = '';
  }
  // parse through events for today matches.
  for (var i=0; i<events.length; i++){
    if (events[i].date == day){
      x = events[i].time - startTime;  // get index
      textAreas[x].value = events[i].text;
    }
  }
  currentDayEl.text(day);
  colorCalendar();
}

function colorCalendar() {
  var now = dayjs().format('MMDDYYYY.HH')
  //console.log(now);
  var nowHour = Math.round((now % 1) *  100);  // was getting a .999999932621 without the Math.round
  // console.log(nowHour);
  var calendarDate = dayjs(currentDayEl.text()).format('MMDDYYYY');
  //console.log(calendarDate);
  for (var i=0; i<timeBlocks.length; i++){
    if (now - calendarDate < 0) {
      // calendarDate is in the Future
      timeBlocks[i].setAttribute('class', 'row time-block future')
    } else if (now - calendarDate > 1) {
      timeBlocks[i].setAttribute('class', 'row time-block past');
    } else {
      //calendarDate is today
      if (i + startTime < nowHour){
        timeBlocks[i].setAttribute('class', 'row time-block past');
      } else if (i + startTime > nowHour) {
        timeBlocks[i].setAttribute('class', 'row time-block future');
      } else {
        timeBlocks[i].setAttribute('class', 'row time-block present');
      }
    }
  }
}


calendarEl.on('click', function (event){
  event.preventDefault();
  var element = $(event.target);
  if (element.is('.saveBtn')){
    //console.log(element);  // confirmed clicking on save button triggers.
    //console.log(parent);
    var time = element.prev().prev().text();  // sibling 2 up - time div
    var text = element.prev().val();  // sibling 1 up - textarea
    //console.log(time);
    //console.log(text);
    addEvent(time, text);
  }
  if (element.is('.dateBtn')){
    if (datepickerEl.val() == '') {
      return;
    } else {
      day = dayjs(datepickerEl.val()).format('MMMM D, YYYY')
      refreshCalendar();
    }
  }
})

getEvents();


