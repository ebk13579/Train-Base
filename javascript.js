$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDaX7ASspAldpHrLYUMYdLA2Pwh9eCgKCA",
        authDomain: "train-base-7de23.firebaseapp.com",
        databaseURL: "https://train-base-7de23.firebaseio.com",
        projectId: "train-base-7de23",
        storageBucket: "train-base-7de23.appspot.com",
        messagingSenderId: "1022922947656"
    };
    firebase.initializeApp(config);

    //Reference database
    database = firebase.database();

    /*Global Variables*/
    var trainName = '';
    var dest = '';
    var firstTrainTime = '';
    var freq = '';
    var firstTimeConverted = "";
    var diffTime = "";
    var tRemainder = "";
    var tMinutesTillTrain = "";
    var nextTrain = "";
    var trainNameData = '';
    var destData = '';
    var arrivalData = '';
    var freqData = '';
    var minutesAwayData = '';

    $('#submit').on('click', function (event) {
        event.preventDefault();
        trainName = $('#trainName').val().trim();
        dest = $('#dest').val().trim();
        firstTrainTime = $('#1stTrainTime').val().trim();
        console.log("1stTrainTime: " + firstTrainTime);
        freq = $('#freq').val().trim();


        //Trying to remove input text... 
        $('#trainName').val('');
        $('#dest').val('');
        // $('#firstTrainTime').text = '';
        $('#1stTrainTime').val('');
        $('#freq').val('');

        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        console.log("1stTimeConverted: " + firstTimeConverted);
        
        var currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("diffTime: " + diffTime);

        tRemainder = diffTime % freq;

        tMinutesTillTrain = freq - tRemainder;
        console.log("T-minus: " + tMinutesTillTrain);

        nextTrain = moment().add(tMinutesTillTrain, "minutes");
        nextTrain = moment().subtract(1, "minutes");
        nextTrainFormat = moment(nextTrain).format('hh:mm');

        database.ref().push({
            trainName: trainName,
            destination: dest,
            arrival: nextTrainFormat,
            minutesAway: tMinutesTillTrain,
            frequency: freq
        });
    });

    database.ref().on('child_added', function (snap) {
        
        trainNameData = snap.val().trainName;
        destData = snap.val().destination;
        arrivalData = snap.val().arrival;
        freqData = snap.val().frequency;
        minutesAwayData = snap.val().minutesAway;

        var dataArray = [trainNameData, destData, freqData, arrivalData, minutesAwayData];
        var newTr = $('<tr>');
        for (var i = 0; i < dataArray.length; i++) {
            var newTd = $('<td>');
            newTd.text(dataArray[i]);
            newTd.appendTo(newTr);
        }
        $('.table').append(newTr);
    });
})