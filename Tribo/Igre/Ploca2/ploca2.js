var prviIgrac = false;
function igraj()
{

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "darkgrey";
ctx.fillRect(0, 0, canvas.width, canvas.height);
const poluprecnik = 20;
const razmak = 25;
prviIgrac = !prviIgrac;
const brojRedova = 8;
const brojKolona = 10;
const krugovi = [];
//krugovi koje korisnik klikne
var kliknutiKrugovi = [];
//krugovi kroz ciji je centar prosla linija
var odabraniKrugovi = [];

var vrhoviTrougla = [];

var preostaliKrugovi = [];


var naRedu = prviIgrac;
let naslov = document.getElementById('igrac');
if(naRedu){
    naslov.innerHTML = "Prvi igrac je na potezu";
    naslov.style.textAlign = "center";
    naslov.style.color = "red";
}
else{
    naslov.innerHTML = "Drugi igrac je na potezu";
    naslov.style.textAlign = "center";
    naslov.style.color = "blue";
}

for(let i = 0; i < brojRedova; i++){
    krugovi[i] = [];
    for(let j = 0; j < brojKolona; j++){
        krugovi[i][j] = {
            x: j*(poluprecnik*2 + razmak) + razmak,
            y: i*(poluprecnik*2 + razmak) + razmak
        };
        
    }
}

function daLiSuNaIstojPravoj(x1, y1, x2, y2, x3, y3){
    //na istoj pravoj ako su sve tri koordinate jednake
    if((x1 == x2) && (x2 == x3) ||
        (y1 == y2) && (y2 == y3) ||
        (y3 ==(((y2 - y1)/(x2 - x1)) * (x3 - x1)) + y1))
        return true;
}
for(let i = 0; i < krugovi.length; i++){
    for(let j = 0; j < krugovi[i].length; j++){
        ctx.beginPath();
        ctx.arc(krugovi[i][j].x, krugovi[i][j].y, poluprecnik, 0, 2*Math.PI);
        ctx.stroke();
        canvas.addEventListener('click', function(event){
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            // Klik je bio unutar kruga ako je velicina duzi centra kruga i klika manja od poluprecnika
            if (
            Math.pow(clickX - krugovi[i][j].x, 2) + Math.pow(clickY - krugovi[i][j].y, 2) <
            Math.pow(poluprecnik, 2)
            ) {
                // ne registrovati klik ako dvaput odabere isti dugmic 
                //ili ako je odabrao dugmic kojeg prava sijece kroz centar
                if(!(kliknutiKrugovi.includes(krugovi[i][j])) && (!(odabraniKrugovi.includes(krugovi[i][j])))){
                    kliknutiKrugovi.push(krugovi[i][j]);
                    console.log(krugovi[i][j].x, krugovi[i][j].y)
                    //console.log(i, j);
                    //odabraniKrugovi.push(krugovi[i][j]);
                    if(kliknutiKrugovi.length == 3 && !(daLiSuNaIstojPravoj(kliknutiKrugovi[0].x, kliknutiKrugovi[0].y, 
                        kliknutiKrugovi[1].x, kliknutiKrugovi[1].y,
                        kliknutiKrugovi[2].x, kliknutiKrugovi[2].y))){
                        napraviTrougao();
                    }
                    else if(kliknutiKrugovi.length == 3 && 
                        daLiSuNaIstojPravoj(kliknutiKrugovi[0].x, kliknutiKrugovi[0].y, 
                            kliknutiKrugovi[1].x, kliknutiKrugovi[1].y,
                            kliknutiKrugovi[2].x, kliknutiKrugovi[2].y)){
                        alert("Ne mozete odabrati tacke na istoj pravoj");
                        kliknutiKrugovi = [];
                    }
                }
            }
        });
        
    }
}

//jednacina prave y - y1 = (y2 - y1)/(x2 - x1) * (x - x1)

function Prava(x, y, x1, y1, x2, y2){
    //ako su x isti doslo bi do dijeljenja sa nulom
    if(x1 == x2) return true;
    else if(y1 == y2) return true;
    else if(y == (((y2 - y1)/(x2 - x1)) * (x - x1)) + y1){
        return true;
    }
}


function napraviTrougao(){
    vrhoviTrougla.push({
        A: kliknutiKrugovi[0],
        B: kliknutiKrugovi[1],
        C: kliknutiKrugovi[2]
      });
    if(DaLiSeSijeku(vrhoviTrougla, kliknutiKrugovi[0], kliknutiKrugovi[1], kliknutiKrugovi[2])){
        alert("Nemoguce odabrati trougao koji sijece drugi trougao, molimo izaberite ponovo");
        kliknutiKrugovi = [];
        vrhoviTrougla.pop();
    }
    else{
    ctx.beginPath();
      ctx.moveTo(kliknutiKrugovi[0].x, kliknutiKrugovi[0].y);
      ctx.lineTo(kliknutiKrugovi[1].x, kliknutiKrugovi[1].y);
      ctx.lineTo(kliknutiKrugovi[2].x, kliknutiKrugovi[2].y);
      ctx.lineTo(kliknutiKrugovi[0].x, kliknutiKrugovi[0].y);
      
      //console.log(vrhoviTrougla[0].A.x)
      ctx.lineWidth = 5;
      if(naRedu)  ctx.strokeStyle = "red";
      else ctx.strokeStyle = "blue";
      ctx.stroke();
      ctx.closePath();
      for(let i = 0; i < krugovi.length; i++){
        for(let j = 0; j < krugovi[i].length; j++){
            //Da li se krug nalazi na pravoj, a izmedju druga dva kruga
            if(((krugovi[i][j].x >= kliknutiKrugovi[0].x && krugovi[i][j].x <= kliknutiKrugovi[1].x) ||
            (krugovi[i][j].x >= kliknutiKrugovi[1].x && krugovi[i][j].x <= kliknutiKrugovi[0].x)) &&
            ((krugovi[i][j].y >= kliknutiKrugovi[0].y && krugovi[i][j].y <= kliknutiKrugovi[1].y) ||
            (krugovi[i][j].y >= kliknutiKrugovi[1].y && krugovi[i][j].y <= kliknutiKrugovi[0].y)) &&
                Prava(krugovi[i][j].x, krugovi[i][j].y, kliknutiKrugovi[0].x, kliknutiKrugovi[0].y,
                 kliknutiKrugovi[1].x, kliknutiKrugovi[1].y) ||
                 ((krugovi[i][j].x >= kliknutiKrugovi[0].x && krugovi[i][j].x <= kliknutiKrugovi[2].x) ||
            (krugovi[i][j].x >= kliknutiKrugovi[2].x && krugovi[i][j].x <= kliknutiKrugovi[0].x)) &&
            ((krugovi[i][j].y >= kliknutiKrugovi[0].y && krugovi[i][j].y <= kliknutiKrugovi[2].y) ||
            (krugovi[i][j].y >= kliknutiKrugovi[2].y && krugovi[i][j].y <= kliknutiKrugovi[0].y)) &&
                Prava(krugovi[i][j].x, krugovi[i][j].y, kliknutiKrugovi[0].x, kliknutiKrugovi[0].y,
                    kliknutiKrugovi[2].x, kliknutiKrugovi[2].y) ||
            ((krugovi[i][j].x >= kliknutiKrugovi[2].x && krugovi[i][j].x <= kliknutiKrugovi[1].x) ||
            (krugovi[i][j].x >= kliknutiKrugovi[1].x && krugovi[i][j].x <= kliknutiKrugovi[2].x)) &&
            ((krugovi[i][j].y >= kliknutiKrugovi[2].y && krugovi[i][j].y <= kliknutiKrugovi[1].y) ||
            (krugovi[i][j].y >= kliknutiKrugovi[1].y && krugovi[i][j].y <= kliknutiKrugovi[2].y)) &&
                Prava(krugovi[i][j].x, krugovi[i][j].y, kliknutiKrugovi[1].x, kliknutiKrugovi[1].y,
                        kliknutiKrugovi[2].x, kliknutiKrugovi[2].y)){
                            odabraniKrugovi.push(krugovi[i][j]);
                        }
        }
      }
      for(let t = 0; t < odabraniKrugovi.length; t++){
        ctx.beginPath();
        ctx.arc(odabraniKrugovi[t].x, odabraniKrugovi[t].y, 10, 0, 2*Math.PI);
        ctx.fillStyle = "lightblue";
        ctx.fill();
        ctx.closePath();
      }
      //console.log(odabraniKrugovi.length);
      //u ovoj petlji provjeravati ima li slobodnih krugova za povezati 
      //napraviti niz koji ce sadrzavati krugove koji nisu zauzeti(iskoristiti odabrani i includes)
      //provjerimo 3 kruga da li se mogu povezati i ako mogu nije kraj igre
      for(let k = 0; k < krugovi.length; k++){
        preostaliKrugovi[k] = [];
        for(let l = 0; l < krugovi[k].length; l++){
            if(!(odabraniKrugovi.includes(krugovi[k][l]))){
                preostaliKrugovi[k].push(krugovi[k][l]);
            }
        }
      }
      for(let c = 0; c < preostaliKrugovi.length; c++){
        for(let a = 0; a < preostaliKrugovi[c].length; a++){
            ctx.beginPath();
            ctx.arc(preostaliKrugovi[c][a].x, preostaliKrugovi[c][a].y, 10, 0, 2*Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
        }
      }
      if(mozeLiSeNacrtati(preostaliKrugovi)){
      preostaliKrugovi = [];
      naRedu = !naRedu;
      if(naRedu){
        naslov.innerHTML = "Prvi igrac je na potezu";
        naslov.style.textAlign = "center";
        naslov.style.color = "red";
      }
      else{
        naslov.innerHTML = "Drugi igrac je na potezu";
        naslov.style.textAlign = "center";
        naslov.style.color = "blue";
    }
      kliknutiKrugovi = [];
    }
    else{
        if(naRedu){
            alert("Pobijedio je prvi igrac. Pritisnite dugme u donjem lijevom uglu za restart");
        }
        else{
            alert("Pobijedio je drugi igrac. Pritisnite dugme u donjem lijevom uglu za restart")
            
        }
    }
    
}

}

    function mozeLiSeNacrtati(niz){
        let uspjesno = false;
        for(let i = 0; i < niz.length ; i++){
            for(let j = 0; j < niz[i].length; j++){
                let tacka1 = {x: niz[i][j].x, y: niz[i][j].y};
                for(let k = 0; k < niz.length; k++){
                        for(let l = 0; l < niz[k].length; l++){
                            let tacka2 = {x: niz[k][l].x, y: niz[k][l].y}
                            for(let p = 0; p< niz.length; p++){
                                for(let o = 0; o < niz[p].length; o++){
                                    let tacka3 = {x: niz[p][o].x, y: niz[p][o].y}
                                    if((!(DaLiSeSijeku(vrhoviTrougla, tacka1, tacka2, tacka3)))
                                    && (!(daLiSuNaIstojPravoj(tacka1.x, tacka1.y,
                                                                tacka2.x, tacka2.y,
                                                                tacka3.x, tacka3.y)))
                                    && tacka1.x != tacka2.x && tacka2.x != tacka3.x 
                                    && tacka1.y != tacka2.y && tacka2.y != tacka3.y){
                                        console.log(tacka1, tacka2, tacka3);
                                        uspjesno = true;
                                        return uspjesno;
                                        }
                            }
                        }
                }
            }
            
        }
        
    }
    return uspjesno;
}

function DaLiSeSijeku(tr, ko1, ko2, ko3){
  
    for(let i = 0; i < tr.length; i++){
        if(tr[i].A.x == ko1.x && tr[i].A.y == ko1.y) continue;
        if(presjekDvijePrave(tr[i].A, tr[i].B, ko1, ko2)) return true;
        else if(presjekDvijePrave(tr[i].A, tr[i].B, ko1, ko3)) return true;
        else if(presjekDvijePrave(tr[i].A, tr[i].B, ko2, ko3)) return true;
        else if(presjekDvijePrave(tr[i].A, tr[i].C, ko1, ko2)) return true;
        else if(presjekDvijePrave(tr[i].A, tr[i].C, ko1, ko3)) return true;
        else if(presjekDvijePrave(tr[i].A, tr[i].C, ko2, ko3)) return true;
        else if(presjekDvijePrave(tr[i].B, tr[i].C, ko1, ko2)) return true;
        else if(presjekDvijePrave(tr[i].B, tr[i].C, ko1, ko3)) return true;
        else if(presjekDvijePrave(tr[i].B, tr[i].C, ko2, ko3)) return true;
    }
    return false;

}
function presjekDvijePrave(tacka1, tacka2, tacka3, tacka4){
    /*if((tacka1.x < tacka3.x && tacka3.x < tacka2.x && tacka2.x < tacka4.x) ||
        (tacka1.x < tacka4.x && tacka4.x < tacka2.x && tacka2.x < tacka3.x) || 
        (tacka1.x < tacka3.x && tacka3.x < tacka4.x && tacka4.x < tacka2.x) || 
        (tacka1.x < tacka4.x && tacka4.x < tacka3.x && tacka3.x < tacka2.x) ||
        (tacka2.x < tacka3.x && tacka3.x < tacka1.x && tacka1.x < tacka4.x) || 
        (tacka2.x < tacka3.x && tacka3.x < tacka4.x && tacka4.x < tacka1.x) || 
        (tacka2.x < tacka4.x && tacka4.x < tacka1.x && tacka1.x < tacka3.x) || 
        (tacka2.x < tacka4.x && tacka4.x < tacka3.x && tacka3.x < tacka1.x) ||
        (tacka3.x < tacka1.x && tacka1.x < tacka2.x && tacka2.x < tacka4.x) ||
        (tacka3.x < tacka1.x && tacka1.x < tacka4.x && tacka4.x < tacka2.x) ||
        (tacka3.x < tacka2.x && tacka2.x < tacka1.x && tacka1.x < tacka4.x) || 
        (tacka3.x < tacka2.x && tacka2.x < tacka4.x && tacka4.x < tacka1.x) || 
        (tacka4.x < tacka1.x && tacka1.x < tacka2.x && tacka2.x < tacka3.x) ||
        (tacka4.x < tacka1.x && tacka1.x < tacka3.x && tacka3.x < tacka2.x) ||
        (tacka4.x < tacka2.x && tacka2.x < tacka1.x && tacka1.x < tacka3.x) ||
        (tacka4.x < tacka2.x && tacka2.x < tacka3.x && tacka3.x < tacka1.x) && 
        ((tacka3.y > tacka1.y || tacka3.y > tacka2.y) && 
        (tacka4.y < tacka1.y || tacka4.y < tacka2.y) || 
        (tacka3.y < tacka1.y || tacka3.y < tacka2.y) && 
        (tacka4.y > tacka1.y || tacka4.y > tacka2.y) || 
        (tacka1.y > tacka3.y || tacka1.y > tacka4.y) && 
        (tacka2.y < tacka3.y || tacka2.y < tacka4.y) || 
        (tacka1.y < tacka3.y || tacka1.y < tacka4.y) && 
        (tacka2.y > tacka3.y || tacka2.y > tacka4.y))) return true;*/
        let k1 = 0, k2 = 0;
        let n1 = 0, n2 = 0;
        let x = 0, y = 0;
        if(tacka2.x == tacka1.x){
            k1 = 1000000;
            n1 = 0;
        }
        else{
            k1 = (tacka2.y - tacka1.y)/(tacka2.x - tacka1.x);
            n1 = tacka1.y - k1 * tacka1.x;
        }
        if(tacka4.x == tacka3.x){
            k2 = 1000000;
            n2 = 0;
            
        }
        else{
            k2 = (tacka4.y - tacka3.y)/(tacka4.x - tacka3.x);
            n2 = tacka3.y - k2 * tacka3.x;
            
        }
        if(k1 == k2){
            if(n1 == n2){
                if((( tacka1.x > tacka3.x  && tacka1.x < tacka4.x) || 
                (tacka1.x < tacka3.x && tacka1.x > tacka4.x)) && 
                ((tacka2.x > tacka3.x && tacka2.x < tacka4.x) || 
                (tacka2.x < tacka3.x && tacka2.x > tacka4.x))){
                console.log("Dolazi li ovdje?");
                return true;
            }
        }
            else{ 
            return false;
            }
        }
        else if(k1 == 1000000) {
            x = tacka1.x;
            y = k2 * x + n2;
        }
        else if(k2 == 1000000){ 
            x = tacka3.x;
            y = k1 * x + n1;
        }
        else{
            x = (n2 - n1) / (k1 - k2);
            y = k1 * x + n1;
        }

        if(((x <= tacka1.x && x >= tacka2.x) || (x >= tacka1.x && x <= tacka2.x)) &&
        ((x <= tacka3.x && x >=tacka4.x) || (x >=tacka3.x && x <= tacka4.x)) &&
        ((y >= tacka1.y && y <= tacka2.y) || 
            (y <= tacka1.y && y >= tacka2.y)) && 
            ((y >= tacka3.y && y <= tacka4.y) || 
            (y <= tacka3.y && y >= tacka4.y))){
             return true;}
        else return false;
    }
}
igraj()
function Restartuj(){
    //prviIgrac = !prviIgrac;
   location.reload();
}