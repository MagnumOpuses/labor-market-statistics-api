ArbetsmarknadsDataResponse = require('../model/ArbetsmarknadsData');
adata = new ArbetsmarknadsDataResponse;
//bdata = new ArbetsmarknadsDataResponse;



console.log('--------------------------------------------------');
//console.log(JSON.stringify(adata, null, 4));
//adata.nya_anmalda_platser = 10;
//bdata.nya_anmalda_platser = 1000;

let afkoder = [{name:'sokande_som_har_fatt_arbete', value:'1'},
    {name:'nyinskrivna_sokande', value:'2'},
    {name:'oppet_arbetslosa_och_sokande_i_program.totalt', value: "4','56', '103', '35', '93', '12', '81', '85', '23', '70', '104', '105"}];

setValueInResponse(adata, afkoder[2], 20000);

console.log('--------------------------------------------------');
console.log(adata);
//console.log('--------------------------------------------------');
//console.log(bdata);

