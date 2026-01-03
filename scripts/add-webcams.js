
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../webcams.config.json');
const webcams = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

const newUrls = [
  "https://www.youtube.com/watch?v=fGOCRGXPgRY",
  "https://www.youtube.com/watch?v=GsD9QQEKSzQ",
  "https://www.youtube.com/watch?v=LnrmP3Z1M-s",
  "https://www.youtube.com/watch?v=HvJdPF46kak",
  "https://www.youtube.com/watch?v=g9Y-Bkq5O0Q",
  "https://www.youtube.com/watch?v=qM_kliIiAOs",
  "https://www.youtube.com/watch?v=KHglGodzQ9g",
  "https://www.youtube.com/watch?v=tHwWcSdBjjY",
  "https://www.youtube.com/watch?v=ZpzNv_hNxPE",
  "https://www.youtube.com/watch?v=vjp_8TKQRhw",
  "https://www.youtube.com/watch?v=F2NbYrc-gBU",
  "https://www.youtube.com/watch?v=s2CxZ7N25i0",
  "https://www.youtube.com/watch?v=c-dZM2mHc7c",
  "https://www.youtube.com/watch?v=NfR1Y-mYEtg",
  "https://www.youtube.com/watch?v=CyVr8fBBRGQ",
  "https://www.youtube.com/watch?v=Ov02yBZVvbk",
  "https://www.youtube.com/watch?v=rayKu7F6Ub4",
  "https://www.youtube.com/watch?v=AR_QQnpmoW4",
  "https://www.youtube.com/watch?v=0KMeH_vh0Bk",
  "https://www.youtube.com/watch?v=brIITSyoFns",
  "https://www.youtube.com/watch?v=68jI13YUms0",
  "https://www.youtube.com/watch?v=lEU6y-zan84",
  "https://www.youtube.com/watch?v=_Upz1dlQgpg",
  "https://www.youtube.com/watch?v=rB_nzP76ktc",
  "https://www.youtube.com/watch?v=JGyGoXlKZmw",
  "https://www.youtube.com/watch?v=yo5XnIR5RRg",
  "https://www.youtube.com/watch?v=trSGa-eTSrk",
  "https://www.youtube.com/watch?v=qMs_uynkM54",
  "https://www.youtube.com/watch?v=Ado_7_DMTdc",
  "https://www.youtube.com/watch?v=lhXXhDyjFtI",
  "https://www.youtube.com/watch?v=6kUEK3LVrro",
  "https://www.youtube.com/watch?v=AKl3F6cAY2Q",
  "https://www.youtube.com/watch?v=nV-DKquUjFs",
  "https://www.youtube.com/watch?v=AE1wiaqDZjw",
  "https://www.youtube.com/watch?v=TY4qQElcUrA",
  "https://www.youtube.com/watch?v=ZdqHgQwvZOw",
  "https://www.youtube.com/watch?v=uh_yNAE01w8",
  "https://www.youtube.com/watch?v=M4EJtf_iP8s",
  "https://www.youtube.com/watch?v=fjhg3gAnMFg",
  "https://www.youtube.com/watch?v=RaTbGYKMUtk",
  "https://www.youtube.com/watch?v=tD_a03trUvE",
  "https://www.youtube.com/watch?v=D945F_dauls",
  "https://www.youtube.com/watch?v=OQnwVN5lzsk",
  "https://www.youtube.com/watch?v=wTHhv7M0vCI",
  "https://www.youtube.com/watch?v=a8nJQr5rBGs",
  "https://www.youtube.com/watch?v=j2L_559nCjc",
  "https://www.youtube.com/watch?v=JkoXcXI04Qk",
  "https://www.youtube.com/watch?v=JhQuR77AR7U",
  "https://www.youtube.com/watch?v=YkIUZjVlhv4",
  "https://www.youtube.com/watch?v=PJWye36lEj4",
  "https://www.youtube.com/watch?v=VqS_Y8ZCj6M",
  "https://www.youtube.com/watch?v=nV-DKquUjFs",
  "https://www.youtube.com/watch?v=ZayKvJKDPWc",
  "https://www.youtube.com/watch?v=aaKOV4qkDHw",
  "https://www.youtube.com/watch?v=5YDXZ1aiR5Y",
  "https://www.youtube.com/watch?v=DliL9uMtPrI",
  "https://www.youtube.com/watch?v=a0i1Kg6fROg",
  "https://www.youtube.com/watch?v=O52zDyxg5QI",
  "https://www.youtube.com/watch?v=ccTVAhJU5lg",
  "https://www.youtube.com/watch?v=wAdTV6Uc5eA",
  "https://www.youtube.com/watch?v=RDchI1SLh4Q",
  "https://www.youtube.com/watch?v=yslIWiEjRXw",
  "https://www.youtube.com/watch?v=jPwf4_MVpuE",
  "https://www.youtube.com/watch?v=iXLaEkB3J0I",
  "https://www.youtube.com/watch?v=Wr9b5aYA4mI",
  "https://www.youtube.com/watch?v=CjtIYbmVfck",
  "https://www.youtube.com/watch?v=LwihxyJ4V20",
  "https://www.youtube.com/watch?v=X7tdyNFpp1g",
  "https://www.youtube.com/watch?v=hfF9bhaBuvw",
  "https://www.youtube.com/watch?v=C83AXUplYb4",
  "https://www.youtube.com/watch?v=xwAWSh35uuw",
  "https://www.youtube.com/watch?v=agEzlv9n9Eg",
  "https://www.youtube.com/watch?v=xxMRjVwCQ3o",
  "https://www.youtube.com/watch?v=LSkq-wHMxQY",
  "https://www.youtube.com/watch?v=a8nJQr5rBGs",
  "https://www.youtube.com/watch?v=dQ7Sd6PGLdA",
  "https://www.youtube.com/watch?v=gaNLXSEUVRw",
  "https://www.youtube.com/watch?v=kfIQBC0hrII",
  "https://www.youtube.com/watch?v=rCXqDE9G53A",
  "https://www.youtube.com/watch?v=Is8U7W-IjmI",
  "https://www.youtube.com/watch?v=X5Ew8btlVbQ",
  "https://www.youtube.com/watch?v=WUN-183KH7M",
  "https://www.youtube.com/watch?v=IQms8zArI7w",
  "https://www.youtube.com/watch?v=sm3xXTfDtGE",
  "https://www.youtube.com/watch?v=icMG4FEFg9w",
  "https://www.youtube.com/watch?v=74OOcuVMDzE",
  "https://www.youtube.com/watch?v=Ng-ApqGu30Q",
  "https://www.youtube.com/watch?v=LDmo-aR7ZUo",
  "https://www.youtube.com/watch?v=cSCXEW0tda8",
  "https://www.youtube.com/watch?v=IFfE7Ex3NgA",
  "https://www.youtube.com/watch?v=MAuXQgZsq3Y",
  "https://www.youtube.com/watch?v=S3rx8s-ltwI",
  "https://www.youtube.com/watch?v=tBNCeoHxXN4",
  "https://www.youtube.com/watch?v=RManbLSTXuc",
  "https://www.youtube.com/watch?v=zmiOmpo27F8",
  "https://www.youtube.com/watch?v=7dE4IjDQJmE",
  "https://www.youtube.com/watch?v=8ir0mYl8Fpo",
  "https://www.youtube.com/watch?v=g-tfZ65pdn4",
  "https://www.youtube.com/watch?v=qYGbAnBDxYI",
  "https://www.youtube.com/watch?v=8RyR0J8zbbU",
  "https://www.youtube.com/watch?v=Bxvp5bQ7Qa4",
  "https://www.youtube.com/watch?v=_r-g8wU-0o8",
  "https://www.youtube.com/watch?v=6HYjCFkmDPA",
  "https://www.youtube.com/watch?v=vALZRyqT_Jg",
  "https://www.youtube.com/watch?v=TCAY1XZwMrs",
  "https://www.youtube.com/watch?v=gJkI89hErsI",
  "https://www.youtube.com/watch?v=Zhfodg0io7M",
  "https://www.youtube.com/watch?v=AhQErfreEOE",
  "https://www.youtube.com/watch?v=-JhoMGoAfFc",
  "https://www.youtube.com/watch?v=ahSMyLJcp48",
  "https://www.youtube.com/watch?v=rB_nzP76ktc",
  "https://www.youtube.com/watch?v=PxvOdMbj6gA",
  "https://www.youtube.com/watch?v=6xzPVxf67m8",
  "https://www.youtube.com/watch?v=AoRAAex6nBk",
  "https://www.youtube.com/watch?v=c-dZM2mHc7c",
  "https://www.youtube.com/watch?v=rTViPLUmYAc",
  "https://www.youtube.com/watch?v=aVGYOlIzV0A",
  "https://www.youtube.com/watch?v=E12mQwi93s4",
  "https://www.youtube.com/watch?v=gFRtAAmiFbE",
  "https://www.youtube.com/watch?v=tujkoXI8rWM",
  "https://www.youtube.com/watch?v=x3P3N3VGvtU"
];

const existingIds = new Set(webcams.map(w => w.id));
let addedCount = 0;

newUrls.forEach(url => {
  const match = url.match(/v=([^&]+)/);
  if (match) {
    const id = match[1];
    if (!existingIds.has(id)) {
      webcams.push({
        id: id,
        name: `New Webcam ${id}`,
        coordinates: { lat: 0, lng: 0 },
        city: "Unknown",
        country: "Unknown",
        streamUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`,
        thumbnailUrl: `https://i.ytimg.com/vi/${id}/mqdefault_live.jpg`,
        category: "added-automatically",
        isLive: true,
        description: "",
        provider: "YouTube"
      });
      existingIds.add(id);
      addedCount++;
    }
  }
});

console.log(`Added ${addedCount} new webcams.`);
fs.writeFileSync(CONFIG_PATH, JSON.stringify(webcams, null, 2));
