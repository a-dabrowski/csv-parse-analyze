//start doing class
class csvAnalyzer {
    constructor(csvFile) {
        'use strict';
        this.preParsed = csvFile;
        //return an Object output so we can use it in render
        //date collection
    }

    interpretData(oneDayCSV) { //full csv is loaded

        let dates = this.filterDays(this.parsedFile.data);
        console.log(dates);
        //change this parsedFile to data from one day
        for (let i = 0; i < dates.length; i++) {
            // console.log(date, typeof date);
            this.partnerships = this.parsedFile.data.filter(function (e) {
                return /PARTNERSTWA/.test(e[3]) && dates[i].includes(e[4]);
            });
            this.dartGoogle = this.parsedFile.data.filter(function (e) {
                return /DART/.test(e[3]) && dates[i].includes(e[4]);
            });
            this.publishers = this.parsedFile.data.filter(function (e) {
                return !/DART/.test(e[3]) && !/PARTNERSTWA/.test(e[3]) && /(TYP|Lead|LP)/.test(e[0]) && e[5] && dates[i].includes(e[4]);
            });
            let output = document.getElementById("output");
            const countPublishers = this.countOcurrence(this.publishers);
            //  console.log(countPublishers);
            const countSearch = this.countOcurrence(this.dartGoogle);
            const countPartnerships = this.countOcurrence(this.partnerships);
            output.innerHTML += `<h1>Day: ${dates[i]}</h1>
            <tr><th>Wydawcy</th></tr> ${countPublishers}
            <tr><th>Partnerstwa</th></tr> ${countPartnerships}
            <tr><th>Google</th></tr> ${countSearch}`;

        }

        //console.log(countSearch);
        //console.log(countPartnerships);
        //now it's time to render
    }

    filterDays(data) {
        let dateCollection = [];

        for (let i = 0; i < data.length; i++) {
            if (dateCollection.indexOf(data[i][4]) == -1 && /\d\d\d\d-\d\d-\d\d/.test(data[i][4])) { //regex works fine
                dateCollection.push(data[i][4]);
            }
        }

        console.log(dateCollection, "before sort");

        dateCollection.sort((a, b) => {

           // a = Number(a.split('-').join(''));
          //  b = Number(b.split('-').join(''));
            console.log(a);
            return new Date(a) - new Date(b);
        }); // sort dates 
        console.log(dateCollection, "after sort");
        return dateCollection; //works good
    }

    countOcurrence(fromData, container = []) { // go for render here
        let long = fromData.filter(function (e) {
            return /Długi/.test(e[0]) && /- TYP/.test(e[0]);
        });
        //console.log(this.longShortCheck(fromData, long));
        let checkedData = this.longShortCheck(fromData);
        //define regex for lead dlugi
        for (let i = 0; i < checkedData.length; i++) {
            if (container.indexOf(checkedData[i][0]) == -1) { //if product doesn't exist in arr, push its name and first ocurrence to it
                container.push(checkedData[i][0]);
                container.push(1);
            } else {
                container[container.indexOf(checkedData[i][0]) + 1]++;
            }
        }
        //counting ended 
        let render = container.map(function (current, index) {
            if (index % 2 === 0) {
                return "<tr><td>" + current + "</td>";
            } else {
                return "<td>" + current + "</td></tr>";

            }
        });

        // output.innerHTML += container.toString().replace(/,/g, "<br>");
        //console.log(render);
        return render;
    }

    longShortCheck(all, long) { //or maybe all of it and delete true shorts from it
        //this function deletes short leads if a short lead led to long lead
        let checkedAll = all;
        //console.log(long);
        for (let i = all.length - 1; i >= 0; i--) {
            if (long != undefined || long != null) {
                if (long.find(function (e) {
                        if (!long) {
                            return undefined;
                        } else return e[5] == all[i][5];
                    }) &&
                    /Lead/.test(checkedAll[i])) {
                    checkedAll.splice(i, 1); //because how splice works, loop is working from the end towards the beginning
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