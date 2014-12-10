
function getIssues(label, cb, err) {
  $.ajax('/api/issues', {
    data: {
      'labels': label
    },
    type: 'get',
    format: 'json',
    success: function(data) {
      cb && cb(JSON.parse(data));
    },
    error: function(data, error) {
      console.log("GOT ERROR", error, data)
      err && err(error);
    }
  });
}
function issuePriority(issue) {
  var labels = issue.labels;
  for (var j = 0; j < labels.length; j++) {
    var l = labels[j];
    if (l.name[0] == 'p' && (l.name[1] == '1') || l.name[1] == '2' || l.name[1] == '3') {
      return Number(l.name[1])
    }
  }
  return 100;
}

function populateIssues(elementid, label, deadlineid, deadlinelabel) {
  emoji.use_sheet = true;
  var deadline = document.querySelector(deadlineid);
  deadline.textContent = deadlinelabel;
  deadline.href = "https://github.com/MozillaFoundation/plan/issues?q=is%3Aopen+is%3Aissue+label%3A"+label;

  var container = document.querySelector(elementid);
  getIssues(label, function(issues) {
    issues.sort(function(issue1, issue2) {
      if (issuePriority(issue1) > issuePriority(issue2))
        return 1;
      else if (issuePriority(issue1) < issuePriority(issue2))
        return -1;
      else return 0;
    });
    var ul = null;
    var last_priority = -1;
    for (var i = 0; i < issues.length;i++) {
      var issue = issues[i];
      var labels = issue.labels;
      var status = null;
      var priority = issuePriority(issue);
      for (var j = 0; j < labels.length; j++) {
        var l = labels[j];
        if (l.name.indexOf('status:') == 0) {
          var status = l.name.slice('status:'.length);
        }
        var color = "#"+l.color;
      }

      var div = document.createElement('li');
      div.setAttribute('id', "issue_" + issue.id);
      div.classList.add('issue');
      var priority = issuePriority(issue);
      if (priority) {
        div.classList.add('p'+priority);
      }
      var h5 = document.createElement('h5');
      var icon;
      if (issue.assignee && issue.assignee.avatar_url) {
        var link = document.createElement('a');
        link.href = issue.assignee.html_url;
        icon = document.createElement('img');
        icon.classList.add('avatar');
        icon.src = issue.assignee.avatar_url;
        link.appendChild(icon);
        h5.appendChild(link);
      } else {
        icon = document.createElement('span');
        icon.classList.add('placeholderavatar');
        icon.classList.add('fa');
        icon.classList.add('fa-question');
        h5.appendChild(icon);
      }
      var a = document.createElement('a');
      a.href = issue.html_url;
      a.textContent = issue.title;
      p = document.createElement('p');
      if (issue.body) {
        var raw_text = issue.body.split('\n')[0];
        var pretty_text = emoji.replace_colons(raw_text)
        p.innerHTML = pretty_text; // XXX would like something safer.
      }
      div.appendChild(h5);
      var tags = document.createElement('span');
      tags.classList.add('tags');
      h5.appendChild(tags);
      h5.appendChild(a)

      var tag = document.createElement("span");
      tag.classList.add("tag");
      if (status) {
        tag.style.backgroundColor = color;
      } else {
        status = 'needupdate'
      }
      tag.classList.add(status);
      tag.textContent = status;
      tags.appendChild(tag);
      div.classList.add(status);

      // do all the non-status, non-date labels too
      for (var k = 0; k < labels.length; k++) {
        var l = labels[k];
        if ((l.name.indexOf('status:') != 0) && 
            (l.name.indexOf('jan') != 0) && 
            (l.name.indexOf('feb') != 0) && 
            (l.name.indexOf('mar') != 0) && 
            (l.name.indexOf('apr') != 0) && 
            (l.name.indexOf('may') != 0) && 
            (l.name.indexOf('jun') != 0) && 
            (l.name.indexOf('jul') != 0) && 
            (l.name.indexOf('aug') != 0) && 
            (l.name.indexOf('sep') != 0) && 
            (l.name.indexOf('oct') != 0) && 
            (l.name.indexOf('nov') != 0) && 
            (l.name.indexOf('dec') != 0) && 
            (l.name.indexOf('p1') != 0) && 
            (l.name.indexOf('p2') != 0)) {
          var color = "#"+l.color;
          tag = document.createElement("span");
          tag.classList.add("tag");
          tag.style.backgroundColor = color;
          tag.style.opacity = "0.5";
          tag.textContent = l.name;
          tags.appendChild(tag);
        }
      }
      div.appendChild(p);
      if (!ul || priority != last_priority) {
        ul = document.createElement('ul');
        ul.classList.add('prioritygroup');
        ul.classList.add('p' + String(priority));
        ul.appendChild(div);
        container.appendChild(ul);
        last_priority = priority;
      } else {
        ul.appendChild(div);
      }
    }
  });
}

function nextstep() {
  if (step == laststep) {
     $("#intake")[0].submit();
     return;
  }
  if (step+1 == laststep) {
    $("#continue")[0].textContent = "Ready to Submit"
  }
  step++;
  $("#step" + step)[0].classList.remove('hidden');
  var input = $("#step" + step + ' textarea')[0];
  if (input) {
    input.focus();
  }
}


var step = 1;
var laststep = 4;
$(document).ready(function() {

  laststep = document.querySelectorAll('.step').length;

  var textAreas = document.querySelectorAll('.step textarea');
  Array.prototype.forEach.call(textAreas, function (textArea) {
    var commandKeyDown = false;

    // when user presses command/ctrl+enter, go to next step
    textArea.onkeydown = function (e) {
      if (e.keyCode === 13 && (commandKeyDown || e.ctrlKey)) {
        nextstep();
      }

      // got these from http://stackoverflow.com/questions/3902635/how-does-one-capture-a-macs-command-key-via-javascript
      commandKeyDown = [224, 17, 91, 93].indexOf(e.keyCode) > -1;
    };
    textArea.onkeyup = function (e) {
      commandKeyDown = [224, 17, 91, 93].indexOf(e.keyCode) > -1;
    };
  });

  if (document.location.pathname == '/') {
    // XXX: move this to some configuration file somewhere easier to find.
    // XXX: make the org + repo also easier to configure in one location.
    populateIssues('#issues-now', 'dec12', '#deadline-now', '(by Dec 12th)');
    populateIssues('#issues-next', 'dec24', '#deadline-next', '(by Dec 24th)');
  };
});
