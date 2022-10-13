const myString = "fileName.txt";

function removeExtension(myString) {
    console.log(myString.substring(0, myString.lastIndexOf('.')));
}

removeExtension(myString);
console.log(myString.substring(0, myString.lastIndexOf('.')));
