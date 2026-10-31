const ATALAK = ['hasiera', 'bilatzaile', 'bilduma', 'kudeatuBilduma'];

const HASIERATZAILEAK = {
  bilatzaile: () => {
    const form = document.getElementById('form-bilatzaile');
    const input = document.getElementById('input-bilaketa');
    const egoera = document.getElementById('egoera-bilatzen');
    const emaitzakDiv = document.getElementById('emaitzak-bilaketa');
    const xehetasunakDiv = document.getElementById('xehetasunak-item');

    if(!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const terminoa = input.value.trim();
      egoera.textContent = 'Bilatzen...';
      emaitzakDiv.innerHTML = '';

      const datuak = await bilatuApi(terminoa);

      if (!datuak || datuak.length === 0) {
        egoera.textContent = 'Ez da pertsonaiarik aurkitu.';
        emaitzakDiv.innerHTML = '<p>Ez da emaitzarik lortu.</p>';
        return;
      }

      egoera.textContent = `${datuak.length} pertsonaia aurkitu dira.`;

      datuak.forEach(apiDatu => {
        const item = new Item(apiDatu);

        const wrapper = document.createElement('div');
        wrapper.innerHTML = item.toHTML();
        const card = wrapper.firstElementChild;

        // click egitean toXehetasunHTML deitu
        card.addEventListener('click', () => {
          xehetasunakDiv.innerHTML = item.toXehetasunHTML();

          // gorde bilduma botoia 
          document.getElementById('btn-gorde-bilduma').addEventListener('click', () => {
            item.balorazioa = parseInt(document.getElementById('balorazioa-select').value);
            item.iruzkina = document.getElementById('iruzkina-input').value;
            item.gordetakoData = new Date().toISOString();

            bildumaStorage.gorde(item);
            alert(`${item.izena} bilduman gorde da!`);
          });
        });

        emaitzakDiv.appendChild(card);
      });
    });
  },
  
  bilduma: () => {
    const kontrolakDiv = document.getElementById('bilduma-kontrolak');
    const listaDiv = document.getElementById('lista-bilduma');
    const xehetasunakDiv = document.getElementById('xehetasun-bilduma');

    if (!listaDiv) return;

    // ordenatzeko eta filtratzeko elementuak
    if (kontrolakDiv) {
      kontrolakDiv.innerHTML = `
        <label for="filtratu-etxea">Etxea:</label>
        <select id="filtratu-etxea">
          <option value="denak">Denak</option>
          <option value="Gryffindor">Gryffindor</option>
          <option value="Slytherin">Slytherin</option>
          <option value="Hufflepuff">Hufflepuff</option>
          <option value="Ravenclaw">Ravenclaw</option>
        </select>

        <label for="ordenatu-select">Ordenatu:</label>
        <select id="ordenatu-select">
          <option value="izena">Izena (A-Z)</option>
          <option value="balorazioa">Balorazioa (Altua -> Baxua)</option>
        </select>
      `;
    }

    const etxeaSelect = document.getElementById('filtratu-etxea');
    const ordenatuSelect = document.getElementById('ordenatu-select');

    function erakutsi() {
      let datuak = bildumaStorage.itemBezalaLortu();

      if (datuak.length === 0) {
        listaDiv.innerHTML = '<p>Oraindik ez duzu item-ik gorde.</p>';
        if (xehetasunakDiv) {
          xehetasunakDiv.innerHTML = '<p>Item bat aukeratu bere xehetasunak bistaratzeko.</p>';
        }
        return;
      }

      // array.filter() ordenaizoa
      if (etxeaSelect && etxeaSelect.value !== 'denak') {
        datuak = datuak.filter(item => item.etxea === etxeaSelect.value);
      }

      // array.sort() ordenatu
      if (ordenatuSelect && ordenatuSelect.value === 'izena') {
        datuak.sort((a, b) => a.izena.localeCompare(b.izena));
      } else if (ordenatuSelect && ordenatuSelect.value === 'balorazioa') {
        datuak.sort((a, b) => (b.balorazioa || 0) - (a.balorazioa || 0));
      }

      // lista azaldu
      listaDiv.innerHTML = '';
      datuak.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = item.toHTML();
        const card = wrapper.firstElementChild;

        //click egitean elementua erakutsi
        card.addEventListener('click', () => {
          if (xehetasunakDiv) {
            xehetasunakDiv.innerHTML = `
              <div class="xehetasun-card">
                ${item.irudia ? `<img src="${item.irudia}" alt="${item.izena}" style="max-width: 130px; border-radius: 8px;">` : ''}
                <h4>${item.izena}</h4>
                <p><strong>Etxea:</strong> ${item.etxea}</p>
                <p><strong>Aktorea:</strong> ${item.aktorea}</p>
                <hr>
                <p><strong>Balorazioa:</strong> ${item.balorazioa || 0} / 5</p>
                <p><strong>Iruzkina:</strong> ${item.iruzkina || 'Iruzkinik gabe'}</p>
              </div>
            `;
          }
        });

        listaDiv.appendChild(card);
      });
    }

    if (etxeaSelect) etxeaSelect.addEventListener('change', erakutsi);
    if (ordenatuSelect) ordenatuSelect.addEventListener('change', erakutsi);

    erakutsi();
  },
  kudeatuBilduma: () => {
    const listaDiv = document.getElementById('lista-kudeatu');
    const hustuBtn = document.getElementById('botoia-hustu');

    if (!listaDiv) return;

    
    function erakutsi() {
      const datuak = bildumaStorage.itemBezalaLortu();

      if (datuak.length === 0) {
        listaDiv.innerHTML = '<p>Oraindik ez du item-ik gorde.</p>';
        return;
      }

      // pertsonai bakoitzeko botoia ezabatzeko indibidualki
      listaDiv.innerHTML = datuak.map(item => `
        <div class="kudeatu-elementua" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
          <span><strong>${item.izena}</strong> (${item.etxea})</span>
          <button class="botoia-ezabatu" data-id="${item.id}">Ezabatu</button>
        </div>
      `).join('');

      // indibidual ezabatzeko botoia entzun
      listaDiv.querySelectorAll('.botoia-ezabatu').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          
          // Confirmación nativa antes de borrar un personaje
          if (confirm('Ziur zaude pertsonaia hau ezabatu nahi duzula?')) {
            bildumaStorage.ezabatu(id); 
            erakutsi();                 
          }
        });
      });
    }

    // Bilduma-hustu botoia entzun 
    if (hustuBtn) {
      hustuBtn.addEventListener('click', () => {
        // Confirmación nativa antes de vaciar toda la colección
        if (confirm('Ziur zaude bilduma osoa hustu nahi duzula?')) {
          bildumaStorage.hustu(); 
          erakutsi();             
        }
      });
    }

    
    erakutsi();
 }
}

