var tablero = Array()
var tablero_check = Array()
var columna = []
var tiempo_corriendo = null
var puntuacion = 0

$(document).ready(function()
{
    cambio_color()
    llenar_tablero()       
    
    $(".btn-reinicio").on("click", function()
    {
        cronometro()
        if ($(".btn-reinicio").text() == "Reiniciar") 
        {
            eliminarCaramelos();
        }
    })
});

//con esta funcion se agrupa la verificacion borrado y ordenado para poder ejecutarlas de nuevo 
//en caso de que se encuentren caramelos repetidos
function eliminarCaramelos() 
{
    verificar_items_iguales()
    borrar_iguales()
    ordenar_matriz()
    setTimeout(function() {
        rellenar_matriz()
            //elimiarCaramelos()
    }, 3000)
    setTimeout(function() 
    {
        if (verificar_items_iguales()) 
        {
            eliminarCaramelos()
            console.log('de nuevo');
        }
    }, 6500)
}



//para cambiar el color del titulo indefinidamente
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


//animacion cuando se acaba el juego por tiempo
function animacion_fin_juego()
{ 
    $(".panel-tablero").hide(2000)

    $(".panel-score").animate({width:"100%"},{queue : true, duration : 2235})

}


function animacion_inicio_juego()
{
        
    $(".panel-tablero").toggle( "slide",2000)
    $(".panel-score").animate({width:"25%"},{queue : true, duration : 2200})    
}


//aleatoriamente se escogen las imagenes y se cargan. En paralelo hay una matriz con los numeros de las imagenes
function llenar_tablero()
{        
    tablero = Array()
    tablero_check = Array()
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            var numero = Math.floor((Math.random() * 4) + 1)            
            columna[fil-1]=numero     
            $(".col-"+col).append("<img class='elemento' src='" + "image/" + numero + ".png" + "'>")            
            $(".elemento").last().addClass("item-"+col+"-"+fil)
            $(".elemento").last().hide()
            $(".elemento").last().show("slow")
            
        }
        tablero.push(columna)                
        columna = []
    }
    
    //copia de la matriz para calculos
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

//verifica items iguales y coloca cero para esconder las imagenes
function verificar_items_iguales()
{       
    var aux = false
    for (var col=0;col<7;col++)
    {
        for (var fil=1;fil<6;fil++)
        {          
            if (tablero[col][fil] == tablero[col][fil+1] && tablero[col][fil] == tablero[col][fil-1])
            {
                tablero_check[col][fil] = 0                                
                tablero_check[col][fil+1] = 0                                
                tablero_check[col][fil-1] = 0   
                aux = true                             
            }
        }
    }    

    for (var fil=0;fil<7;fil++)
    {
        for (var col=1;col<6;col++)
        {          
            if (tablero[col][fil] == tablero[col+1][fil] && tablero[col][fil] == tablero[col-1][fil])
            {
                tablero_check[col][fil] = 0                                
                tablero_check[col+1][fil] = 0                                
                tablero_check[col-1][fil] = 0  
                aux = true                  
            }
        }
    } 
    return aux 
}

//si la celda de la matriz es cero, esconde su correspondiente en el tablero HTML
function borrar_iguales()
{
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            if (tablero_check[col-1][fil-1] == 0)
            {                    
                for (var x=1;x<3;x++)
                {
                    $(".item-"+col+"-"+fil).fadeOut(500)
                    $(".item-"+col+"-"+fil).fadeIn(500)
                }                    
                $(".item-"+col+"-"+fil).hide(500)                                       
                puntuacion = puntuacion + 10;
                $("#score-text").text(puntuacion)                   
            }                
        }
    }   
}


//para que los valores que son ceros(dulces borrados) queden arriba y poder colocar items en su lugar
function ordenar_matriz()
{
    var temp = 0
    var sw = true
    var fil = 2    
    for (var col=1;col<8;col++)
    {
        sw = true
        while (sw)
        {
            sw = false
            for (var fil=2;fil<8;fil++)
            {      
                if (tablero_check[col-1][fil-1] == 0 && tablero_check[col-1][fil-2] > 0)
                {     
                    temp = tablero_check[col-1][fil-1]
                    tablero_check[col-1][fil-1] = tablero_check[col-1][fil-2]
                    tablero_check[col-1][fil-2] = temp
                    sw = true
                }
            }
        }
    }
    tablero=tablero_check
}

//nuevas figuras en los espacios en blanco(ceros en la matriz)

function rellenar_matriz()
{    
    var numero = 0
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            if (tablero_check[col-1][fil-1] == 0)
            {  
                $(".item-"+col+"-"+fil).hide()            
            }
            else
            {
                numero=tablero_check[col-1][fil-1]
                $(".item-"+col+"-"+fil).attr("src","image/" + numero + ".png" ) 
                $(".item-"+col+"-"+fil).show()
            }
        }
    }
    
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            if (tablero_check[col-1][fil-1] == 0)
            {  
                numero = Math.floor((Math.random() * 4) + 1)            
                tablero_check[col-1][fil-1]=numero   
                $(".item-"+col+"-"+fil).attr("src","image/" + numero + ".png" )    
                animar($(".item-"+col+"-"+fil),(fil-1))                                          
            }            
        }        
    }
}


function animar(elemento,posfinal)
{
    elemento.offset({top: -600})           
    elemento.show()
    elemento.animate({top:posfinal},2500)       
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
            animacion_fin_juego()       
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
        puntuacion = 0
        $("#score-text").text(0)           
        fin = false
    }

}