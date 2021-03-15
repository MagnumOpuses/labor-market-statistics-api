const {chain}  = require('stream-chain');
const fs   = require('fs');
const {parser} = require('stream-json');
const {pick}   = require('stream-json/filters/Pick');
const {ignore} = require('stream-json/filters/Ignore');
const {streamValues} = require('stream-json/streamers/StreamValues');
const {streamArray} = require('stream-json/streamers/StreamArray');
const {replace} = require('stream-json/filters/Replace');

let sokande_som_har_fatt_arbete = 0; //1
let nyinskrivna_sokande = 0;//2
let oppet_arbetslosa_och_sokande_i_program_utan_arbete_mer_an_6_manade = 0; //86

let afkoderMap = [
    {name:'sokande_som_har_fatt_arbete', value:'1'},
    {name:'nyinskrivna_sokande', value:'2'},
    //{name:'oppet_arbetslosa_och_sokande_i_program.totalt', value: "4','56', '103', '35', '93', '12', '81', '85', '23', '70', '104', '105"},
    {name: 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_6_manader', value: '86'},
    {name: 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_12_manader', value:'87'},
    {name: 'oppet_arbetslosa_och_sokande_i_program.utan_arbete_mer_an_24_manader', value: '88'},
    {name: 'oppet_arbetslosa', value: '4'},
    // {name: 'sokande_i_program.totalt', value: "56', '103', '35', '93', '12', '81', '85', '23', '70', '104', '105"},
    {name: 'sokande_i_program.arbetsmarknadsutbildning.totalt', value: '56'},
    {name: 'sokande_i_program.arbetsmarknadsutbildning.validering', value: '103'},
    {name: 'sokande_i_program.arbetspraktik.totalt', value: '35'},
    {name: 'sokande_i_program.arbetspraktik.arbetstraning_for_vissa_nyanlanda', value: '93'},
    {name: 'sokande_i_program.stod_till_start_av_naringsverksamhet', value: '12'},
    {name: 'sokande_i_program.jobbgaranti_for_ungdomar', value: '81'},
    {name: 'sokande_i_program.forberedande_insatser', value:'85'},
    {name: 'sokande_i_program.projekt_med_arbetsmarknadspolitisk_inriktning', value:'23'},
    {name: 'sokande_i_program.job_och_utvecklingsgarantin', value:'70'},
    {name: 'sokande_i_program.etableringsprogrammet.exklusive_karlaggning', value:'104'},
    {name: 'sokande_i_program.etableringsprogrammet.kartlaggning', value:'105'},
    //{name: 'sokande_som_har_arbete_utan_stod.totalt', value:"7','8','9','36"}, //Sum doesn't have to be fetched from database
    {name: 'sokande_som_har_arbete_utan_stod.deltidsarbetslosa', value:'7'},
    {name: 'sokande_som_har_arbete_utan_stod.tillfallig_timanstallning', value:'8'},
    {name: 'sokande_som_har_arbete_utan_stod.sokande_med_tillfalligt_arbete', value:'9'},
    {name: 'sokande_som_har_arbete_utan_stod.ombytessokande', value:'36'},
    //{name:'sokande_som_har_arbete_med_stod.totalt', value:''},
    //{name:'sokande_som_har_arbete_med_stod.anstallningsstod.totalt', value:''},//Sum doesn't have to be fetched from database
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.indtroduktionsjobb', value:'106'},
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.sarskilt_anstallningsstod', value:'15'},
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.forstarkt_sarskilt_anstallningsstod', value:'89'},
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.instegsjobb', value:'78'},
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.trainee_brist', value:'95'},
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.trainee_valfard', value:'96'},
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.extratjanst', value:'97'},
    {name:'sokande_som_har_arbete_med_stod.anstallningsstod.moderna_beredskapsjobb', value:'102'},
    //{name:'sokande_som_har_arbete_med_stod.sarskilda_insatser.totalt', value:''}, //Sum doesn't have to be fetched from database
    {name:'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_anstallning', value:'10'},
    {name:'sokande_som_har_arbete_med_stod.sarskilda_insatser.offenligt_skyddat_arbete', value:'11'},
    {name:'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_utveckling_i_anstallning', value:'26'},
    {name:'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_utveckling_i_anstallning_hos_samhall', value:'107'},
    {name:'sokande_som_har_arbete_med_stod.sarskilda_insatser.lonebidrag_for_trygghet_i_anstallning', value:'27'},
    {name:'ovriga_inskrivna_vid_arbetsformedlingen.totalt', value:"100', '45"},
    {name:'ovriga_inskrivna_vid_arbetsformedlingen.arbetsokande_med_forhinder', value:'45'},
    {name: 'nystartsjobb', value:'79'},
    {name: 'yrkesintroduktion', value:'92'}
];
const lanskodAndKommunkod= (data,lanskod, kommunkod) => {
    if(data.value.LANSKOD === lanskod && kommunkod != null && data.value.KOMMUNKOD === kommunkod){
        //console.log('return');
        return data.value;
    }else{
        return null;
    }

};

const getSokandeData = (yearMonth, lanskod, kommunkod=null, kon=null) => {
    let filterFunc= null;
    let respDoc = [];
    const pipeline = chain([
        fs.createReadStream('../resources/sokande.'+yearMonth+'.json'),
        parser(),
        streamArray(),
        data = (data) => {
            let retVal = null;
            if(filterFunc!=null) {
                return filterFunc(data, lanskod, kommunkod);
            }
            //Instansiera ett "filter" object eftersom det är ett filter per session...
            //TODO: if filer instance exists -> use it, else find which filter shold bee used for the whole request
            //if switch value exists....then use switch instead of "if then"
            if (data.value.LANSKOD === lanskod && kommunkod === null) {
                 //console.log(JSON.stringify(data.value));
                 retVal = data.value;
            }else if (data.value.LANSKOD === lanskod && kommunkod != null && data.value.KOMMUNKOD === kommunkod) {
                filterFunc = lanskodAndKommunkod;
                retVal = filterFunc(data, lanskod, kommunkod);
            }
            return retVal;
        }]);

    let objectCounter = 0;
    pipeline.on('data', (data) => {
        //TODO: Create a document for response
        objectCounter += data.ANTAL;
        respDoc.push(data);
        //++objectCounter;
        //console.log(JSON.stringify(data));
    });
/* //TODO: this is not for the 'Raw output'
   pipeline.on('data', (data) => {
        switch (data.AFKOD) {
            case 1:
                sokande_som_har_fatt_arbete += data.ANTAL;
                break;
            case 2:
                nyinskrivna_sokande += data.ANTAL;
                break;
                //oppet_arbetslosa_och_sokande_i_program.totalt
        }
    });
*/
    pipeline.on('end', () => {
        console.log(JSON.stringify(respDoc));
        //console.log(`sokande_som_har_fatt_arbete =  ${sokande_som_har_fatt_arbete}`);
        //console.log(`nyinskrivna_sokande = ${nyinskrivna_sokande} `);
    });
};

//getSokandeData('2020-10', '06', '0687');
//JSON.stringify(getSokandeData('2020-10', '06'));
JSON.stringify(getSokandeData('2020-10', '06'));

