/**
 * Page de remerciement privée (/c/#<id>.<clé>) - copiée dans public/c/merci.js
 * par studio/coffret.cjs.
 *
 * Lit l'identifiant et la clé après le « # » (jamais envoyés au serveur),
 * télécharge /c/<id>.bin et le déchiffre dans le navigateur (AES-GCM). Le
 * contenu est posé avec textContent : rien n'est interprété comme du HTML.
 */
(async () => {
  const $ = (id) => document.getElementById(id);
  const fail = () => {
    $('state').textContent =
      'Ce lien est incomplet ou n’est plus actif. Scannez à nouveau le QR code de votre certificat.';
  };

  let data;
  try {
    const [id, k] = location.hash.slice(1).split('.');
    if (!/^[0-9a-f]{12}$/.test(id || '') || !/^[\w-]{43}$/.test(k || '')) throw new Error('lien');
    const res = await fetch(`/c/${id}.bin`, { cache: 'no-store' });
    if (!res.ok) throw new Error('absent');
    const buf = new Uint8Array(await res.arrayBuffer());
    const raw = Uint8Array.from(atob(k.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    const key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, key, buf.slice(12));
    data = JSON.parse(new TextDecoder().decode(plain));
  } catch {
    fail();
    return;
  }

  const { nom, site, avis } = document.body.dataset;
  document.title = `Merci, ${data.client} · ${nom}`;
  $('titre').textContent = `Merci, ${data.client}.`;
  $('lead').textContent = `Votre chantier à ${data.commune} est terminé : ${data.travaux}.`;
  $('dates').textContent = `Du ${data.debut} au ${data.fin}`;
  if (data.message) {
    $('msg').textContent = data.message;
    $('msg').hidden = false;
  }

  /* Avant / après : la photo « après » est découpée depuis la gauche ; un
     curseur natif (clavier, lecteur d'écran) pilote la position. */
  for (const p of data.paires) {
    const fig = document.createElement('figure');
    const ba = document.createElement('div');
    ba.className = 'ba';
    const before = Object.assign(document.createElement('img'), { src: p.avant, alt: `Avant : ${p.legende || data.travaux}` });
    const after = Object.assign(document.createElement('img'), { src: p.apres, alt: `Après : ${p.legende || data.travaux}`, className: 'after' });
    const input = Object.assign(document.createElement('input'), { type: 'range', min: 0, max: 100, value: 50 });
    input.setAttribute('aria-label', 'Comparer avant et après');
    input.addEventListener('input', () => ba.style.setProperty('--pos', `${input.value}%`));
    const tag = (text, side) => Object.assign(document.createElement('span'), { className: `tag ${side}`, textContent: text });
    const line = Object.assign(document.createElement('span'), { className: 'line' });
    const knob = Object.assign(document.createElement('span'), { className: 'knob' });
    ba.append(before, after, tag('Avant', 'l'), tag('Après', 'r'), input, line, knob);
    fig.append(ba);
    if (p.legende) fig.append(Object.assign(document.createElement('figcaption'), { textContent: p.legende }));
    $('paires').append(fig);
  }

  if (avis) {
    $('avis').href = avis;
    $('avis').hidden = false;
  }
  $('parrainer').addEventListener('click', async () => {
    const url = `${site}/devis?utm_source=parrainage`;
    const text = `Je vous recommande ${nom} pour vos travaux : devis gratuit et sans engagement.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: nom, text, url });
        return;
      } catch {
        /* partage annulé : rien à faire */
        return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank', 'noopener');
  });

  $('state').hidden = true;
  $('page').hidden = false;
})();
