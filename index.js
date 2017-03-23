const upload = document.getElementById('analyze');

upload.addEventListener('click', function (e) {
    e.preventDefault();
    let x = document.getElementById('file').files[0];
    //console.log(x);
    getAsText(x); //asynchronous problem?
});


function getAsText(fileToRead) {
    const reader = new FileReader();

    reader.readAsText(fileToRead); //reading file
    // console.log("reading");
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function errorHandler(evt) {
    // console.log(evt);
    return evt.toString();
}

function loadHandler(evt) {
    const result = Papa.parse(evt.target.result);
    // console.log("resul;t")
    return callback(result); //callback return?
}

function callback(obj) { //unnecessary?
    let result = countOccurrence(obj);
    //console.log('test analyzing');
    // console.log(result, "call");
    return obj;
}



//part for analyzing given object converted from csv

function countOccurrence(obj) {
    const products = []; //types of products so far found
    
    console.log(obj.data);
    const wydawcyOnly = obj.data.filter(function(e){
       return !/PARTNERSTWA/.test(e[3]) && !/DART/.test(e[3]);
    });
    const partnerstwaOnly = obj.data.filter(function(e){
        return /PARTNERSTWA/.test(e[3]);
    });
    const dartOnly = obj.data.filter(function(e){
        return /DART/.test(e[3]);
    });
    console.log(wydawcyOnly);
    for (let i = 19; i < obj.data.length; i++) {
        //console.log(googleRegex.test(obj.data[i][3]));
        //console.log(partnerRegex.test(obj.data[i][3]));
        //   console.log(typeof obj.data[i]);
        //   console.log(obj.data[i]);
        //   console.log(obj.data[i][0]);
        if (!googleRegex.test(obj.data[i][3]) && !partnerRegex.test(obj.data[i][3])) {//ignores rows with partners or google
            if (products.indexOf(obj.data[i][0]) == -1) {
                //  console.log(products[obj.data[i][0]]);
                let container = [0, 0];
                container[0] = obj.data[i][0];
                container[1] = 1;

                products.push(obj.data[i][0]); //without this it just pushes every row as an idependent object
                products.push(container);
                //container = [];
            } else {
                let index = products.indexOf(obj.data[i][0]);
                products[index + 1][1] += 1; // get possible 
            }
        }
    } // end of counting ocurence loop of activity
    console.log(products);
    return products;
}