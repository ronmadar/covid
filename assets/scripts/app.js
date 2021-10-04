let country = document.getElementById("country");
let year = document.getElementById("year");
let month = document.getElementById("month");
let day = document.getElementById("day");

let firstCountry = document.getElementById("firstCountry");
let firstYear = document.getElementById("firstYear");
let firstMonth = document.getElementById("firstMonth");
let firstDay = document.getElementById("firstDay");


let secCountry = document.getElementById("secCountry");
let secondeYear = document.getElementById("secondeYear");
let secondeMonth = document.getElementById("secondeMonth");
let secondeDay = document.getElementById("secondeDay");


let submitFirst = document.getElementById("submitFirst");
let submitSeco = document.getElementById("submitSeco");


let inputCountry = document.getElementById("inputCountryAdd");

let addCountryButton = document.getElementById("add_button");
let removeCountryButton = document.getElementById("remove_button");
let getCountriesButton = document.getElementById("get_button");
let deathsCountriesButton = document.getElementById("deaths_button");



//Rreturn the resulte Daily new confirmed cases in a given country
const renderResult = (arrayDate,y,m,d) => {
    let allDateUser = `${y.value}-${m.value}-${d.value}`;
    let result = 0 ;
    let oneDayBeforeDate=""; 
    let oneDayBeforeValue = 0;

    for (const [key, value] of Object.entries(arrayDate)) {   
        if(`${key}` === allDateUser){    
            result = `${value}`;
            result = result - oneDayBeforeValue;
            if(result < 0){
                result *= (-1);
            }
            console.log(`${country.value}, confirmed case ${key}: ${value}, one Day Before Date: ${oneDayBeforeDate}: ${oneDayBeforeValue}`);
            return result;
        }
        oneDayBeforeDate = `${key}`;
        oneDayBeforeValue = `${value}`;
    }
};

//Call by country user with fetch and calculate with renderResult function.
const dailyNewConfirmedCases = () => {
    let res=0;

    if (checkCondition(country,year,month,day)==true) {
        fetch(`https://covid-api.mmediagroup.fr/v1/history?country=${country.value}&status=deaths`)
            .then(res => {
                return res.json()
            })
            .then(data => {
                const myArr = data["All"]["dates"];
                res = renderResult(myArr,year,month,day);           
                console.log("the resulte is "+res);
            }
            ).catch(error => console.log("Error !you must wirte in this format tha date, example: day: 04 mounth: 09 year: 2021 AND name of country like France,Germany,Italy Etc.."));      
    }else{
        alert("Error !you must wirte in this format tha date, example: day: 04 mounth: 09 year: 2021 AND name of country like France,Germany,Italy Etc...");
    }
};


///////////////////////two mission ///////////////////////////////

//Iniatilized 
let percentagesDiffer = [];

let firstPopu = 0;
let secPopu = 0;
let firstCountryCurrValue = 0;
let firstCountryValueBefore = 0;
let secCountryCurrValue = 0;
let secCountryValueBefore = 0;

//Check if is valide.
const checkCondition = (c,y,m,d) =>{
    if(c != "" 
       && d.value.length == 2
       && m.value.length == 2
       && y!= ""
    ){
        return true;
    }
    return false;
}

//The formula(from the mission 2 page) for calculate the percentage between two country.
const clacDailyDiffer = (firCon ,firPop , secCon ,secPop) => {
    //console.log("WE R IN clacDailyDiffer");
    //console.log(firCon,firPop,secCon,secPop);

    let allResult, result1, result2 = 0 ;
    result1 = firCon / firPop;
    result2 = secCon / secPop;
    allResult = result1 - result2;
    return allResult;
};

//Calculate the curr date and one day before the curr.
const renderDate = (arrayDate,y,m,d) => {
   
    let allDateUser = `${y.value}-${m.value}-${d.value}`;
    let prev_date=""; 
    let prev_date_val = 0;
    let strToSend = ``;
    for (const key in arrayDate) {
        if (Object.hasOwnProperty.call(arrayDate, key)) {
            let date_val = arrayDate[key];
            if (key == allDateUser) {
                first_country_string = "selected date first country :  " + key + " confirmed  : " + date_val;
                sec_country_string = "selected date first country prev:  " + prev_date + " confirmed prev: " + prev_date_val;
                // console.log(first_country_string);
                // console.log(sec_country_string);
                strToSend = `${date_val} ${prev_date_val}`
            } 
            prev_date = key;
            prev_date_val = date_val;
        }
    }
    return strToSend;
};


async function firstCountryToCompare() {
    if (checkCondition(firstCountry,firstYear,firstMonth,firstDay)==true) 
    {
    const response = await fetch(`https://covid-api.mmediagroup.fr/v1/history?country=${firstCountry.value}&status=deaths`);
    const data = await response.json();
    return data;
    }
  }
firstCountryToCompare().then(data => {
    data; // fetched data
     //All my date
     const myArr = data["All"]["dates"];
     //The pupolation for calculte 
     firstPopu = data["All"]["population"];           
     //Resulte value - number of the confirmed cases.
     let str =  renderDate(myArr,firstYear,firstMonth,firstDay);
     //Console.log("str FUNCTION1  "+str);
     const words = str.split(' ');

     firstCountryCurrValue =words[0];
     firstCountryValueBefore = words[1];
    }).catch(error => {
        console.log("Error !you must wirte in this format tha date, example: day: 04 mounth: 09 year: 2021 AND name of country like France,Germany,Italy Etc..");   

     //Send them for continue calculte
     //secCountryToCompare(firstPopu,firstCountryCurrValue,firstCountryValueBefore);    
});


