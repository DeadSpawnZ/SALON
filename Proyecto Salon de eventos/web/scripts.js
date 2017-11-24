function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

var contador = 0;
function drop(ev){
    var elemntID = ev.dataTransfer.getData("text");
    if(!elemntID.includes("Clon")){
        ev.preventDefault();
        var elementoArrastrado = document.getElementById(elemntID);
        var elementoClonado = elementoArrastrado.cloneNode(true);
        var idclon = "Clon"+(contador++);
        elementoClonado.id = idclon;
        ev.target.appendChild(elementoClonado);
        if(elemntID.includes("mesa")){
            document.getElementById(idclon).setAttribute("ondblclick", "tooltip(this)");
        }
        
        posiciona(idclon, ev.target.id, ev);
    }else{
        var elementoArrastrado = document.getElementById(elemntID);
        ev.preventDefault();
        ev.target.appendChild(elementoArrastrado);

        posiciona(elemntID, ev.target.id, ev);
    }
}

var muebles = [];
function posiciona(idElemento, targetOP, ev){
    var tamContX, tamContY, tamElemX, tamElemY, posXCont, posYCont, x, y;
    tamContX = $("#"+targetOP).width();
    tamContY = $("#"+targetOP).height();

    tamElemX = $("#"+idElemento).width();
    tamElemY = $("#"+idElemento).height();

    posXCont = $("#"+targetOP).position().left;
    posYCont = $("#"+targetOP).position().top;

    // Posicion absoluta del raton
    x = ev.layerX;
    y = ev.layerY;

    // Si parte del elemento que se quiere mover se queda fuera se cambia las coordenadas para que no sea asi
    if(posXCont+tamContX <= x+tamElemX){
        x = posXCont+tamContX-tamElemX;
    }

    if(posYCont+tamContY <= y+tamElemY){
        y = posYCont+tamContY-tamElemY;
    }
    var mueble = {
        x: 0,
        y: 0,
        id: "",
        tipo: ""
    };
    mueble.x = x;
    mueble.y = y;
    mueble.id = idElemento;
    mueble.tipo = document.getElementById(idElemento).getAttribute("class");
    revisa_y_agrega(mueble);

    document.getElementById(idElemento).style.position = "absolute";
    document.getElementById(idElemento).style.left = x + "px";
    document.getElementById(idElemento).style.top = y + "px";
}

function revisa_y_agrega(mueble){
    if(muebles.length > 0){
        var bomba = false;
        for(var i = 0; i < muebles.length; i++){
            if(muebles[i].id === mueble.id){
                bomba = true;
            }
        }
        if(!bomba){
            muebles.push(mueble);
            console.log(muebles);
        }else{
            //cuando mueven uno que ya existe
        }
    }else{
        muebles.push(mueble);
    }
}

function tooltip(elem){
    var tooltip = document.createElement("textarea");
    tooltip.setAttribute("rows","7");
    tooltip.setAttribute("cols","20");
    tooltip.setAttribute("placeholder", "Escribe un invitado por linea");
    tooltip.setAttribute("class","tooltip");
    document.getElementById(elem.id).appendChild(tooltip);
    
}