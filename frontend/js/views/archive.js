var table = $("#accounts-table").DataTable({
  ajax: {
    url: "/accounts/getallarchived",
    dataSrc: "",
  },
  order: [[0, 'asc']],
  responsive: true,
  columns: accountColumns,
  columnDefs: [
    {
      targets: -1,
      data: null,
      defaultContent:
        "<div>" +
        '<a class="account-restore button button-small" title="Restore" style="background: transparent;">' +
        '<i uk-icon="icon: history; ratio: 0.9"></i>' +
        "</a>" +
        "</div>",
    },
  ],
});

var accountsToRestore = [];

$("#accounts-table").on("click", "a.account-restore", function () {
  var row = table.row($(this).parents("tr")).data();
  $.get(`/accounts/restore/${row["id"]}`)
    .done(function () {
      table.ajax.reload();
      UIkit.notification({
        message: "Account restored!",
        status: "success",
        pos: "top-right",
      });
    })
    .fail(function (data, textStatus, jqXHR) {
      UIkit.notification({
        message: data.responseJSON.detail,
        status: "danger",
        pos: "top-right",
      });
    });
});

$("#accounts-table").on("change", "input.chck-account-select", function () {
  var row = table.row($(this).parents("tr")).data();
  if (this.checked) {
    accountsToRestore.push(row["id"]);
  } else {
    accountsToRestore = accountsToRestore.filter(function (value, index, arr) {
      return value !== row["id"];
    });
  }
  if(accountsToRestore.length > 0) {
    $('#bttn-restore-many').removeAttr('disabled');
  } else {
    $('#bttn-restore-many').attr('disabled', true);
  }
});

$(document).on("click", "#bttn-restore-many", function () {
  $.ajax({
    type: "POST",
    url: "/accounts/restore",
    data: JSON.stringify(accountsToRestore),
    success: function () {
      table.ajax.reload();
      UIkit.notification({
        message: "Accounts restored!",
        status: "success",
        pos: "top-right",
      });
    },
    error: function (data, textStatus, jqXHR) {
      console.log(data);
      UIkit.notification({
        message: data.responseJSON.detail,
        status: "danger",
        pos: "top-right",
      });
    },
    dataType: "json",
    contentType: "application/json",
  });
});

$(document).ready(function () {
  setInterval(function () {
    table.ajax.reload();
  }, 5000);
});
