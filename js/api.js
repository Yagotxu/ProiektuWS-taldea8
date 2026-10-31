const API_BASE_URL = 'https://hp-api.onrender.com/api';

async function bilatuApi(terminoa, mota) {

  try{
    //1.API-a nondik deitu(motarekin batera)
    
    let endpoint = '/characters';//defektuz, pertsonai guztiak bilatu

    if(mota==='students'){//ikasleak

      endpoint='/characters/students';

    }else if(mota==='staff'){//irakasleak

      endpoint='/characters/staff';

    }

    //2.Datuak eskatu API-ari deituz
    const response = await fetch (`${API_BASE_URL}${endpoint}`);

    //serbidorearen erantzuna errorea ematen badu:
    if(!response.ok){

      throw new Error ('Ezin izan dira datuak eskuratu');
    
    }
    //3.Erantzuna json motara pasa
    const data = await response.json();

    //4.Erabiltzaileak izena sartu badu :
    if(terminoa && terminoa.trim()!==''){ 

      const bilaketa = terminoa.trim().toLowerCase();
      //lortu nahi dugun edo ditugun pertsonaiak itzuli
      return data.filter(pertsonaia=> 
        pertsonaia.name.toLowerCase().includes(bilaketa)//honekin, potter bilatuko bagenu, harry potter edo potter terminoa duten pertsonaiak iztuliko lituzke. Eta erroreak ekiditen ditugu.
      );
      
    }
    //Ez badu ezer idatzi terminoan, eta motaren arabera, pertsonai guztien lista itzultzen du
    //mota ez badu jarri pertsonai guztiak bidaliko ditu
    return data;

  }catch(err){//Errorea tratatu

    console.error('Errorea bulatuApi() funztioan', err.message);

  }
  
}
