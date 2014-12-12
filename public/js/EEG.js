// EEG.js -- indicate where we are in the hearbeat
function EEG(id) {
  var sprintEndDate = getSprintEndDate();
  var today = moment();
  var delta = sprintEndDate.dayOfYear()-today.dayOfYear();
  var index = 12 - delta // (because the first monday is 12 days before the last friday
  for (var i = 0; i < index-1; i++) {
    document.getElementById('day'+Number(i+1)).classList.add('past');
  }
  document.getElementById('day'+Number(index)).classList.add('today');
  document.getElementById('timeleft').textContent = (delta+1) + " " + (delta+1 == 1 ? "work day" : "work days") +" left in the heartbeat."
}