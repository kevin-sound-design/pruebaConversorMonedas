const form = document.querySelector("form");
form.addEventListener("submit", formData);
/**
 * 
 * @param {Event} e 
 */
function formData(e){
    e.preventDefault();
    const data = new FormData(form);
    const clp = data.get("CLP");
    const moneda = data.get("Moneda");
    const conversor = document.querySelector("#conversor");
    const tipoMonedas = conversor.options[conversor.selectedIndex].text;  
    switch(tipoMonedas){
        case "dolar":
            conversionMoneda(clp,moneda,"$");
            break;
        case "euro":
            conversionMoneda(clp,moneda,"€");
            break;
        case "uf":
            conversionMoneda(clp,moneda,"(UF)");
            break;    
    }
}

function conversionMoneda (clp,moneda,tipoMonedas){
    const respuesta = document.querySelector(".resultado");
    respuesta.innerHTML = "Resultado:"
    if(clp <= 0){
        alert("ingresa un valor");
    }else{
        resultado = clp / moneda;
        let resultadoRedondeado = resultado.toFixed(2);
        respuesta.innerHTML+=`
        ${tipoMonedas}  ${resultadoRedondeado}`
    }
}

async function getAllMoney(){
    try{
        const request = await fetch("https://mindicador.cl/api/");
        const data = await request.json();
        return data;
    }catch(error){
        const span = document.createElement("span");
        const div = document.querySelector(".conversorMonedas");
        div.classList.add("error");
        div.appendChild(span);
        span.innerHTML = error.message;
    }
}

async function renderizarDatos(){
    const monedas = await getAllMoney();
    const dolar = document.createElement("option");
    const euro = document.createElement("option");
    const uf = document.createElement("option");
    dolar.innerHTML = monedas.dolar.codigo;
    euro.innerHTML = monedas.euro.codigo;
    uf.innerHTML = monedas.uf.codigo;
    dolar.value = monedas.dolar.valor;
    euro.value = monedas.euro.valor;
    uf.value = monedas.uf.valor;
    const select = document.querySelector("select");
    select.appendChild(dolar);
    select.appendChild(euro);
    select.appendChild(uf);
}

renderizarDatos();









