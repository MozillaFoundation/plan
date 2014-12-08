
function getIssues(label, cb, err) {
  console.log("LABEL", label)
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
      err && err(error);
    }
  });
}

function populateIssues(elementid, label) {
  var lis = document.querySelector(elementid);
  getIssues(label, function(issues) {
    for (var i = 0; i < issues.length;i++) {
      var issue = issues[i];
      var labels = issue.labels;
      var status = null;
      for (var j = 0; j < labels.length; j++) {
        var l = labels[j];
        if (l.name.indexOf('status:') == 0) {
          var status = l.name.slice('status:'.length);
          var color = "#"+l.color;
        }
      }
      var div = document.createElement('li');
      div.setAttribute('id', "issue_" + issue.id);
      div.classList.add('desc');
      var a = document.createElement('a');
      a.href = issue.html_url;
      a.textContent = issue.title;
      p = document.createElement('p');
      if (issue.body) {
        // Note: doesn't do github emoji support.
        p.textContent = issue.body.split('\n')[0];
      }
      var tag = document.createElement("span");
      tag.classList.add("tag");
      if (status) {
        tag.style.backgroundColor = color;
        tag.textContent = status;
      } else {
        tag.classList.add("unknown");
        tag.textContent = "???";
      }
      div.appendChild(tag);
      div.appendChild(a);
      div.appendChild(p);
      lis.appendChild(div);
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
}


var step = 1;
var laststep = 4;
$(document).ready(function() {
  console.log(document.location.pathname);
  if (document.location.pathname == '/') {
    populateIssues('#issues-now', 'dec12');
    populateIssues('#issues-next', 'dec24');
  };
});
