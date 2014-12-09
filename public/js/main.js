
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
  return 0;
}

function populateIssues(elementid, label, deadlineid, deadlinelabel) {
  var deadline = document.querySelector(deadlineid);
  deadline.textContent = deadlinelabel;
  deadline.href = "https://github.com/MozillaFoundation/plan/issues?q=is%3Aopen+is%3Aissue+label%3A"+label;

  var lis = document.querySelector(elementid);
  getIssues(label, function(issues) {
    issues.sort(function(issue1, issue2) {
      if (issuePriority(issue1) > issuePriority(issue2))
        return 1;
      else if (issuePriority(issue1) < issuePriority(issue2))
        return -1;
      else return 0;
    });
    for (var i = 0; i < issues.length;i++) {
      var issue = issues[i];
      var labels = issue.labels;
      var status = null;
      for (var j = 0; j < labels.length; j++) {
        var l = labels[j];
        if (l.name.indexOf('status:') == 0) {
          var status = l.name.slice('status:'.length);
        }
        var color = "#"+l.color;
      }
      var div = document.createElement('li');
      div.setAttribute('id', "issue_" + issue.id);
      div.classList.add('desc');
      var h5 = document.createElement('h5');
      var icon = document.createElement('i');
      icon.classList.add('fa');
      icon.classList.add('fa-comments');
      h5.appendChild(icon);
      var a = document.createElement('a');
      a.href = issue.html_url;
      a.textContent = issue.title;
      p = document.createElement('p');
      if (issue.body) {
        // Note: doesn't yet support github emoji
        p.textContent = issue.body.split('\n')[0];
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
        tag.textContent = status;
      } else {
        tag.classList.add("unknown");
        tag.textContent = "???";
      }
      tags.appendChild(tag);

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
            (l.name.indexOf('dec') != 0)) {
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
  if (document.location.pathname == '/') {
    populateIssues('#issues-now', 'dec12', '#deadline-now', '(by Dec 12th)');
    populateIssues('#issues-next', 'dec24', '#deadline-next', '(by Dec 24th)');
  };
});
