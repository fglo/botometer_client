var table = $("#accounts-table").DataTable({
  ajax: {
    url: "/accounts/getall",
    dataSrc: "",
  },
  order: [[0, "asc"]],
  responsive: true,
  columns: accountColumns,
  columnDefs: [
    {
      targets: -1,
      data: null,
      defaultContent:
        '<div class="uk-width-1-3">' +
        '<a class="account-verify" title="Verify" style="background: transparent;">' +
        '<i uk-icon="icon: cog; ratio: 0.9"></i>' +
        "</a>" +
        "</div>" +
        '<div class="uk-width-1-3">' +
        '<a class="account-edit" title="Edit" style="background: transparent;">' +
        '<i uk-icon="icon: pencil; ratio: 0.9"></i>' +
        "</a>" +
        "</div>" +
        '<div class="uk-width-1-3">' +
        '<a class="account-delete" title="Delete" style="background: transparent;">' +
        '<i uk-icon="icon: trash; ratio: 0.9"></i>' +
        "</a>" +
        "</div>",
    },
  ],
});

var accountsToVerify = [];

$("#accounts-table").on("click", "a.account-verify", function () {
  var row = table.row($(this).parents("tr")).data();
  $.get(`/accounts/verify/${row["id"]}`)
    .done(function () {
      UIkit.notification({
        message: "Verification started!",
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

$("#accounts-table").on("click", "a.account-edit", function () {
  var row = table.row($(this).parents("tr")).data();
  window.location.href = `/accounts/edit/${row["id"]}`;
});

$("#accounts-table").on("click", "a.account-delete", function () {
  var row = table.row($(this).parents("tr")).data();
  $.get(`/accounts/archive/${row["id"]}`)
    .done(function () {
      table.ajax.reload();
      UIkit.notification({
        message: "Account archived!",
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
    accountsToVerify.push(row["id"]);
  } else {
    accountsToVerify = accountsToVerify.filter(function (value, index, arr) {
      return value !== row["id"];
    });
  }
  if (accountsToVerify.length > 0) {
    $("#bttn-verify-many").removeAttr("disabled");
  } else {
    $("#bttn-verify-many").attr("disabled", true);
  }
});

$(document).on("click", "#bttn-verify-many", function () {
  $.ajax({
    type: "POST",
    url: "/accounts/verify",
    data: JSON.stringify(accountsToVerify),
    success: function () {
      table.ajax.reload();
      UIkit.notification({
        message: "Verification started!",
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

$(document).on("click", "#bttn-add-account", function () {
  $.ajax({
    type: "POST",
    url: "/accounts/add",
    data: getFormData($("#form-add-account")),
    success: function () {
      table.ajax.reload();
      UIkit.notification({
        message: "Adding was successfull!",
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

function getFormData($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n["name"]] = n["value"];
  });

  return JSON.stringify(indexed_array);
}

$(document).ready(function () {
  setInterval(function () {
    table.ajax.reload();
  }, 5000);
});
