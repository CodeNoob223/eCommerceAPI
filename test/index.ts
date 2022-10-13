const myString :String = "fileName.txt";

function removeExtension(myString: String) {
    console.log(myString.substring(0, myString.lastIndexOf('.')));
}

removeExtension(myString);