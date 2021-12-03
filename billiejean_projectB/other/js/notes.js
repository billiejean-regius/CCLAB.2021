let buttonNum = 4,
w = window.innerWidth,
rowButtonNumber = Math.floor(w / 200);

let table = document.getElementById("myTable");

for (let i = 0; i < buttonNum; i++) {
  let tr = document.createElement("tr");
  table.appendChild(tr);

    for (let j = 0; j < rowButtonNumber; j++, i++) {
      let td = document.createElement("td");
      let div = document.createElement("div");
      //div.appendChild(btn);
      div.className = "container";
      let btn = document.createElement("button");
      //btn.innerHTML = "Choice " + (i + 1);
      btn.innerHTML = (document.getElementById('text'))
      btn.id = "option-buttons"
      //btn.id = "btn-" + i;
      btn.className = "btn";
      //btn.onclick = function () { alert(this.innerHTML); };
      if (i >= buttonNum) {
        break;
      } else {
        btn.appendChild(div);
        td.appendChild(btn);
        //td.appendChild(txt);
        //tr.appendChild(txt);
        tr.appendChild(td);
        //div.appendChild(btn);
      }
    }
    i--;
  }
