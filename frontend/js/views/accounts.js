var account_id = 0;
var account_url = 'https://twitter.com/home';

var table = $("#accounts-table").DataTable({
  ajax: {
    url: "/accounts/getall",
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
        '<div class="uk-width-1-3">' +
        '<a class="account-verify" uk-tootlip="Verify" style="background: transparent;">' +
        '<i uk-icon="icon: cog; ratio: 0.9"></i>' +
        "</a>" +
        "</div>" +
        '<div class="uk-width-1-3">' +
        '<a class="account-details" uk-tootlip="Details" style="background: transparent;">' +
        '<i uk-icon="icon: search; ratio: 0.9"></i>' +
        "</a>" +
        "</div>" +
        '<div class="uk-width-1-3">' +
        '<a class="account-delete" uk-tootlip="Delete" style="background: transparent;">' +
        '<i uk-icon="icon: trash; ratio: 0.9"></i>' +
        "</a>" +
        "</div>",
    },
  ],
});

var accountsSelected = [];

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

$("#accounts-table").on("click", "a.account-delete", function () {
  var row = table.row($(this).parents("tr")).data();
  $.get(`/accounts/archive/${row["id"]}`)
    .done(function () {
      table.ajax.reload(null, false);
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
    accountsSelected.push(row["id"]);
  } else {
    accountsSelected = accountsSelected.filter(function (value, index, arr) {
      return value !== row["id"];
    });
  }
  if (accountsSelected.length > 0) {
    $("#bttn-verify-many").removeAttr("disabled");
  } else {
    $("#bttn-verify-many").attr("disabled", true);
  }
});

$(document).on("click", "#bttn-verify-many", function () {
  $.ajax({
    type: "POST",
    url: "/accounts/verify",
    data: JSON.stringify(accountsSelected),
    success: function () {
      table.ajax.reload(null, false);
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

function isTwitterHandle(handle) { 
  if (handle.match(/^((https?:\/\/)?(www\.)?twitter\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})$/i)) 
    return true;
  return false;
}

var urlObj = $("#form-add-account #url");
var usernameObj = $("#form-add-account #username");

urlObj.on("input", function () {
  $(this).removeClass("uk-form-danger");
});

urlObj.change(function () {
  let address = $(this).val();
  if (isTwitterHandle(address)) {
    var url = new URL(address);
    usernameObj.val(url.pathname.substring(1));
  }
});

usernameObj.on("input", function () {
  $(this).removeClass("uk-form-danger");
});

$(document).on("click", "#bttn-add-account", function () {
  var error = false;
  urlObj.removeClass("uk-form-danger");
  let url = urlObj.val();
  if (!isTwitterHandle(url)) {
    urlObj.addClass("uk-form-danger");
    error = true;
    UIkit.notification({
      message: "Entered Account Addres is not a valid twitter handle url. The expected format: https://twitter.com/twitteraccountname",
      status: "danger",
      pos: "top-right",
    });
  }
  usernameObj.removeClass("uk-form-danger");
  let username = usernameObj.val();
  if (!username.match(/^@?[A-Za-z0-9_]{1,20}$/i)) {
    usernameObj.addClass("uk-form-danger");
    error = true;
    UIkit.notification({
      message: "Entered Account Name is not a valid twitter handle. Twitter handle can't be longer than 15 characters and can't contain characters other than alphanumerical and underscores.",
      status: "danger",
      pos: "top-right",
    });
  }
  if (error == true) {
    return;
  }

  $.ajax({
    type: "POST",
    url: "/accounts/add",
    data: getFormData($("#form-add-account")),
    success: function () {
      table.ajax.reload(null, false);
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
  $("#navbar-item-accounts").addClass("uk-active");

  setInterval(function () {
    table.ajax.reload(null, false);
  }, 5000);
});