async function secCountryToCompare(){
    if (checkCondition(secCountry,secondeYear,secondeMonth,secondeDay)==true) 
    {
    const response = await fetch(`https://covid-api.mmediagroup.fr/v1/history?country=${secCountry.value}&status=deaths`);
    const data = await response.json();
    return data;
    }
  }
secCountryToCompare().then(data => {
    data; // fetched data
    const myArr = data["All"]["dates"];
    secPopu = data["All"]["population"];           
    let str =  renderDate(myArr,secondeYear,secondeMonth,secondeDay);
    const words = str.split(' ');
    secCountryCurrValue = words[0];
    secCountryValueBefore = words[1];
}).catch(error => {
    console.log("Error !you must wirte in this format tha date, example: day: 04 mounth: 09 year: 2021 AND name of country like France,Germany,Italy Etc..");   
});

//Function triger to calculte the diffrence.
const compareTwoCountry = () => {
    firstCountryToCompare();
    secCountryToCompare();
    //Check if all the parameter is valide
    //According to the fomula these parametr is required.

    if(firstCountryCurrValue!=0
        &&secCountryCurrValue!=0
        &&firstCountryValueBefore!=0
        &&secCountryValueBefore!=0
     ){
         //Console.log(F_C_C_V,secCountryCurrValue,F_C_V_B,secCountryValueBefore);
         //Send them to clacDailyDiffer to calculte the diffrence.
         percentagesDiffer.push(clacDailyDiffer(firstCountryCurrValue,firstPopu,secCountryCurrValue,secPopu).toFixed(6)); 
         percentagesDiffer.push(clacDailyDiffer(firstCountryValueBefore,firstPopu,secCountryValueBefore,secPopu).toFixed(6));
         console.log("THIS IS THE ARRAY PERCETAGE ");
         //Printe the resulte
         for(let i =0 ;i < percentagesDiffer.length;i++){
             console.log(percentagesDiffer[i]);
         }
     }

};        
        


///////////////////////three mission ///////////////////////////////

let listOfAllCountris = [];
let listToshow = [];

//Add country
const addCountryFunc = () =>{
    let tempValToAdd = inputCountry.value;
    let isValide = true;
    if(tempValToAdd != "" )
    {
        fetch(`https://covid-api.mmediagroup.fr/v1/cases?country=${tempValToAdd}`)
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            
            if(listOfAllCountris.length !== 0){
                for(let j= 0 ; j<listOfAllCountris.length ;j++){
                    if( listOfAllCountris[j].country == inputCountry.value ){
                        console.log("Is NOT Valide input");
                        console.log(listOfAllCountris);
                        isValide =false;
                    }
                }
            }
            const valueToAdd = data["All"];
            const nameCountry = data["All"]["country"];
            if(isValide){     
                if(tempValToAdd === nameCountry){
                    listOfAllCountris.push(valueToAdd);
                    listOfAllCountris.forEach( (item,idx, ourlist) =>{
                        if(listToshow.includes(ourlist[idx].country) == false){
                            listToshow.push(ourlist[idx].country);
                            console.log("success add.."); 
                        }
                    });
                }else{
                    console.log("Your input not found in the API - try other country please.");
                }
            }else{
                console.log("You can't writing duplicate countries")
            }
        }).catch(error => console.log('ERROR'+error));
    }else{
    console.log("You can't add this country is Not Valide!")
    }
}
//Remove country
const removeCountryFunc = () =>{
    let isValide = false;
    if (listOfAllCountris.length !== 0) {
        for(let j= 0 ; j<listOfAllCountris.length ;j++){
            if( listOfAllCountris[j].country == inputCountry.value ){
                console.log("Valide input!");
                isValide =true;
            }
        }
        if (isValide){
            for( let i = 0; i<listOfAllCountris.length ;i++){
                console.log(listOfAllCountris[i].country);
                  if(listOfAllCountris[i].country == inputCountry.value){
                    listOfAllCountris[i] = null;
                  }   
            } 
            listOfAllCountris = listOfAllCountris.filter( (el) => {
                console.log("success remove.."); 
                return el != null;
            });
        }else{
            console.log("You can`t delet this country is NOT in the list");
        } 
    }else {
        console.log("Array is empty!")
        console.log("you can't remove") 
    }
}

// Show all the list you add.
const getListCountriesFunc = () =>{
    let myStringOutput = "";
    if (listOfAllCountris.length !== 0) {
        for(let j= 0 ; j<listOfAllCountris.length ;j++){
            if(j < listOfAllCountris.length - 1 ){
                myStringOutput += listOfAllCountris[j].country +" , "
            }else{
                myStringOutput += listOfAllCountris[j].country;
            }
        } 
    }else if (listOfAllCountris.length === 0) {
            console.log("this list is empty");   
    }
    console.log(" [ "+ myStringOutput +" ] ");    
}

const allDeathsListCountriesFunc = () =>{
    for(let j= 0 ; j<listOfAllCountris.length ;j++){
           console.log(listOfAllCountris[j].country+ ", number of deaths : " +" { "+listOfAllCountris[j].deaths+" } ");
    } 
}


////////////////////////// All button ///////////////////////
submitFirst.addEventListener('click', dailyNewConfirmedCases);
submitSeco.addEventListener('click',compareTwoCountry);


addCountryButton.addEventListener('click',addCountryFunc);
removeCountryButton.addEventListener('click',removeCountryFunc);
getCountriesButton.addEventListener('click',getListCountriesFunc);
deathsCountriesButton.addEventListener('click', allDeathsListCountriesFunc);

