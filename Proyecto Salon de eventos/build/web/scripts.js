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
		comida:"",
        id: "",
        tipo: "",
        content: ""
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
    tooltip.setAttribute("id",elem.id+"_tool");
	
	var selcomida=document.createElement("select");
    selcomida.setAttribute("onBlur","sunfocus(this)");
	selcomida.setAttribute("class","stooltip");
	selcomida.setAttribute("id",elem.id+"_selc");
	
	var sv;
	var comidas=["Sushi", "Pizza", "Mariscos"];
	for (var i= 0; i<3; i++) {
		var option = document.createElement("option");
		option.value = comidas[i];
		option.text = comidas[i];
		selcomida.appendChild(option);
	}
	
    if(muebles.length > 0){
        for(var i = 0; i < muebles.length; i++){
            if(muebles[i].id === elem.id){
                tooltip.value = muebles[i].content;
				selcomida.value=muebles[i].comida;
            }
        }
    }
    document.getElementById(elem.id).appendChild(tooltip);
	document.getElementById(elem.id).appendChild(selcomida);
}

function unfocus(elem){
    var content = elem.value;
    var elem_id = elem.id.substring(0, elem.id.indexOf("_"));
    revisa_mesa(elem_id, content);
    var padre = elem.parentNode;
	padre.removeChild(elem);
}

function sunfocus(elem){
    var comida = elem.value;
    var elem_id = elem.id.substring(0, elem.id.indexOf("_"));
    srevisa_mesa(elem_id, comida);
    var padre = elem.parentNode;
	padre.removeChild(elem);
}

function revisa_mesa(elem_id, content){ 
    if(muebles.length > 0){
        for(var i = 0; i < muebles.length; i++){
            if(muebles[i].id === elem_id){
                muebles[i].content = content;
            }
        }
    }
}

function srevisa_mesa(elem_id, comida){ 
    if(muebles.length > 0){
        for(var i = 0; i < muebles.length; i++){
            if(muebles[i].id === elem_id){
                muebles[i].comida = comida;
            }
        }
    }
}

var db;
window.onload = function goN(){
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function(tx){
        //tx.executeSql('drop table USUARIO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USUARIO(nombre TEXT, contra TEXT)');
    });
    db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENTO(ide INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT,eventoo TEXT,tipo TEXT,fecha TEXT,hora TEXT,FOREIGN KEY (nombre) REFERENCES USUARIO (nombre))');
    });
    
    db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS DIST(ide INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT,x INTEGER,y INTEGER,tipo TEXT,elem_id TEXT,content TEXT, comida TEXT, FOREIGN KEY (nombre) REFERENCES USUARIO (nombre))');
    });
    
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM EVENTO WHERE nombre=?', [sessionStorage.getItem('usuario')], function (tx, results) {
            var len = results.rows.length, i;
            if(len > 0){
                alert("Ya has creado tu evento disponible");
                    $("#newEv").addClass("ocultar");
                    $("#cosas").addClass("ocultar");
                var select = document.getElementById("eventos_guardados");
                for(i = 0; i < len; i++){
                    var option = document.createElement("option");
                    option.setAttribute("id", results.rows.item(i).eventoo);
                    option.innerHTML = results.rows.item(i).eventoo;
                    select.appendChild(option);
                }
            }else{
                    $("#goEv").addClass("ocultar");
                alert("Tienes un evento disponible para crear");
            }
        }, null);
    });
    
    
};

function guarda_evento(){
    var tipo_evento = document.getElementById("tipo_de_evento").value;
    var fecha = document.getElementById("fecha").value; 
    var hora = document.getElementById("hora").value;
    var nombre = document.getElementById("n_evento").value;
    if(muebles.length>0){
        db.transaction(function(tx){
            tx.executeSql("INSERT INTO EVENTO(nombre,eventoo,tipo,fecha,hora) VALUES (?,?,?,?,?)", [sessionStorage.getItem('usuario'), nombre, tipo_evento, fecha, hora]);
        });
        db.transaction(function(tx){
            for(var i = 0; i < muebles.length; i++){
                console.log(muebles[i].x+" "+muebles[i].tipo+" "+muebles[i].id);
                tx.executeSql("INSERT INTO DIST(nombre,x,y,tipo,elem_id,content,comida) VALUES (?,?,?,?,?,?,?)", [sessionStorage.getItem('usuario'), muebles[i].x, muebles[i].y, muebles[i].tipo, muebles[i].id, muebles[i].content,muebles[i].comida]);
            }
        });
        alert("Evento guardado");
    }else{
        alert("Tu evento está vacío");
    }
    setTimeout(function(){location.reload();}, 2000);
}


function carga_evento(){
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM DIST INNER JOIN USUARIO WHERE DIST.nombre = USUARIO.nombre AND DIST.nombre=?', [sessionStorage.getItem('usuario')], function (tx, results) {
            var len = results.rows.length;
            if(len > 0){
                muebles = [];
                //CREAR LOS MUEBLES DINAMICAMENTE
                for(var i = 0; i < len; i++){
                    var img = document.createElement("img");
                    img.setAttribute("class","no-drag");
                    img.setAttribute("src","imagenes/"+results.rows.item(i).tipo+".png");
                    img.setAttribute("alt",results.rows.item(i).tipo);
                    var div = document.createElement("div");
                    div.setAttribute("id", results.rows.item(i).elem_id);
                    div.setAttribute("class", results.rows.item(i).tipo);
                    if(results.rows.item(i).tipo == "mesa"){
                        div.setAttribute("ondblclick","tooltip(this)");
                    }
                    div.style.position = "absolute";
                    div.style.left = results.rows.item(i).x+"px";
                    div.style.top = results.rows.item(i).y+"px";
                    div.appendChild(img);
                    var tablero = document.getElementById("tablero");
                    tablero.appendChild(div);
                    
                    var mueble = {
                        x: 0,
                        y: 0,
                        id: results.rows.item(i).elem_id,
                        tipo: "",
                        content: results.rows.item(i).content,
                        comida: results.rows.item(i).comida
                    };
                    muebles.push(mueble);
                }
                console.log(muebles);
                oculta();
            }else{
                alert("Error al cargar la distribución del evento");
            }
        }, null);
    });
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM EVENTO INNER JOIN USUARIO WHERE EVENTO.nombre = USUARIO.nombre AND EVENTO.nombre=?', [sessionStorage.getItem('usuario')], function (tx, results) {
            var n_evento = results.rows.item(0).eventoo;
            var tipo = results.rows.item(0).tipo;
            var fecha = results.rows.item(0).fecha;
            var hora = results.rows.item(0).hora;
            document.getElementById("tipo_de_evento").value = tipo;
            document.getElementById("fecha").value = fecha;
            document.getElementById("hora").value = hora;
            document.getElementById("n_evento").value = n_evento;
        }, null);
    });
    //document.getElementById("guardar").disabled = true;
}

function oculta(){
    document.getElementById("guardar").disabled = true;
}