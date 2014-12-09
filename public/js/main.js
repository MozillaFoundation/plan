
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
        }
        var color = "#"+l.color;
      }
      var div = document.createElement('li');
      div.setAttribute('id', "issue_" + issue.id);
      div.classList.add('desc');
      var h5 = document.createElement('h5');
      var i = document.createElement('i');
      i.classList.add('fa');
      i.classList.add('fa-comments');
      h5.appendChild(i);
      var a = document.createElement('a');
      a.href = issue.html_url;
      a.textContent = issue.title;
      p = document.createElement('p');
      if (issue.body) {
        // Note: doesn't do github emoji support.
        p.textContent = issue.body.split('\n')[0];
      }
      h5.appendChild(a)
      div.appendChild(h5);


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

      // do all the non-status, non-date labels too
      for (var j = 0; j < labels.length; j++) {
        var l = labels[j];
        if (l.name.indexOf('status:') == 0) 
          continue;
        if ((l.name.indexOf('jan') == 0) || 
            (l.name.indexOf('feb') == 0) || 
            (l.name.indexOf('mar') == 0) || 
            (l.name.indexOf('apr') == 0) || 
            (l.name.indexOf('may') == 0) || 
            (l.name.indexOf('jun') == 0) || 
            (l.name.indexOf('jul') == 0) || 
            (l.name.indexOf('aug') == 0) || 
            (l.name.indexOf('sep') == 0) || 
            (l.name.indexOf('oct') == 0) || 
            (l.name.indexOf('nov') == 0) || 
            (l.name.indexOf('dec') == 0))
          continue;
        var color = "#"+l.color;
        tag = document.createElement("span");
        tag.classList.add("tag");
        tag.style.backgroundColor = color;
        tag.style.opacity = "0.5";
        tag.textContent = l.name;
        div.appendChild(tag);
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
  console.log(document.location.pathname);
  if (document.location.pathname == '/') {
    populateIssues('#issues-now', 'dec12');
    populateIssues('#issues-next', 'dec24');
  };
});
