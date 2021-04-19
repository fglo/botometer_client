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
  if (row["verified"] === false) {
    UIkit.notification({
      message: "The account hasn't been verified yet.",
      status: "danger",
      pos: "top-right",
    });
    return;
  }

  $.get(`/accounts/get/${row["id"]}`)
    .done(function (data) {
      console.log(data);
      var modal = $("#modal-account-details");
      $("#username", modal).html(data["username"]);
      $("#url", modal).html(data["url"]);
      $("#firstname", modal).html(data["firstname"]);
      $("#lastname", modal).html(data["lastname"]);
      $("#last-verification", modal).html(data["last_verification"]["date"]);

      var last_verification = data["last_verification"];

      if (last_verification["no_timeline"] !== true) {
        $("#bot-table", modal).show();
        $("#no-timeline-table", modal).hide();

        addLabelInAccountDetails(
          $("#bot-overall", modal),
          data["last_verification"]["overall"]
        );
        addLabelInAccountDetails(
          $("#bot-fake-follower", modal),
          data["last_verification"]["fake_follower"]
        );
        addLabelInAccountDetails(
          $("#bot-self-declared", modal),
          data["last_verification"]["self_declared"]
        );
        addLabelInAccountDetails(
          $("#bot-astroturf", modal),
          data["last_verification"]["astroturf"]
        );
        addLabelInAccountDetails(
          $("#bot-spammer", modal),
          data["last_verification"]["spammer"]
        );
        addLabelInAccountDetails(
          $("#bot-financial", modal),
          data["last_verification"]["financial"]
        );
        addLabelInAccountDetails(
          $("#bot-other", modal),
          data["last_verification"]["other"]
        );
      } else {
        $("#bot-table", modal).hide();
        $("#no-timeline-table", modal).show();

        let label = $("#bot-no-timeline", modal);
        label.removeClass("uk-label-warning");
        label.html(last_verification["no_timeline"]);
        if (last_verification["no_timeline"] === true) {
          label.addClass("uk-label-warning");
        }
      }
      UIkit.modal(modal).show();
    })
    .fail(function (data, textStatus, jqXHR) {
      UIkit.notification({
        message: data.responseJSON.detail,
        status: "danger",
        pos: "top-right",
      });
    });
});

function addLabelInAccountDetails(label, value) {
  value = Boolean(value);
  label.removeClass("uk-label-danger");
  label.html(String(value));
  if (value === true) {
    label.addClass("uk-label-danger");
  }
}

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
  $("#navbar-item-accounts").addClass("uk-active");

  setInterval(function () {
    table.ajax.reload();
  }, 5000);
});
