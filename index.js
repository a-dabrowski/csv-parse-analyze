//start doing class
class csvAnalyzer {
    constructor(csvFile) {
        'use strict';
        this.preParsed = csvFile;
        //return an Object output so we can use it in render
        //date collection
    }

    interpretData(data) { //full csv is loaded
       let csvExport = 'data:text/csv;charset=utf-8,';
        const startIndex = data.data.findIndex((el) => { return el[0] === 'Report Fields' })+1;
        //FIND INDEX OF RESULTS: DONE
        console.log(startIndex);
        const endIndex = data.data.findIndex((el) => { return el[0] === 'Grand Total:' });
        console.log(data.data, endIndex);
        const exportDcm = data.data.slice(startIndex, endIndex);
        exportDcm.forEach((el) => {
            el.unshift('DCM');
            let row = el.join(',');
            csvExport += row + '\r\n';

        });//works
      //  console.log(exportDcm, csvExport);
 

        //FIND INDEX OF GRAND TOTAL DONE
        //APPEND COLUMN DCM        
        //return console.log(data);
        const encodedURI = encodeURI(csvExport);
       // window.open(encodedURI);//POP-up Warning



        const link = document.createElement('a');
        link.setAttribute('href', encodedURI);
        link.setAttribute('download', 'csv_export.csv');
        link.innerHTML = 'Download cleaned data';
        document.body.appendChild(link);//append link with filename and csv extension
    }

    initiateParse() {
        this.reader = new FileReader();
        //  console.log(this);
        this.reader.readAsText(this.preParsed);
        this.reader.onload = this.loadHandler.bind(this);
        this.reader.onerror = this.errorHandler;
    }
    errorHandler(event) {
        return event.toString();
    }
    loadHandler(event) {
        this.parsedFile = Papa.parse(event.target.result); //Papa provided from other file
        this.interpretData(this.parsedFile);
    }
}

const upload = document.getElementById('analyze');

upload.addEventListener('click', function (e) {
    e.preventDefault();
    let analyzer = new csvAnalyzer(document.getElementById('file').files[0]);
    analyzer.initiateParse();
});