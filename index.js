//start doing class
class csvAnalyzer {
  constructor(csvFile) {
    "use strict";
    this.preParsed = csvFile;
  }
  interpretData(data) {
    //full csv is loaded
    let csvExport = "data:text/csv;charset=utf-8,";
    const startIndex =
      data.data.findIndex(el => {
        //index with header fields
        return el[0] === "Report Fields";
      }) + 1;
    const endIndex = data.data.findIndex(el => {
      //index of last row with data Grand total sum
      return el[0] === "Grand Total:";
    });
    const placemendIdIndex = data.data[startIndex].findIndex(el => {
      return el === "Placement ID";
    });
    const placementIndex = data.data[startIndex].findIndex(el => {
      //index of column with placement name
      return el === "Placement";
    });
    const adIdIndex = data.data[startIndex].findIndex(el => {
      return el === "Ad ID";
    })
    const adIndex = data.data[startIndex].findIndex(el => {
      //index of column containing Ad name
      return el === "Ad";
    });
    const siteIdIndex = data.data[startIndex].findIndex(el => {
      return el === "Site ID";
    })
    const clickUrlIndex = data.data[startIndex].findIndex(el => {
      return el === "Click-through URL";
    });
    const exportDcm = data.data.slice(startIndex, endIndex);
    exportDcm.forEach((el, i) => {
      el[adIndex] = el[adIndex].replace(/[,]/g, "");
      el[placementIndex] = el[placementIndex].replace(/[,]/g, "");
      el[clickUrlIndex] = el[clickUrlIndex].replace(/["]/g, "");
      console.log(el[clickUrlIndex]);
      el[el.length - 1] = el[el.length - 1].replace(/.00/, "");
      el.unshift("DCM");
      let row = el.join(",");// test without space
      if (i == exportDcm.length - 1) {
        csvExport += row;
        csvExport += "\r\n"; //SREDNIK
      } else {
        csvExport += row;
        csvExport += "\r\n";
      }
    });
    const encodedURI = encodeURI(csvExport);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "csv_export.csv");
    link.innerHTML = "Download cleaned data";
    document.body.appendChild(link); //append link with filename and csv extension
  }

  initiateParse() {
    this.reader = new FileReader();
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

const upload = document.getElementById("analyze");

upload.addEventListener("click", function(e) {
  e.preventDefault();
  let analyzer = new csvAnalyzer(document.getElementById("file").files[0]);
  analyzer.initiateParse();
});
