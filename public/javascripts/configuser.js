document.forms.FConfig.addEventListener("submit", function(evt){
    evt.preventDefault();
    var data = {};
    data = {
        nombre: document.forms.FConfig.nombre.value,
        //password: document.forms.FConfig.password.value
    }
    fetch('/users/config/'+document.forms.FConfig.id.value, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            alert('Cambios realizados');
        });
});