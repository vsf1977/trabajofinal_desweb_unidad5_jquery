var tablero = Array()
var tablero_check = Array()
var columna = []
var tiempo_corriendo = null
var puntuacion = 0

$(document).ready(function()
{
    cambio_color()
    llenar_tablero()       
    
    $(".btn-reinicio").on("click", function(){
        cronometro()
        verificar_items_iguales()
        borrar_iguales()
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



function animacion_fin_coluego()
{ 
    $(".panel-tablero").hide(2000)

    $(".panel-score").animate({width:"100%"},{queue : true, duration : 2235})

}


function animacion_inicio_coluego()
{
        
    $(".panel-tablero").toggle( "slide",2000)
    $(".panel-score").animate({width:"25%"},{queue : true, duration : 2200})    
}



function llenar_tablero()
{        
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            var numero = Math.floor((Math.random() * 4) + 1)            
            if (fil < 8)
            {
                columna[fil-1]=numero     
            }
            $(".col-"+col).append("<img class='elemento' src='" + "image/" + numero + ".png" + "'>")            
            $(".elemento").last().addClass("item-"+col+"-"+fil)
            $(".elemento").last().hide()
            $(".elemento").last().show("slow")
            
        }
        tablero.push(columna)                
        columna = []
    }

    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            if (fil < 8)
            {
                columna[fil-1]=tablero[col-1][fil-1]     
            }           
        }
        tablero_check.push(columna)                
        columna = []
    }

}


function verificar_items_iguales()
{   
    
    for (var col=0;col<7;col++)
    {
        for (var fil=1;fil<7;fil++)
        {          
            if ((tablero[col][fil] == tablero[col][fil+1]) && (tablero[col][fil] == tablero[col][fil-1]))
            {
                tablero_check[col][fil] = 0                                
                tablero_check[col][fil+1] = 0                                
                tablero_check[col][fil-1] = 0                                
            }
        }
    }    

    for (var fil=0;fil<7;fil++)
    {
        for (var col=1;col<6;col++)
        {          
            if ((tablero[col][fil] == tablero[col+1][fil]) && (tablero[col][fil] == tablero[col-1][fil]))
            {
                tablero_check[col][fil] = 0                                
                tablero_check[col+1][fil] = 0                                
                tablero_check[col-1][fil] = 0                                
            }
        }
    }     
}


function borrar_iguales()
{
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            if (fil < 8)
            {
                if (tablero_check[col-1][fil-1] == 0)
                {                    
                    for (var x=1;x<4;x++)
                    {
                        $(".item-"+col+"-"+fil).fadeOut(200)
                        $(".item-"+col+"-"+fil).fadeIn(200)
                    }                    
                    $(".item-"+col+"-"+fil).hide(500)
                    puntuacion = puntuacion + 10;
                    $("#score-text").text(puntuacion)                   
                }
            }           
        }
    }
}


function animacion_limpiar_tablero()
{        
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            $("."+col+"-"+fil).hide(1000)            
        }
    }    
}




function limpiar_tablero()
{        
    for (var col=1;col<8;col++)
    {
        $(".col-"+col).empty()
    }
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
            limpiar_tablero()
            animacion_fin_coluego()       
            //setTimeout(animacion_fin_coluego(),6000)
            //var v = setTimeout(animacion_inicio_coluego(),60000)
            //clearTimeout(v);
        }
        if (!fin)
        {
            pant.text(texto)
        }
        }, 1000);
    }
    else
    {
        $(".btn-reinicio").text("Iniciar")        
        pant.text("02:00")
        clearInterval(tiempo_corriendo)
        tiempo_corriendo = null
        limpiar_tablero()
        llenar_tablero()
        fin = false
    }

}
