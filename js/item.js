class Item {
  constructor(ApiDatuak) {
    this.id = ApiDatuak.id;
    this.izena = ApiDatuak.name || ApiDatuak.izena;
    this.irudia = ApiDatuak.image || ApiDatuak.irudia;

    this.etxea= ApiDatuak.house || ApiDatuak.etxea ||"Ezezaguna";//gure APi-a gauza gehiago itzultzen dizkigu
    this.aktorea = ApiDatuak.actor || ApiDatuak.aktorea || "Ezezaguna"

    this.balorazioa = ApiDatuak.balorazioa ||null;
    this.iruzkina = ApiDatuak.iruzkina || '';
    this.gordetakoData = ApiDatuak.gordetakoData|| null;
  }

  toHTML() {//Sortutako elementua html batean bihurtu
    return `
      <div class="item-card" data-id="${this.id}">
        <img src="${this.irudia}" alt="${this.izena}">
        <div class="item-info">
          <h3>${this.izena}</h3>
          <p><strong> Etxea: </strong> ${this.etxea}</p>//etxea eta aktorearen izeank erakutsi
          <p><strong> Aktorea: </strong> ${this.aktorea}</p>
        </div>
      </div>
    `;
  }
  toXehetasunHTML(){
    return `
    <div class="xehetasun-card">
      <img src="${this.irudia}" alt="${this.izena}">
      <h4>${this.izena}</h4>
      <p><strong>Etxea:</strong> ${this.etxea}</p>
      <p><strong>Aktorea:</strong> ${this.aktorea}</p>
      
      <label for="balorazioa-select">Balorazioa (1-5):</label>
      <select id="balorazioa-select">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5" selected>5</option>
      </select>

      <br><br>

      <label for="iruzkina-input">Iruzkina:</label><br>
      <textarea id="iruzkina-input" placeholder="Idatzi iruzkina..."></textarea>

      <br><br>

      <button id="btn-gorde-bilduma">Gehitu bildumara</button>
    </div>
  `;
  }

  toStorageObject() {//atributuak "empaketatu"
      const obj = {
      id:this.id,
      izena:this.izena,
      irudia:this.irudia,
      etxea:this.etxea,
      aktorea:this.aktorea,
      balorazioa:this.balorazioa,
      iruzkina:this.iruzkina,
      gordetakoData:this.gordetakoData
    };
    return obj;
  }

  static fromStorageObject(obj) {

    const item = new Item({//objetutik balioak atera item baten barruan
     
      id:obj.id,
      name:obj.izena,
      image:obj.irudia,
      etxea:obj.etxea,
      aktorea:obj.aktorea

    });

    item.balorazioa = obj.balorazioa;
    item.iruzkina = obj.iruzkina;
    item.gordetakoData = obj.gordetakoData;

    return item;
  }
}
