var account_id = 0;
var account_url = 'https://twitter.com/home';

var table = $("#accounts-table").DataTable({
  ajax: {
    url: "/accounts/getallarchived",
    dataSrc: "",
  },
  stateSave: true,
  order: [[0, "asc"]],
  responsive: true,
  columns: accountColumns,
  columnDefs: [
    {
      targets: -1,
      data: null,
      defaultContent:
        '<div>' +
        '<a class="account-details" uk-tootlip="Details" style="background: transparent;">' +
        '<i uk-icon="icon: search; ratio: 0.9"></i>' +
        "</a>" +
        "</div>" +
        "<div>" +
        '<a class="account-restore button button-small" uk-tootlip="Restore" style="background: transparent;">' +
        '<i uk-icon="icon: history; ratio: 0.9"></i>' +
        "</a>" +
        "</div>",
    },
  ],
});

var accountsSelected = [];

$("#accounts-table").on("click", "a.account-restore", function () {
  var row = table.row($(this).parents("tr")).data();
  $.get(`/accounts/restore/${row["id"]}`)
    .done(function () {
      table.ajax.reload(null, false);
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

$("#accounts-table").on("click", "a.account-details", function () {
  var row = table.row($(this).parents("tr")).data();
  account_id = row["id"];
  if (row["verified"] === false) {
    UIkit.notification({
      message: "The account hasn't been verified yet.",
      status: "danger",
      pos: "top-right",
    });
    return;
  }
  get_account_details(account_id);
});

$("#accounts-table").on("change", "input.chck-account-select", function () {
  var row = table.row($(this).parents("tr")).data();
  if (this.checked) {
    accountsSelected.push(row["id"]);
  } else {
    accountsSelected = accountsSelected.filter(function (value, index, arr) {
      return value !== row["id"];
    });
  }
  if (accountsSelected.length > 0) {
    $("#bttn-restore-many").removeAttr("disabled");
  } else {
    $("#bttn-restore-many").attr("disabled", true);
  }
});

$(document).on("click", "#bttn-restore-many", function () {
  $.ajax({
    type: "POST",
    url: "/accounts/restore",
    data: JSON.stringify(accountsSelected),
    success: function () {
      table.ajax.reload(null, false);
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
  $("#navbar-item-archive").addClass("uk-active");

  setInterval(function () {
    table.ajax.reload(null, false);
  }, 5000);
});
