
//Capitura os dados da API
async function getHashtemporaryState() {
  try {
    const hashTemp = await fetch('https://sistemaagely.com.br:8345/recrutamentoagely/covid?service=uf&filter=mg');
    const data = await hashTemp.json();

    const hashMG = await fetch(`https://sistemaagely.com.br:8345/recrutamentoagely/covid?service=cidade&filter=passos&hash=${data.hash}`);
    const dataHashMG = await hashMG.json();

    const hashCity = await fetch(`https://sistemaagely.com.br:8345/recrutamentoagely/covid?service=dados&hash=${dataHashMG.hash}`);
    const { dados }  = await hashCity.json();

    show(dados);
    mediaAgePeopleInfected(dados);
    mediaAgePeopleNotInfected(dados);
    biggerAndMinorAgePeopleThreeDoses(dados);
    percentagePeopleNotDoses(dados);
    percentagePeopleThreeDoses(dados);
    mediaDosesPeople(dados);
    tableNavegator();
   
  } catch (error) {
    console.error(error);
  }
}

getHashtemporaryState();

//Mostra dados na tabela
function show(dadosCity) {
  let tableData = "";

  dadosCity.map((values)=>{
      tableData +=
      `<tr>
        <td>${values.nome}</td>
        <td>${values.idade}</td>
        <td>${values.doses}</td>
        <td>${values.teveCovid ? "sim" : "não"}</td>
      </tr>`;
  })
  document.getElementById("table_body").innerHTML=tableData;
}

//Média de idade das pessoas que tiveram covid.
function mediaAgePeopleInfected(dadosCity) {
  let infected = dadosCity.filter(values => values.teveCovid);
  let sumAge = 0;

  for (let i = 0; i < infected.length; i++) {
    sumAge = sumAge + infected[i].idade;
  }

  let mediaAge = sumAge / (infected.length);
  let data = `
    <p>Média de idade dos infectados: <span>${mediaAge.toFixed(2)}</span></p>
  `;
  document.getElementById("mediaInfected").innerHTML=data;
}

//Média de idade das pessoas que não tiveram covid.
function mediaAgePeopleNotInfected(dadosCity) {
  let notInfected = dadosCity.filter(values => !values.teveCovid);
  let sumAge = 0;

  for (let i = 0; i < notInfected.length; i++) {
    sumAge = sumAge + notInfected[i].idade;
  }

  let mediaAge = sumAge / (notInfected.length);
  let data = `
  <p>Média de idade dos não infectados: <span>${mediaAge.toFixed(2)}</span></p>
  `;
  document.getElementById("mediaNotInfected").innerHTML=data;
}

//Idade da pessoa mais velha que tomou as 3 doses da vacina.
//Idade da pessoa mais jovem que tomou as 3 doses da vacina.
function biggerAndMinorAgePeopleThreeDoses(dadosCity) {
  let threeDoses = dadosCity.filter(values => values.doses === 3 );
  let posicaoBigger = 0;
  let posicaoMinor = 0;

  for (let i = 1; i < threeDoses.length; i++) {
    if (threeDoses[i].idade > threeDoses[posicaoBigger].idade) {
      posicaoBigger = i;
    }else if(threeDoses[i].idade < threeDoses[posicaoMinor].idade) {
      posicaoMinor = i;
    }
  };
  let data = `
    <p>A maior idade com 3 doses é de: <span> ${threeDoses[posicaoBigger].idade} anos </span></p>
    <p>A menor idade com 3 doses é de: <span> ${threeDoses[posicaoMinor].idade} anos </span></p>
  `;
  document.getElementById("newOld").innerHTML=data;
}

//Porcentagem de pessoas que tiveram covid sem tomar nenhuma dose da vacina.
function percentagePeopleNotDoses(dadosCity) {
  let infected = dadosCity.filter(values => values.teveCovid);
  let notDoses = dadosCity.filter(values => values.doses === 0 );

  let peopleInfected = infected.length;
  let peopleNotDoses = notDoses.length;

  let percentageInfectedNotDoses = (peopleNotDoses * 100) / peopleInfected;

  let data = `
  <p>Infectados e não vacinados: <span> ${percentageInfectedNotDoses.toFixed(2)} %</span></p>
  `;
  document.getElementById("percentage_0_doses").innerHTML=data;
}

//Porcentagem de pessoas que tiveram covid tomando as 3 doses da vacina.
function percentagePeopleThreeDoses(dadosCity) {
  let infected = dadosCity.filter(values => values.teveCovid);
  let threeDoses = dadosCity.filter(values => values.doses === 3 );

  let peopleInfected = infected.length;
  let peopleThreeDoses = threeDoses.length;

  let percentageInfectedThreeDoses = (peopleThreeDoses * 100) / peopleInfected;

  let data = `
  <p>Infectados e vacinados com 3 doses: <span> ${percentageInfectedThreeDoses.toFixed(2)} %</span></p>
  `;
  document.getElementById("percentage_3_doses").innerHTML=data;
}

//Média de doses por pessoas.
function mediaDosesPeople(dadosCity) {
let peopleDoses = dadosCity.filter(values => values.doses !== 0);
let sumDosesPeople = 0;

for (let i = 0; i < peopleDoses.length; i++) {
  sumDosesPeople = sumDosesPeople + peopleDoses[i].doses;
}
let mediaDosesPeople = sumDosesPeople / (peopleDoses.length);

let data = `
<p>Média de doses por pessoa: <span> ${mediaDosesPeople.toFixed(2)}</span></p>
`;
document.getElementById("mediaDosesPeople").innerHTML=data;
}

//Navegação, filtro, ordenação da tabela
function tableNavegator(){
  $(document).ready(function () {
    $('#tableAgyle').DataTable({
        language: {
            lengthMenu: 'mostrando _MENU_ registros por páginas',
            zeroRecords: 'nada encontrado',
            info: 'mostrando página _PAGE_ de _PAGES_',
            infoEmpty: 'nenhum registro disponível',
            infoFiltered: '(filtrado do _MAX_ registros no total)',
            shaerch: 'buscar',
        },
    });
  });
}
