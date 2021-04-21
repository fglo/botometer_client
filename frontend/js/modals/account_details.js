$("#bttn-show-verifications").click(function () {
  window.location.href = `/views/verifications?account_id=${account_id}`;
});

$("#bttn-show-account").click(function () {
  window.open(account_url,'_blank');
});

function addLabelInAccountDetails(label, value) {
  value = Boolean(value);
  label.removeClass("uk-label-danger");
  label.html(String(value));
  if (value === true) {
    label.addClass("uk-label-danger");
  }
}

function get_account_details(acc_id) {
  $.get(`/accounts/get/${acc_id}`)
    .done(function (data) {
      account_url = data['url'];

      var modal = $("#modal-account-details");
      $("#username", modal).html(data["username"]);
      $("#url", modal).html(data["url"]);
      $("#firstname", modal).html(data["firstname"]);
      $("#lastname", modal).html(data["lastname"]);
      $("#last-verification", modal).html(data["last_verification"]["date"]);

      var last_verification = data["last_verification"];

      if (last_verification["no_timeline"] === true) {
        $("#bot-table", modal).hide();
        $("#no-timeline-table", modal).show();
        $("#account_doesnt_exist-table", modal).hide();

        let label = $("#bot-no-timeline", modal);
        label.removeClass("uk-label-warning");
        label.html(last_verification["no_timeline"]);
        if (last_verification["no_timeline"] === true) {
          label.addClass("uk-label-warning");
        }
      } else if (last_verification["account_doesnt_exist"] === true) {
        $("#bot-table", modal).hide();
        $("#no-timeline-table", modal).hide();
        $("#account_doesnt_exist-table", modal).show();

        let label = $("#bot-account_doesnt_exist", modal);
        label.removeClass("uk-label-warning");
        label.html(last_verification["account_doesnt_exist"]);
        if (last_verification["account_doesnt_exist"] === true) {
          label.addClass("uk-label-warning");
        }
      } else {
        $("#bot-table", modal).show();
        $("#no-timeline-table", modal).hide();
        $("#account_doesnt_exist-table", modal).hide();

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
}