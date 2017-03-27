//start doing class
class csvAnalyzer {
    constructor(csvFile) {
        'use strict';
        this.preParsed = csvFile;
    }
    interpretData() {
        this.partnerships = this.parsedFile.data.filter(function (e) {
            return /PARTNERSTWA/.test(e[3]);
        });
        this.dartGoogle = this.parsedFile.data.filter(function (e) {
            return /DART/.test(e[3]);
        });
        this.publishers = this.parsedFile.data.filter(function (e) {
            return !/DART/.test(e[3]) && !/PARTNERSTWA/.test(e[3]) && e[5];
        });

        const countPublishers = this.countOcurrence(this.publishers);
        console.log(countPublishers);
        const countSearch = this.countOcurrence(this.dartGoogle);
        const countPartnerships = this.countOcurrence(this.partnerships);
        console.log(countSearch);
        console.log(countPartnerships);
        //now it's time to render
    }

    countOcurrence(fromData, container = []) {
        for (let i = 0; i < fromData.length; i++) {
            if (container.indexOf(fromData[i][0]) == -1) {
                container.push(fromData[i][0]);
                container.push(1);
            } else {
                container[container.indexOf(fromData[i][0]) + 1]++;
            }
        }
        return container;
    }

    initiateParse(file = this.preParsed) {
        this.reader = new FileReader();
        this.reader.readAsText(file);
        this.reader.onload = this.loadHandler.bind(this);
        this.reader.onerror = this.errorHandler;
    }
    errorHandler(event) {
        return event.toString();
    }
    loadHandler(event) {
        this.parsedFile = Papa.parse(event.target.result); //wrong binding it binds to file reader when it should bind with - now solved
        debugger;
        this.interpretData(); //possible bind problem - now solved
    }


}

const upload = document.getElementById('analyze');

upload.addEventListener('click', function (e) {
    e.preventDefault();
    let analyzer = new csvAnalyzer(document.getElementById('file').files[0]);
    analyzer.initiateParse();
    // getAsText(x); //change that to new class call //asynchronous problem?
});
