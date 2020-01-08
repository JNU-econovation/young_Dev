function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  // console.log("Full Name: " + profile.getName());
  // console.log("Given Name: " + profile.getGivenName());
  // console.log("Family Name: " + profile.getFamilyName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  // var id_token = googleUser.getAuthResponse().id_token;
  // console.log("ID Token: " + id_token);

  axios
    .post("/", {
      login_state: true,
      user_email: profile.getEmail(),
      user_name: profile.getName()
    })
    .then(function(result) {
      //   if (result.status === 200) window.location.href = "/";
    })
    .catch(function(error) {
      alert(error.message);
    });
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
    auth2.disconnect(); // <!-- 자동로그인 방지 -->
  });
  function onLoad() {
    gapi.load("auth2", function() {
      gapi.auth2.init();
    });
  }
  axios
    .post("/logout", {
      login_state: false,
      user_email: null,
      user_name: null
    })
    .then(function(result) {
      if (result.status === 200) window.location.href = "/";
    })
    .catch(function(error) {
      alert(error.message);
    });
}
