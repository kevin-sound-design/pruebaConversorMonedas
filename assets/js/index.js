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
        const span = document.querySelector(".estadoInicial");
        span.classList.add("error")
        span.innerHTML = `A ocurrido el siguiente error: ${error.message}`
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

/* Grafica */

const tipoMonedas = document.querySelector("#conversor");
renderGrafica("dolar");
tipoMonedas.addEventListener("change", ()=>{
    const tipoMoneda = tipoMonedas.options[tipoMonedas.selectedIndex].text;
    if(tipoMoneda === "dolar"){
        renderGrafica("dolar");
    }else if(tipoMoneda === "euro"){
        renderGrafica("euro");
    }else if(tipoMoneda === "uf"){
        renderGrafica("uf");
    }
});

async function verificadorDeMoneda(tipoMoneda){
    if(tipoMoneda === "dolar"){
        const info = await getMoneyGrafica("https://mindicador.cl/api/dolar")
        return info;
    }else if(tipoMoneda === "euro"){
        const info = await getMoneyGrafica("https://mindicador.cl/api/euro")
        return info;   
    }else if(tipoMoneda === "uf"){
        const info = await getMoneyGrafica("https://mindicador.cl/api/uf")
        return info;   
    }


}

async function getMoneyGrafica(url){
    try{
        const request = await fetch(url);
        const info = await request.json();
        return info;
    }catch(error){
        const span = document.querySelector(".estadoInicial");
        span.classList.add("error")
        span.innerHTML = `A ocurrido el siguiente error: ${error.message}`
    }
  
}

function formateadorDeFechas(fechas){
    const fechaOriginal = new Date(fechas);
    const opcionesDeFormato = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
    };

    const fechaFormateada = fechaOriginal.toLocaleString('es-ES',               opcionesDeFormato);
    return fechaFormateada;
}

function configuracionGrafica(info){
    const arrayInfo = info.serie;
    const tipoDeGrafica = "line";
    const titulo = `Historial últimos 10 días (${info.codigo})`;
    const colorDeLinea = "red";
    const valores = [
        arrayInfo[9].valor,
        arrayInfo[8].valor,
        arrayInfo[7].valor,
        arrayInfo[6].valor,
        arrayInfo[5].valor,
        arrayInfo[4].valor,
        arrayInfo[3].valor,
        arrayInfo[2].valor,
        arrayInfo[1].valor,
        arrayInfo[0].valor,
    ];
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: [
                formateadorDeFechas(arrayInfo[9].fecha),
                formateadorDeFechas(arrayInfo[8].fecha),
                formateadorDeFechas(arrayInfo[7].fecha),
                formateadorDeFechas(arrayInfo[6].fecha),
                formateadorDeFechas(arrayInfo[5].fecha),
                formateadorDeFechas(arrayInfo[4].fecha),
                formateadorDeFechas(arrayInfo[3].fecha),
                formateadorDeFechas(arrayInfo[2].fecha),
                formateadorDeFechas(arrayInfo[1].fecha),
                formateadorDeFechas(arrayInfo[0].fecha),
            ],
            datasets:[
                {
                    label:titulo,
                    backgroundColor:colorDeLinea,
                    data:valores
                }
            ]
        }
        
    };
    return config;
}

async function renderGrafica(tipoMoneda){
    const info = await verificadorDeMoneda(tipoMoneda);
    const config = configuracionGrafica(info);
    const chartDOM = document.querySelector("#myChart");
    const existingChart = Chart.getChart("myChart");
    if (existingChart) {
        existingChart.destroy();
      }
    new Chart(chartDOM, config);  
}






    


    








