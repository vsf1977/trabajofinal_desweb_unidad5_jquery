var tablero = Array()
var columna = []
var tiempo_corriendo = null

$(document).ready(function()
{
    cambio_color()
    llenar_tablero()
    //console.log(tablero[5][5])
    $(".btn-reinicio").on("click", function(){
        cronometro()
    })


});

function cambio_color()
{
    var letrero = $(".main-titulo")
    letrero
    .animate({color:"blue"}
    , 5000);
    letrero    
    .animate({color:"yellow"}
    , 5000,cambio_color);
}


function llenar_tablero()
{        
    for (var j=1;j<8;j++)
    {
        for (var i=1;i<8;i++)
        {      
            var numero = Math.floor((Math.random() * 4) + 1)            
            if (i < 8)
            {
                columna[i-1]=numero
            }
            $(".col-"+j).append("<img class='elemento' src='" + "image/" + numero + ".png" + "'>")            
            $(".elemento").last().addClass(j+","+i)
            $(".elemento").last().hide()
            $(".elemento").last().show("slow")
            
        }
        tablero.push(columna)
        columna = []
    }
}

function limpiar_tablero()
{        
    for (var j=1;j<8;j++)
    {
        $(".col-"+j).empty()
    }
    $(score-text).text("0")
    $(movimientos-text).text("0")
}


function cronometro()
{
    var texto = ""
    var fin = false
    
    var pant = $("#timer")
        
    if ($(".btn-reinicio").text() == "Iniciar")
    {
        $(".btn-reinicio").text("Reiniciar")

        var tiempo = 
        {        
            minuto: 1,
            segundo: 60
        }
        
        tiempo_corriendo = setInterval(function(){
        
        if (tiempo.segundo > 0)
        {
            tiempo.segundo--
        }      
        else
        {
            tiempo.segundo = 59
            tiempo.minuto--;
        }

        texto = '0' + tiempo.minuto + ":"
        texto += tiempo.segundo < 10 ? '0' + tiempo.segundo : tiempo.segundo
        if  (tiempo.segundo == 0 && tiempo.minuto == 0)
        {
            fin = true
            pant.text("00:00")        
            $(".btn-reinicio").text("Iniciar")
            clearInterval(tiempo_corriendo)            
        }
        if (!fin)
        {
            pant.text(texto)
        }
        }, 50);
    }
    else
    {
        $(".btn-reinicio").text("Iniciar")        
        pant.text("02:00")
        clearInterval(tiempo_corriendo)
        tiempo_corriendo = null
        limpiar_tablero()
        llenar_tablero()
    }

}