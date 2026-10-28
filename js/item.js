class Item {
  constructor(ApiDatuak) {
    this.id = ApiDatuak.id;
    this.izena = ApiDatuak.name;
    this.irudia = ApiDatuak.image;

    this.etxea= ApiDatuak.house || "Ezezaguna";//gure APi-a gauza gehiago itzultzen dizkigu
    this.aktorea = ApiDatuak.actor || "Ezezaguna"

    this.balorazioa = null;
    this.iruzkina = '';
    this.gordetakoData = null;
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
      izena:obj.izena,
      irudia:obj.irudia,
      etxea:obj.etxea,
      aktorea:obj.aktorea

    });

    item.balorazioa = obj.balorazioa;
    item.iruzkina = obj.iruzkina;
    item.gordetakoData = obj.gordetakoData;

    return item;
  }
}
