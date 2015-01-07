// EEG.js -- indicate where we are in the hearbeat
function EEG(id) {
  var sprintEndDate = getSprintEndDate();
  var sprintStartDate = sprintEndDate.subtract(11, 'days');
  var today = moment();
  // var index = 12 - delta // (because the first monday is 12 days before the last friday
  var day = sprintStartDate;
  for (var i = 0; i < 14; i++) {
    var daynode = document.getElementById('day'+Number(i+1));
    if (day.isSame(today, 'day')) {
      document.getElementById('day'+Number(i+1)).classList.add('today');
    } else if (day.isBefore(today, 'day')) {
      document.getElementById('day'+Number(i+1)).classList.add('past');
    } 
    if (day.isSame(moment("2014-12-25"), 'day') || 
        day.isSame(moment("2014-12-26"), 'day')) {
      daynode.classList.add('holiday');
    }
    daynode.innerHTML = "<div>"+daynode.textContent+"</div><div>" + ' ' + day.format('MMM D') + "</div>"
    day.add(1, 'day');
  }
  // document.getElementById('timeleft').textContent = (delta+1) + " " + (delta+1 == 1 ? "work day" : "work days") +" left in the heartbeat."
}