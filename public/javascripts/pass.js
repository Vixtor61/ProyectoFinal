window.onload = function() {
  let password = document.getElementById("passwordr");
  let confirm_password = document.getElementById("cpass");
  function validatePassword(){
    if(password.value != confirm_password.value){confirm_password.setCustomValidity("Passwords Don't Match");} 
    else{confirm_password.setCustomValidity('');}
  }
confirm_password.onkeyup = validatePassword;
password.onkeyup = validatePassword;
};
    