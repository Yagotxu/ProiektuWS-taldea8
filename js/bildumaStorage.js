const BILDUMA_GAKOA = 'bilduma';

class bildumaStorage {
  static denakLortu() {
    //localStorege dauden objetuak lortzen ditu
    const data = localStorage.getItem(BILDUMA_GAKOA)
    if (!data) return [];
    return JSON.parse(data);
  }

  static gorde(item) {
    //Gordetzen edo berridazten du elementu bat localStoregen
    const lista = this.denakLortu()
    const index = lista.findIndex(i => i.id === item.id)
    if(index !== -1){
      lista[index]= item.toStorageObject()
    }else{
      lista.push(item.toStorageObject())
    }
  }

  static itemBezalaLortu() {
    // Item klaseko instantziak bezala bueltatzen ditu
    const lista = this.denakLortu()
    return lista.map(obj => Item.fromStorageObject(obj))
  }

  static ezabatu(id) {
    //Pertsonai bat ezabatzen du bere IDa-ren bidez
    const lista = this.denakLortu()
    const filtratua = lista.filter(item => item.id !==id);
    localStorage.setItem(BILDUMA_GAKOA, JSON.stringfy(filtratua))
  }

  static hustu() {
    //Dena ezabatzen du
    localStorage.removeItem(BILDUMA_GAKOA);
  }
}
