const database = require('../services/database');
const ArbetsmarknadsDataResponse = require('../model/ArbetsmarknadsData');
/**
 * @param afDataResponseDoc
 * @param afkodEntry
 * @param valueToSet
 * @returns {*}
 * Set value in response document, according to afKod array.
 */
setValueInResponse = (afDataResponseDoc, afkodEntry, valueToSet) => {
    let splitted = afkodEntry.name.split(".");
    switch (splitted.length) {
        case 1:
            afDataResponseDoc[splitted[0]] = valueToSet;
            break;
        case 2:
            afDataResponseDoc[splitted[0]][splitted[1]] = valueToSet;
            break;
        case 3:
            afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]] = valueToSet;
            break;
        case 4:
            afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]][splitted[3]] = valueToSet;
            break;
        case 5:
            afDataResponseDoc[splitted[0]][splitted[1]][splitted[2]][splitted[3]][splitted[4]] = valueToSet;
            break;
        default :
            throw new Error("To deep document >4");
    }
    return afDataResponseDoc;
};


//TODO: look into express body-parser
//TODO: put bindings as a object with name and value.
async function platsQueries(binds) {
//TODO: executeMany()?  http://oracle.github.io/node-oracledb/doc/api.html
    try {
        const query = "select sum(antal) as antal from PLATSER where lanskod=:lanskod and manad=:manad and afkod=:afkod";
        const dbResult = await database.executeSQLStatement(query, binds);
        return dbResult.rows[0].ANTAL;
    } catch (error) {
        console.log(error); //TODO: remove this
        throw error;
    }
}
async function sokandeQueries(binds,afkodValue) {
//TODO: executeMany()?  http://oracle.github.io/node-oracledb/doc/api.html
    try {
        const query = "select sum(antal) as antal from SOKANDE where lanskod=:lanskod and manad=:manad and afkod in ('" + afkodValue.toString() + "')";
        const dbResult = await database.executeSQLStatement(query,binds);
        return dbResult.rows[0].ANTAL==null ? 0 : dbResult.rows[0].ANTAL;
    } catch (error) {
        console.log(error); //TODO: remove this
        throw error;
    }
}

/*
 * This is taking to much time it is a very bad solution...
 * Fix:
 * Pre catch all possible answers (put it in a mongoDB or a big json doc) ?
 * Could better SQL fix anything ?
 *
 */
async function getNumFromSokande(req, res, next){
    try{
        res.status(200).json(await numFromSokande(req.query.lanskod, req.query.manad ));
    }catch (error) {
        next(error);
    }
}

 numFromSokande = async (lanskod, manad) => {
     //TODO: add usage of kommun, kon and fodelseland
     //TODO: Must find SQL to do fewer requests or create more connections, look into the connection handling, REUSE...
     try{
         let binds = {};
         binds.lanskod = lanskod;
         binds.manad = manad;
         let afkoderMap = [
             {name:'sokande_som_har_fatt_arbete', value:'1'},
             {name:'nyinskrivna_sokande', value:'2'},
             {name:'oppet_arbetslosa_och_sokande_i_program.totalt', value: "4','56', '103', '35', '93', '12', '81', '85', '23', '70', '104', '105"},
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
         let response = new ArbetsmarknadsDataResponse;
         await numFromPlats( response,lanskod, manad, null, null, null, ['06', '07']);
         for (const afkod of afkoderMap) {
             setValueInResponse(response, afkod, await sokandeQueries(binds, afkod.value));
         }
         return response;

     }catch (error) {
         throw error;
     }
};
/*
not: Choosed not to use "Etablering"
 */
numFromPlats = async (responseJSON, lanskod, manad, kommun, fodelseland, kon, afkoder) => {
//TODO: add usage of kommun, kon and fodelseland
    const binds = {};
    binds.lanskod = lanskod;
    binds.manad = manad;

    for (const afkod of afkoder) {
        binds.afkod = afkod;
        let num = await platsQueries(binds);
        switch (afkod) {
            case '06':
                responseJSON.nya_anmalda_platser = num;
                break;
            case '07':
                responseJSON.kvarstaende_platser = num;
                break;
        }
    }
    return responseJSON;
};

async function getNumFromPlats(req, res, next) {
    try {
        //TODO: validate input parameters
        let lanskod = req.query.lanskod;
        let manad = req.query.manad;
        let responseDoc = new ArbetsmarknadsDataResponse();
        let afkoder = ['06', '07'];
        res.status(200).json( await numFromPlats( responseDoc,lanskod, manad, null, null, null, afkoder));
    } catch (error) {
        next(error);
    }
}

module.exports.getNumFromPlats = getNumFromPlats;
module.exports.getNumFromSokande = getNumFromSokande;