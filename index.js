//start doing class
class csvAnalyzer {
    constructor(csvFile) {
        'use strict';
        this.preParsed = csvFile;
        //return an Object output so we can use it in render
    }
    interpretData() {
        this.partnerships = this.parsedFile.data.filter(function (e) {
            return /PARTNERSTWA/.test(e[3]);
        });
        this.dartGoogle = this.parsedFile.data.filter(function (e) {
            return /DART/.test(e[3]);
        });
        this.publishers = this.parsedFile.data.filter(function (e) {
            return !/DART/.test(e[3]) && !/PARTNERSTWA/.test(e[3]) && /(TYP|Lead|LP)/.test(e[0]) && e[5];
        });
        let output = document.getElementById("output");
        const countPublishers = this.countOcurrence(this.publishers);
        //  console.log(countPublishers);
        const countSearch = this.countOcurrence(this.dartGoogle);
        const countPartnerships = this.countOcurrence(this.partnerships);
        output.innerHTML += "<tr><th>Wydawcy</th></tr>" + countPublishers;
        output.innerHTML += "<tr><th>Partnerstwa</th></tr>" + countPartnerships;
        output.innerHTML += "<tr><th>Google</th></tr>" + countSearch;
        //  console.log(countSearch);
        //    console.log(countPartnerships);
        //now it's time to render
    }

    countOcurrence(fromData, container = []) { // go for render here
        let long = fromData.filter(function (e) {
            return /Długi/.test(e[0]) && /- TYP/.test(e[0]);
        });
       console.log(this.longShortCheck(fromData, long));
       let checkedData = this.longShortCheck(fromData);
        //define regex for lead dlugi
        for (let i = 0; i < checkedData.length; i++) {
         if (container.indexOf(checkedData[i][0]) == -1) {
                container.push(checkedData[i][0]);
                container.push(1);
            } else {
                container[container.indexOf(checkedData[i][0]) + 1]++;
            }
        }
        let render = container.map(function (current, index) {
            if (index % 2 === 0) {
                return "<tr><td>" + current + "</td>";
            } else {
                return "<td>" + current + "</td></tr>";

            }
        });

        // output.innerHTML += container.toString().replace(/,/g, "<br>");
        console.log(render);
        return render;
    }

    longShortCheck (all, long){//or maybe all of it and delete true shorts from it
        let checkedAll = all;
        console.log(long);
        for (let i = all.length-1; i >= 0; i--) {
            if(long != undefined || long != null){
            if (long.find(function(e){if(!long){return undefined;} else return e[5] == all[i][5];}) && /Lead/.test(checkedAll[i])){
                checkedAll.splice(i, 1);//to chyba znaczy ze moze omijac moze lepiej od tylu puscic
            }
        }
        }
       // console.log(checkedAll);
         return checkedAll;        
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
        this.interpretData();
    }
}

const upload = document.getElementById('analyze');

upload.addEventListener('click', function (e) {
    e.preventDefault();
    let analyzer = new csvAnalyzer(document.getElementById('file').files[0]);
    analyzer.initiateParse();
});