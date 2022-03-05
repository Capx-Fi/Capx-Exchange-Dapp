const inputJson = require("./data.json");


export function sortIncomingData(inputJson) {
    var keys = Object.keys(inputJson);
    const map1 = keys.map(x => parseInt(x));
    map1.sort()
    var sortedOBJ = {}
    map1.forEach(element => {
        sortedOBJ[element.toString()] = inputJson[element.toString()]
    });
    intervalCut(1638016336,1646574768,360000,sortedOBJ)


}

function intervalCut(start,end,intervap,data) {
    
    let k = [];

    
    let retval,lval;
    for (let index = start; index < end; index+=intervap) {
        retval = breakData(index,index+intervap,data)
        if(retval["max"]!=null)
            lval = retval
        else
            retval = lval
        k.push(retval)
        
    }
    // console.log(k)

}

function breakData(startts,endts,fulldata) {
    
    var keys = Object.keys(fulldata);
    let map2 = []
    let jdata = {}
    keys.forEach(element => {
        element = parseInt(element)
        if(element>=startts && element<endts){
            jdata[element.toString()] = fulldata[element.toString()]
        }
    });
    
    let keyp = startts.toString()

    let outp = pasedData(jdata)
    outp["date"] = startts.toString()
    
    return(outp)


}




function pasedData(jsondata) {
    
    let nobj = {
        "open":null,
        "close":null,
        "max":null,
        "min":null
    }
    var keys = Object.keys(jsondata);
    const map1 = keys.map(x => parseInt(x));
    map1.sort()
    if(map1.length>0){

        // nobj["open"]["timestamp"] = map1[0]
        nobj["open"] = jsondata[map1[0].toString()]
        // nobj["close"]["timestamp"] = map1[map1.length-1]
        nobj["close"] = jsondata[map1[map1.length-1].toString()]

        let max = jsondata[map1[0].toString()]
        // nobj["max"]["timestamp"] = map1[0]
        nobj["max"] = jsondata[map1[0].toString()]
        
        let min = jsondata[map1[0].toString()]
        // nobj["min"]["timestamp"] = map1[0]
        nobj["min"] = jsondata[map1[0].toString()]
        
        
        map1.forEach(element => {
            if(jsondata[element.toString()]>max){
                max=jsondata[element.toString()]
                // nobj["max"]["timestamp"] = element
                nobj["max"] = jsondata[element.toString()]
            }
            
            if(jsondata[element.toString()]<min){
                min=jsondata[element.toString()]
                // nobj["min"]["timestamp"] = element
                nobj["min"] = jsondata[element.toString()]
                
            }
        });
        
    }
    
   
    return(nobj)
    

}

// sortIncomingData(inputJson)

// Arguments : Start Time, End Time, Interval to be divided in seconds, full data