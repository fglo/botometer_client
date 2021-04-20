var url = "/verifications/getall"
const urlParams = new URLSearchParams(window.location.search);
const account_id = urlParams.get('account_id');
if(account_id && account_id > 0) {
  url = `/verifications/get_by_account/${account_id}`
}

var table = $("#verifications-table").DataTable({
  ajax: {
    url: url,
    dataSrc: "",
  },
  stateSave: true,
  order: [[0, 'asc']],
  responsive: true,
  columns: verificationColumns,
  columnDefs: [
    {
      targets: -1,
      data: null,
      defaultContent:
        "<div>" +
        '<a class="verification-details button button-small" uk-tootlip="Show Botometer Result" style="background: transparent;">' +
        '<i uk-icon="icon: search; ratio: 0.9"></i>' +
        "</a>" +
        "</div>",
    },
  ],
});

$("#verifications-table").on("click", "a.verification-details", function () {
  var row = table.row($(this).parents("tr")).data();
  var jsonObj = JSON.parse(row["verification_result_json"]);
  var jsonStr = JSON.stringify(jsonObj, undefined, '\t')
  console.log(syntaxHighlight(jsonStr));
  let modal =  $('#modal-verification-json-result');
  $('#modal-body', modal).html(syntaxHighlight(jsonStr))
  UIkit.modal(modal).show();
});

function syntaxHighlight(json) {
  if (typeof json != 'string') {
       json = JSON.stringify(json, undefined, '\t');
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'key';
          } else {
              cls = 'string';
          }
      } else if (/true|false/.test(match)) {
          cls = 'boolean';
      } else if (/null/.test(match)) {
          cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
  }).replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/(?:\t)/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
}

$(document).ready(function () {
  $("#navbar-item-verifications").addClass("uk-active");

  setInterval(function () {
    table.ajax.reload(null, false);
  }, 5000);
});