async function atalaKargatu(izena) {
  const edukiontzia = document.getElementById(`atala-${izena}`);

  try {
    const emaitza = await fetch(`templates/${izena}.html`);
    if (!emaitza.ok) throw new Error(`${izena} Ezin izan da kargatu`);

    edukiontzia.innerHTML = await emaitza.text();

    if (HASIERATZAILEAK[izena]) HASIERATZAILEAK[izena]();
  } catch (error) {
    edukiontzia.innerHTML = '<p>Atal hau kargatzean errorea suertatu da.</p>';
    console.error(error);
  }
}

function erakutsiAtala(izena) {
  console.log('Erakutsi atala:', izena);
 document.querySelectorAll('.atala').forEach(sec => {
    sec.classList.remove('aktiboa');
  });

  const atala = document.getElementById(`atala-${izena}`);
  console.log('Contenedor encontrado:', atala);

  if (!atala) {
    console.error('No existe el contenedor de la sección:', izena);
    return;
  }

  atala.classList.add('aktiboa');

  console.log('Clases del contenedor:', atala.className);
  console.log('Contenido:', atala.innerHTML);

  document.querySelectorAll('#menu-nagusia button')
    .forEach(btn => btn.classList.remove('active'));

  const boton = document.querySelector(
    `#menu-nagusia button[data-seccion="${izena}"]`
  );

  if (boton) boton.classList.add('active');
  if (HASIERATZAILEAK[izena]) {
    HASIERATZAILEAK[izena]();
  }
}


  /*document.querySelectorAll('.atala').forEach(sec => sec.classList.remove('aktiboa'));
  document.getElementById(`atala-${izena}`).classList.add('aktiboa');

  document.querySelectorAll('#menu-nagusia button').forEach(btn => btn.classList.remove('active'));
  const boton = document.querySelector(`#menu-nagusia button[data-seccion="${izena}"]`);
  if (boton) boton.classList.add('active');
}*/

async function jaurtiApp() {
  await Promise.all(ATALAK.map(atalaKargatu));
  erakutsiAtala('hasiera');
}

/*document.getElementById('menu-nagusia').addEventListener('click', (event) => {
  const boton = event.target.closest('button[data-seccion]');
  if (!boton) return;
  erakutsiAtala(boton.dataset.seccion);
});*/
document.getElementById('menu-nagusia').addEventListener('click', (event) => {
  console.log('Click detectado');
  const boton = event.target.closest('button[data-seccion]');
  if (!boton) return;

  console.log('Botón pulsado:', boton.dataset.seccion);
  erakutsiAtala(boton.dataset.seccion);
});

jaurtiApp();
