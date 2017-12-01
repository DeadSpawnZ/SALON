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
    tooltip.setAttribute("onBlur","unfocus(this)");
    tooltip.setAttribute("id",elem.id+"tool");
    document.getElementById(elem.id).appendChild(tooltip);
}
function unfocus(elem){
    var content = elem.value;
    
    elem.style.display = "none";
}


var db;
window.onload = function(){
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function(tx){
        //tx.executeSql('drop table USUARIO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USUARIO(nombre TEXT, contra TEXT)');
    });
    db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENTO(ide INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT,eventoo TEXT,FOREIGN KEY (nombre) REFERENCES USUARIO (nombre))');
    });
    
    db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS DIST(ide INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT,x INTEGER,y INTEGER,tipo TEXT,elem_id TEXT,FOREIGN KEY (nombre) REFERENCES USUARIO (nombre))');
    });
    
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM EVENTO WHERE nombre=?', [sessionStorage.getItem('usuario')], function (tx, results) {
            var len = results.rows.length, i;
            if(len > 0){
                alert("si hay");
                var select = document.getElementById("eventos_guardados");
                for(i = 0; i < len; i++){
                    var option = document.createElement("option");
                    option.setAttribute("id", results.rows.item(i).eventoo);
                    option.innerHTML = results.rows.item(i).eventoo;
                    select.appendChild(option);
                }
            }else{
                alert("Tu usuario aún no tiene eventos guardados");
            }
        }, null);
    });
    
    
};

function guarda_evento(){
    var tipo_evento = document.getElementById("tipo_de_evento").value;
    var fecha = document.getElementById("fecha").value; 
    var hora = document.getElementById("hora").value;
    var nombre = document.getElementById("n_evento").value;
    db.transaction(function(tx){
        tx.executeSql("INSERT INTO EVENTO(nombre,eventoo) VALUES (?,?)", [sessionStorage.getItem('usuario'), nombre]);
    });
    db.transaction(function(tx){
        for(var i = 0; i < muebles.length; i++){
            console.log(muebles[i].x+" "+muebles[i].tipo+" "+muebles[i].id);
            tx.executeSql("INSERT INTO DIST(nombre,x,y,tipo,elem_id) VALUES (?,?,?,?,?)", [sessionStorage.getItem('usuario'), muebles[i].x, muebles[i].y, muebles[i].tipo, muebles[i].id]);
        }
    });
}

function reserva_evento(){
    alert("gg está reservado :)");
}

function carga_evento(){
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM DIST INNER JOIN USUARIO WHERE DIST.nombre = USUARIO.nombre AND DIST.nombre=?', [sessionStorage.getItem('usuario')], function (tx, results) {
            var len = results.rows.length;
            if(len > 0){
                //CREAR LOS MUEBLES DINAMICAMENTE
                for(var i = 0; i < len; i++){
                    var img = document.createElement("img");
                    img.setAttribute("class","no-drag");
                    img.setAttribute("src",results.rows.item(i).tipo+".png");
                    img.setAttribute("alt",results.rows.item(i).tipo);
                    var div = document.createElement("div");
                    div.setAttribute("id", results.rows.item(i).elem_id);
                    div.setAttribute("class", results.rows.item(i).tipo);
                    div.style.position = "absolute";
                    div.style.left = results.rows.item(i).x+"px";
                    div.style.top = results.rows.item(i).y+"px";
                    div.appendChild(img);
                    var tablero = document.getElementById("tablero");
                    tablero.appendChild(div);
                }
                oculta();
            }else{
                alert("No hay evento?");
            }
        }, null);
    });
}

function oculta(){
    document.getElementById("guardar").disabled = true;
}