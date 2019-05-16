var tablero = Array()
var tablero_check = Array()
var columna = []
var tiempo_corriendo = null
var puntuacion = 0
var movimientos = 0

$(document).ready(function()
{
    cambio_color()
    llenar_tablero()  
    

    $(".btn-reinicio").on("click", function()
    {
        cronometro()
        if ($(".btn-reinicio").text() == "Reiniciar") 
        {
            jugar();
        }
    })

    $(".imgBox").droppable({
        accept: ".imgBox",
        drop: function(event, ui){
          var imagendrag = $(ui.draggable).find("img").attr("src")
          var imagendrop = $(event.target).find("img").attr("src")
          var clasedrop = $(event.target).find("img").attr("class")
          var clasedrag = $(ui.draggable).find("img").attr("class")
          var coldrag = clasedrag.substr(14,1)
          var fildrag = clasedrag.substr(16,1)
          var coldrop = clasedrop.substr(14,1)
          var fildrop = clasedrop.substr(16,1)
          if ((Math.abs(coldrag-coldrop) <= 1 && fildrag == fildrop) || (Math.abs(fildrag-fildrop) <= 1 && coldrag == coldrop))
          {
            var temp = tablero[coldrop-1][fildrop-1] 
            tablero[coldrop-1][fildrop-1] = tablero[coldrag-1][fildrag-1]
            tablero[coldrag-1][fildrag-1] = temp
            var temp = tablero_check[coldrop-1][fildrop-1] 
            tablero_check[coldrop-1][fildrop-1] = tablero_check[coldrag-1][fildrag-1]
            tablero_check[coldrag-1][fildrag-1] = temp
            $(event.target).find("img").attr("src",imagendrag)
            $(ui.draggable).find("img").attr("src",imagendrop)   
            movimientos +=1
            $("#movimientos-text").text(movimientos)                 
            setTimeout(function()           
            {
                jugar()    
            }, 1000)
        }
        }
      })
});

//con esta funcion se agrupa la verificacion borrado y ordenado para poder ejecutarlas de nuevo 
//en caso de que se encuentren caramelos repetidos
function jugar() 
{
    if ($(".btn-reinicio").text() == "Reiniciar")    
    {
        var v = verificar_items_iguales()
        borrar_iguales()
        ordenar_matriz()
        setTimeout(function() 
        {
            rellenar_matriz()    
        }, 3000)
        setTimeout(function() 
        {
            if (v) 
            {
                jugar()
            }
            else
            {
                $(".imgBox").draggable({disabled: false, revert: true});  
            }
        }, 6500)
    }
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
    $(".panel-score").animate({width:"100%"},{queue : false, duration : 2235})
    $(".end-titulo").slideDown(2000)        
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
            $(".col-"+col).append("<div class= 'imgBox'> <img class='elemento' src='" + "image/" + numero + ".png" + "'> </div>")            
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
            columna[fil-1]=tablero[col-1][fil-1]     
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
                    $(".item-"+col+"-"+fil).parent().fadeOut(500)
                    $(".item-"+col+"-"+fil).parent().fadeIn(500)
                }                    
                $(".item-"+col+"-"+fil).parent().hide(500)                                       
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
                $(".item-"+col+"-"+fil).parent().hide()            
            }
            else
            {
                numero=tablero_check[col-1][fil-1]
                $(".item-"+col+"-"+fil).attr("src","image/" + numero + ".png" ) 
                $(".item-"+col+"-"+fil).parent().show()
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
                animar($(".item-"+col+"-"+fil).parent(),(fil-1))                                          
            }            
        }        
    }

    columna = []
    tablero = Array()
    for (var col=1;col<8;col++)
    {
        for (var fil=1;fil<8;fil++)
        {      
            columna[fil-1]=tablero_check[col-1][fil-1]     
        }
        tablero.push(columna)                
        columna = []
    }
    
}


function animar(elemento,posfinal)
{
    elemento.offset({top: -600})           
    elemento.show()
    elemento.animate({top:posfinal},2500)       
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
            setTimeout(function() 
            {
                location.reload()    
            }, 7000)     
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
        movimientos = 0
        $("#movimientos-text").text(0) 
        $("#score-text").text(0)           
        fin = false
    }

}