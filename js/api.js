

async function bilatuApi(terminoa, mota) {

 try {
    let data = [];

    // aukeratu zer fitxategian bilatu (spells,characters)
    if (mota === 'spells') {
      const response = await fetch('spells.json'); 
      if (!response.ok) throw new Error('Ezin izan dira spells.json datuak eskuratu');
      data = await response.json();
    } else {
      const response = await fetch('characters.json');
      if (!response.ok) throw new Error('Ezin izan dira characters.json datuak eskuratu');
      data = await response.json();
    }

    // Bilatzailean idatzi den izena
    if (terminoa && terminoa.trim() !== '') {
      const bilaketa = terminoa.trim().toLowerCase();
      return data.filter(item => {
        const izena = item.name || item.izena || '';
        return izena.toLowerCase().includes(bilaketa);
      });
    }

    return data;
//Errorea
  } catch (err) {
    console.error('Errorea bilatuApi() funtzioan:', err.message);
    return [];
  }
  
}
