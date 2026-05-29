(function () {
  if (!localStorage.getItem('currentUser')) {
    window.location.replace('signin.html');
  }
})();
