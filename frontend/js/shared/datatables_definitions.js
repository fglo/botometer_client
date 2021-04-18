var accountColumns = [
  { data: "id", title: "Id", visible: false, searchable: false },
  {
    title: "",
    searchable: false,
    type: "Boolean",
    render: function (data, type, row) {
      if (accountsSelected.indexOf(row["id"]) != -1) {
        return '<input class="uk-checkbox chck-account-select" type="checkbox" checked>';
      } else {
        return '<input class="uk-checkbox chck-account-select" type="checkbox">';
      }
    },
  },
  { data: "username", title: "Username" },
  { data: "firstname", title: "First Name" },
  { data: "lastname", title: "Last Name" },
  { data: "url", title: "Address" },
  {
    data: "verified",
    title: "Verified",
    render: function (data, type, row) {
      if (data === true) {
        return `<span class="uk-label">${data}</span>`;
      } else {
        return `<span class="uk-label uk-label-warning">${data}</span>`;
      }
    },
  },
  {
    data: "valid",
    title: "Valid",
    render: function (data, type, row) {
      if (row["verified"] === true) {
        if (data === true) {
          return `<span class="uk-label uk-label-success">${data}</span>`;
        } else {
          if (row["last_verification"]["no_timeline"]) {
            return `<span class="uk-label uk-label-warning">No Timeline</span>`;
          } else {
            return `<span class="uk-label uk-label-danger">${data}</span>`;
          }
        }
      } else {
        return "";
      }
    },
  },
  { title: "Actions", orderable: false, className: "uk-grid uk-grid-small" },
];

var verificationColumns = [
  { data: "id", title: "Id", searchable: false },
  { data: "account.username", title: "Username" },
  { data: "screen_name", title: "Screen Name" },
  { data: "id_str", title: "Twitter Account Id" },
  {
    data: "overall",
    title: "overall",
    render: function (data, type, row) {
      if (data === true) {
        return `<span class="uk-label uk-label-danger">${data}</span>`;
      } else {
        if (row["no_timeline"]) {
          return `<span class="uk-label uk-label-warning">No Timeline</span>`;
        } else {
          return `<span class="uk-label">${data}</span>`;
        }
      }
    },
  },
  { data: "date", title: "Verification Date" },
  { data: "verification_result_json", visible: false, searchable: false },
  { title: "Actions", orderable: false, className: "uk-grid uk-grid-small" },
];
